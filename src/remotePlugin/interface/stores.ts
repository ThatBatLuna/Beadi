import produce from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";
import { diffBy } from "../../utils/diffBy";
import _ from "lodash";

type InterfaceDisplayDef = {
  interfaceId: string;
  brokerType: string;
  brokerSettings: any;
};
type InterfaceDisplayStore = {
  interfaces: Record<string, InterfaceDisplayDef>;

  /** Local Interfaces are synced from the files tore */
  addRemoteInterface: (brokerSettings?: any) => void;
};
/** Make mutations to the displayed interfaces on this store, that gets synced into useInterfaceDisplayStateStore, read from there */
export const useInterfaceDisplayStore = create<InterfaceDisplayStore>()(
  persist(
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
};
type InterfaceDisplayStateStore = {
  interfaces: Record<string, InterfaceDisplayState>;
};
export const useInterfaceDisplayStateStore = create<InterfaceDisplayStateStore>()((set, get) => ({
  interfaces: {},
}));

export function setupInterfaceListeners() {
  console.log("Setup Interface Listeners");

  const syncInterfaceDisplayStateStore = (state: InterfaceDisplayStore) => {
    const oldStateStore = useInterfaceDisplayStateStore.getState();
    const { extra, missing } = diffBy(Object.keys(oldStateStore.interfaces), Object.keys(state.interfaces));

    useInterfaceDisplayStateStore.setState((s) =>
      produce(s, (draft) => {
        for (const extraKey in extra) {
          //TODO Close up the broker.
          delete draft.interfaces[extraKey];
        }
        for (const missingKey in missing) {
          const interfaceDef = state.interfaces[missingKey];
          //TODO Open up the broker.
          draft.interfaces[missingKey] = {
            brokerType: interfaceDef.brokerType,
            brokerState: {},
            interfaceId: missingKey,
            layout: [],
            values: {},
          };
        }
      })
    );
  };
  useInterfaceDisplayStore.subscribe(syncInterfaceDisplayStateStore);
  syncInterfaceDisplayStateStore(useInterfaceDisplayStore.getState());

  const syncLocalInterfacesFromFileStore = (state: InterfaceFileStore) => {
    const existingLocalInterfaces = _.pickBy(useInterfaceDisplayStore.getState().interfaces, (s) => s.brokerType === "local");
    const { extra, missing } = diffBy(Object.keys(existingLocalInterfaces), Object.keys(state.interfaces));

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
