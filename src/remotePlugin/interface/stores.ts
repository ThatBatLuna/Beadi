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
type InterfaceDisplayStore = {
  interfaces: Record<string, InterfaceDisplayDef>;

  /** Local Interfaces are synced from the files tore */
  addRemoteInterface: (interfaceId: string, brokerSettings: RemoteBrokerSettings) => void;
  removeRemoteInterface: (interfaceId: string) => void;
};
/** Make mutations to the displayed interfaces on this store, that gets synced into useInterfaceDisplayStateStore, read from there */
export const useInterfaceDisplayStore = create(
  devtools(
    persist<InterfaceDisplayStore>(
      (set, get) => ({
        interfaces: {},

        addRemoteInterface: (interfaceId, settings) => {
          set((s) =>
            produce(s, (draft) => {
              draft.interfaces[interfaceId] = {
                interfaceId: interfaceId,
                brokerType: "remote",
                brokerSettings: settings,
              };
            })
          );
        },
        removeRemoteInterface: (interfaceId) => {
          set((s) =>
            produce(s, (draft) => {
              delete draft.interfaces[interfaceId];
            })
          );
        },
      }),
      {
        name: "interfaceDisplay",
        getStorage: () => window.sessionStorage,
        version: 1,
      }
    ),
    {
      name: "useInterfaceDisplayStore",
    }
  )
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
};
type InterfaceDisplayState = {
  interfaceId: string;
  layout: Widget[];
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
type Getter = () => InterfaceDisplayState;
function createRemoteBrokeredInterface(
  def: InterfaceDisplayDef & { brokerType: "remote" },
  set: Setter
): InterfaceDisplayState & { brokerType: "remote" } {
  const syncRemoteStateStore = (s: RemoteStateStore) => {
    const remoteState = s.remotes[def.brokerSettings.remoteId].state;
    if (remoteState.state === "connected") {
      set((draft) => {
        draft.values = remoteState.values;
        draft.layout = remoteState.interfaces[def.interfaceId].layout;
      });
    }
  };

  const unsubscribeIO = useRemoteStateStore.subscribe(syncRemoteStateStore);

  const remoteState = useRemoteStateStore.getState().remotes[def.brokerSettings.remoteId].state;

  return {
    brokerType: "remote",
    brokerState: {},
    interfaceId: def.interfaceId,
    layout: remoteState.state === "connected" ? _.cloneDeep(remoteState.interfaces[def.interfaceId].layout) : [],
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
      draft.layout = s.interfaces[def.interfaceId].layout;
    });
  });

  return {
    brokerType: "local",
    brokerState: {},
    interfaceId: def.interfaceId,
    layout: useInterfaceFileStore.getState().interfaces[def.interfaceId].layout,
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

  const syncInterfaceDisplayStateStore = (state: InterfaceDisplayStore) => {
    const oldStateStore = useInterfaceDisplayStateStore.getState();
    const { extra, missing } = diffByKeys(oldStateStore.interfaces, state.interfaces);

    useInterfaceDisplayStateStore.setState((s) =>
      produce(s, (draft) => {
        for (const extraKey in extra) {
          //TODO Close up the broker.
          draft.interfaces[extraKey].closeBroker();
          delete draft.interfaces[extraKey];
        }
        for (const missingKey in missing) {
          const interfaceDef = missing[missingKey];

          const set: Setter = (recipe) => {
            useInterfaceDisplayStateStore.setState((s) => produce(s, (draft) => recipe(draft.interfaces[missingKey])));
          };
          //TODO Open up the broker.
          if (interfaceDef.brokerType === "local") {
            draft.interfaces[missingKey] = createLocalBrokeredInterface(interfaceDef, set);
          } else {
            draft.interfaces[missingKey] = createRemoteBrokeredInterface(interfaceDef, set);
          }
        }
      })
    );
  };
  useInterfaceDisplayStore.subscribe(syncInterfaceDisplayStateStore);
  syncInterfaceDisplayStateStore(useInterfaceDisplayStore.getState());

  const syncLocalInterfacesFromFileStore = (state: InterfaceFileStore) => {
    const existingLocalInterfaces = _.pickBy(useInterfaceDisplayStore.getState().interfaces, (s) => s.brokerType === "local");
    const { extra, missing } = diffByKeys(existingLocalInterfaces, state.interfaces);

    useInterfaceDisplayStore.setState((s) =>
      produce(s, (draft) => {
        for (const extraKey in extra) {
          delete draft.interfaces[extraKey];
        }
        for (const missingKey in missing) {
          draft.interfaces[missingKey] = {
            brokerSettings: {},
            brokerType: "local",
            interfaceId: missingKey,
          };
        }
      })
    );
  };
  useInterfaceFileStore.subscribe(syncLocalInterfacesFromFileStore);
  syncLocalInterfacesFromFileStore(useInterfaceFileStore.getState());
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
export function useWidgetValueHandle<T>(valueId: string, interfaceId: string): WidgetValueHandle<T> {
  const iface = useInterfaceDisplayStateStore((s) => s.interfaces[interfaceId]);

  const updateValue = iface.updateValue;
  const setValue = useCallback(
    (v: T) => {
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

  return {
    value: iface.values[valueId].value,
    setValue,
    error: undefined,
  };
}
