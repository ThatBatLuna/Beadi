import produce, { Draft } from "immer";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { diffByKeys } from "../../utils/diffBy";
import _ from "lodash";
import { useCallback } from "react";
import { usePublishStateStore } from "../publish/store";
import { useIOValueStore } from "../inputOutputStore";
import { RemoteStateStore, useRemoteStateStore } from "../remote/store";
import { sendMessage } from "../message";
import { HandleType, TypeOfHandleType } from "../../engine/node";

type RemoteBrokerSettings = {
  remoteId: string;
};
type InterfaceDisplayDef = {
  interfaceId: string;
} & (
  | {
      brokerType: "remote";
      brokerSettings: RemoteBrokerSettings;
    }
  | {
      brokerType: "local";
      brokerSettings: {};
    }
);
type Widget = {
  widgetId: string;
  widgetType: string;
  settings: any;
};
export type Interface = {
  name: string;
  interfaceId: string;
  layout: Widget[];
};
//TODO This has to be merged into the save file
type InterfaceFileStore = {
  interfaces: Record<string, Interface>;
  addInterface: () => void;
  updateInterface: (interfaceId: string, recipe: (draft: Draft<Interface>) => void) => void;
  deleteInterface: (interfaceId: string) => void;
};
export const useInterfaceFileStore = create<InterfaceFileStore>()(
  devtools(
    persist(
      (set, get) => ({
        interfaces: {},
        addInterface: () => {
          const interfaceId = `${new Date().getTime()}`;
          set((s) =>
            produce(s, (draft) => {
              draft.interfaces[interfaceId] = {
                interfaceId: interfaceId,
                layout: [],
                name: "New Interface",
              };
            })
          );
        },
        updateInterface: (interfaceId, recipe) => {
          set((s) =>
            produce(s, (draft) => {
              recipe(draft.interfaces[interfaceId]);
            })
          );
        },
        deleteInterface: (interfaceId) => {
          set((s) =>
            produce(s, (draft) => {
              delete draft.interfaces[interfaceId];
            })
          );
        },
      }),
      {
        name: "interfaceFile",
        getStorage: () => window.localStorage,
        version: 1,
      }
    ),
    { name: "useInterfaceFileStore" }
  )
);

type InterfaceDisplayValueState = {
  valueId: string;
  value: any;
  type: HandleType;
};
type InterfaceDisplayState = {
  // interfaceId: string;
  // layout: Widget[];
  def: Interface;
  values: Record<string, InterfaceDisplayValueState>;
  brokerState: any;
  brokerType: string;
  updateValue: (valueId: string, value: any) => void;
  closeBroker: () => void;
};
type InterfaceDisplayStateStore = {
  interfaces: Record<string, InterfaceDisplayState>;
};
export const useInterfaceDisplayStateStore = create<InterfaceDisplayStateStore>()(
  devtools(
    (set, get) => ({
      interfaces: {},
    }),
    { name: "useInterfaceDisplayStateStore" }
  )
);

type Setter = (recipe: (draft: Draft<InterfaceDisplayState>) => void) => void;
// type Getter = () => InterfaceDisplayState;
function createRemoteBrokeredInterface(
  def: InterfaceDisplayDef & { brokerType: "remote" },
  set: Setter
): InterfaceDisplayState & { brokerType: "remote" } {
  const syncRemoteStateStore = (s: RemoteStateStore) => {
    const remoteState = s.remotes[def.brokerSettings.remoteId]?.state;
    if (remoteState !== undefined && remoteState.state === "connected" && remoteState.interfaces[def.interfaceId] !== undefined) {
      set((draft) => {
        draft.values = remoteState.values;
        draft.def = remoteState.interfaces[def.interfaceId];
      });
    }
  };

  const unsubscribeIO = useRemoteStateStore.subscribe(syncRemoteStateStore);

  console.log(def.brokerSettings);
  const remoteState = useRemoteStateStore.getState().remotes[def.brokerSettings.remoteId].state;

  return {
    brokerType: "remote",
    brokerState: {},
    def:
      remoteState.state === "connected"
        ? _.cloneDeep(remoteState.interfaces[def.interfaceId])
        : {
            interfaceId: def.interfaceId,
            layout: [],
            name: "...",
          },
    values: remoteState.state === "connected" ? _.cloneDeep(remoteState.values) : {},
    updateValue: (valueId, value) => {
      console.log("Remotely updating ", valueId, " to ", value);
      const state = useRemoteStateStore.getState().remotes[def.brokerSettings.remoteId].state;
      if (state.state === "connected") {
        sendMessage(state.socket, {
          ValueChanged: {
            endpoint: valueId,
            value: value,
          },
        });
      }
    },
    closeBroker: () => {
      unsubscribeIO();
    },
  };
}
function createLocalBrokeredInterface(
  def: InterfaceDisplayDef & { brokerType: "local" },
  set: Setter
): InterfaceDisplayState & { brokerType: "local" } {
  const unsubscribeIO = useIOValueStore.subscribe((s) => {
    set((draft) => {
      draft.values = s.values;
    });
  });
  const unsubscribeInterfaceFile = useInterfaceFileStore.subscribe((s) => {
    set((draft) => {
      if (s.interfaces[def.interfaceId] === undefined) {
        console.warn("Tried to update interface broker for nonexisting interface.", def.interfaceId);
        return;
      }
      draft.def = _.cloneDeep(s.interfaces[def.interfaceId]);
    });
  });

  return {
    brokerType: "local",
    brokerState: {},
    def: _.cloneDeep(useInterfaceFileStore.getState().interfaces[def.interfaceId]),
    values: useIOValueStore.getState().values,
    updateValue: (valueId, value) => {
      console.log("Locally udpating ", valueId, " to ", value);
      usePublishStateStore.getState().state.updateValue(valueId, value);
    },
    closeBroker: () => {
      unsubscribeIO();
      unsubscribeInterfaceFile();
    },
  };
}

export function setupInterfaceListeners() {
  console.log("Setup Interface Listeners");

  const syncLocalInterfacesFromFileStore = (state: InterfaceFileStore) => {
    const existingLocalInterfaces = _.pickBy(useInterfaceDisplayStateStore.getState().interfaces, (s) => s.brokerType === "local");
    const { extra, missing } = diffByKeys(existingLocalInterfaces, state.interfaces);

    useInterfaceDisplayStateStore.setState((s) =>
      produce(s, (draft) => {
        for (const extraKey in extra) {
          delete draft.interfaces[extraKey];
        }
        for (const missingKey in missing) {
          const set: Setter = (recipe) => {
            useInterfaceDisplayStateStore.setState((s) => produce(s, (draft) => recipe(draft.interfaces[missingKey])));
          };
          draft.interfaces[missingKey] = createLocalBrokeredInterface(
            {
              brokerSettings: {},
              brokerType: "local",
              interfaceId: missingKey,
            },
            set
          );
        }
      })
    );
  };
  useInterfaceFileStore.subscribe(syncLocalInterfacesFromFileStore);
  syncLocalInterfacesFromFileStore(useInterfaceFileStore.getState());

  const syncRemoteInterfacesFromRemoteStore = (state: RemoteStateStore) => {
    console.log("SSS", state);
    const existingLocalInterfaces = _.pickBy(useInterfaceDisplayStateStore.getState().interfaces, (s) => s.brokerType === "remote");
    const allRemoteInterfaces: Record<string, { interface: Interface; remoteId: string }> = Object.assign(
      {},
      ...Object.entries(state.remotes).flatMap(([remoteId, remote]) => {
        const state = remote.state;
        if (state.state === "connected") {
          return Object.values(state.interfaces).map((iface) => ({ [iface.interfaceId]: { interface: iface, remoteId: remoteId } }));
        } else {
          return [];
        }
      })
    );
    const { extra, missing, changed } = diffByKeys(existingLocalInterfaces, allRemoteInterfaces);

    useInterfaceDisplayStateStore.setState((s) =>
      produce(s, (draft) => {
        console.log("Extra: ", extra, "Missing: ", missing, "Changed: ", changed);
        for (const extraKey in extra) {
          delete draft.interfaces[extraKey];
        }
        for (const missingKey in missing) {
          console.log("ADDING: ", missingKey);
          // draft.interfaces[missingKey] = {
          //   brokerSettings: {
          //     remoteId: missing[missingKey].remoteId,
          //   },
          //   brokerType: "remote",
          //   interfaceId: missingKey,
          // };
          const set: Setter = (recipe) => {
            useInterfaceDisplayStateStore.setState((s) => produce(s, (draft) => recipe(draft.interfaces[missingKey])));
          };
          draft.interfaces[missingKey] = createRemoteBrokeredInterface(
            {
              brokerSettings: {
                remoteId: missing[missingKey].remoteId,
              },
              brokerType: "remote",
              interfaceId: missingKey,
            },
            set
          );
          console.log(draft.interfaces);
        }
      })
    );
  };
  useRemoteStateStore.subscribe(syncRemoteInterfacesFromRemoteStore);
  syncRemoteInterfacesFromRemoteStore(useRemoteStateStore.getState());
}

setupInterfaceListeners();

const NULL_SET_VALUE = (value: any) => {
  console.log("Tried to setValue on an invalid widget");
};
type WidgetValueHandle<T> =
  | {
      value: T;
      setValue: (n: T) => void;
      error: undefined;
    }
  | {
      value: null;
      setValue: (n: T) => void;
      error: string;
    };
export function useWidgetValueHandle<T extends HandleType>(
  valueId: string,
  interfaceId: string,
  type: T
): WidgetValueHandle<TypeOfHandleType<T>> {
  const iface = useInterfaceDisplayStateStore((s) => s.interfaces[interfaceId]);

  const updateValue = iface.updateValue;
  const setValue = useCallback(
    (v: TypeOfHandleType<T>) => {
      updateValue(valueId, v);
    },
    [valueId, updateValue]
  );

  if (iface === undefined) {
    return {
      value: null,
      setValue: () => NULL_SET_VALUE,
      error: `Invalid Interface ${interfaceId}`,
    };
  }

  if (iface.values[valueId] === undefined) {
    return {
      value: null,
      setValue: () => NULL_SET_VALUE,
      error: `Value ${valueId} does not exist in Interface ${interfaceId}`,
    };
  }

  const value = iface.values[valueId];
  if (value.type !== type) {
    return {
      value: null,
      setValue: () => NULL_SET_VALUE,
      error: `Value ${valueId} in Interface ${interfaceId} has wrong type: ${value.type} (${type} was expected)`,
    };
  }

  return {
    value: value.value,
    setValue,
    error: undefined,
  };
}
