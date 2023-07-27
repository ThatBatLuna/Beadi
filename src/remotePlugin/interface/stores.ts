import produce, { Draft } from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";
import { diffBy, diffByKeys } from "../../utils/diffBy";
import _ from "lodash";
import { useCallback } from "react";
import { usePublishStateStore } from "../publish/store";
import { useIOValueStore } from "../inputOutputStore";
import { useRemoteStateStore } from "../remote/store";
import { remoteInputAdapter } from "../inputAdapter";

type InterfaceDisplayDef = {
  interfaceId: string;
} & (
  | {
      brokerType: "remote";
      brokerSettings: {
        remoteId: string;
      };
    }
  | {
      brokerType: "local";
      brokerSettings: {};
    }
);
type InterfaceDisplayStore = {
  interfaces: Record<string, InterfaceDisplayDef>;

  /** Local Interfaces are synced from the files tore */
  addRemoteInterface: (brokerSettings?: any) => void;
};
/** Make mutations to the displayed interfaces on this store, that gets synced into useInterfaceDisplayStateStore, read from there */
export const useInterfaceDisplayStore = create(
  persist<InterfaceDisplayStore>(
    (set, get) => ({
      interfaces: {},

      addRemoteInterface: (settings) => {
        const interfaceId = `${new Date().getTime()}`;
        set((s) =>
          produce(s, (draft) => {
            draft.interfaces[interfaceId] = {
              interfaceId: interfaceId,
              brokerType: "remote",
              brokerSettings: settings ?? {},
            };
          })
        );
      },
    }),
    {
      name: "interfaceDisplay",
      getStorage: () => window.sessionStorage,
      version: 1,
    }
  )
);

type Widget = {
  widgetId: string;
  widgetType: string;
  settings: any;
};
type Interface = {
  name: string;
  interfaceId: string;
  layout: Widget[];
};
//TODO This has to be merged into the save file
type InterfaceFileStore = {
  interfaces: Record<string, Interface>;
  addInterface: () => void;
  updateInterface: (interfaceId: string, recipe: (draft: Draft<Interface>) => void) => void;
};
export const useInterfaceFileStore = create<InterfaceFileStore>()(
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
    }),
    {
      name: "interfaceFile",
      getStorage: () => window.localStorage,
      version: 1,
    }
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
export const useInterfaceDisplayStateStore = create<InterfaceDisplayStateStore>()((set, get) => ({
  interfaces: {},
}));

type Setter = (recipe: (draft: Draft<InterfaceDisplayState>) => void) => void;
type Getter = () => InterfaceDisplayState;
function createRemoteBrokeredInterface(
  def: InterfaceDisplayDef & { brokerType: "remote" },
  set: Setter
): InterfaceDisplayState & { brokerType: "remote" } {
  const unsubscribeIO = useRemoteStateStore.subscribe((s) => {
    const remoteState = s.remotes[def.brokerSettings.remoteId].state;
    if (remoteState.state === "connected") {
      set((draft) => {
        draft.values = remoteState.values;
      });
    }
  });
  return {
    brokerType: "remote",
    brokerState: {},
    interfaceId: def.interfaceId,
    layout: [],
    values: {},
    updateValue: (valueId, value) => {
      console.log("Remotely updating ", valueId, " to ", value);
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

type WidgetValueHandle<T> = {
  value: T;
  setValue: (n: T) => void;
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
  return {
    value: iface.values[valueId].value,
    setValue,
  };
}
