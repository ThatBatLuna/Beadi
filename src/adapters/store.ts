import { devtools } from "zustand/middleware";
import create from "zustand";
import _ from "lodash";
import { ButtplugClientState, syncClientState } from "./buttplug";
import { ButtplugClient, ButtplugClientDevice } from "buttplug";
import { unstable_batchedUpdates } from "react-dom";

export type ButtplugClientActions = {
  connect: () => void;
  disconnect: () => void;
  scan: () => void;
  stopScan: () => void;
  stopAll: () => void;
};

export type ButtplugClientHandle = {
  state: ButtplugClientState;
  client: ButtplugClient;
  devices: ButtplugClientDevice[];
  config: ButtplugClientConfig;
  actions: ButtplugClientActions;
};

export type ButtplugClientConfig = {
  id: string;
  name: string;
  connection: string;
};

interface ButtplugState {
  clients: Record<string, ButtplugClientHandle>;

  clientConfigs: Record<string, ButtplugClientConfig>;

  addClient: (client: ButtplugClientConfig) => void;
  deleteClient: (clientId: string) => void;

  syncClients: () => void;
}

function loadClientConfigs(): Record<string, ButtplugClientConfig> {
  const json = localStorage.getItem("beadi-clients");
  if (json !== undefined && json !== null) {
    try {
      const parsed = JSON.parse(json);
      //TODO Check schema of parsed
      return parsed as any;
    } catch {}
  }
  return {};
}

export const useButtplugStore = create<ButtplugState>()(
  devtools(
    (set, get) => ({
      instance: null,
      clientConfigs: loadClientConfigs(), //SetInstance should call syncClients()
      clients: {},

      addClient: (client) => {
        set((store) => ({
          clientConfigs: { ...store.clientConfigs, [client.id]: client },
        }));
        get().syncClients();
      },

      deleteClient: (client) => {
        set((store) => ({
          clientConfigs: {
            ..._.omit(store.clientConfigs, client),
          },
        }));
        get().syncClients();
      },

      syncClients: () => {
        localStorage.setItem(
          "beadi-clients",
          JSON.stringify(get().clientConfigs)
        );
        set((store) => ({
          clients: syncClientState(
            store.clients,
            store.clientConfigs,
            (clientId, update) => {
              unstable_batchedUpdates(() => {
                set((store) => ({
                  clients: {
                    ...store.clients,
                    [clientId]: {
                      ...store.clients[clientId],
                      state: {
                        ...store.clients[clientId].state,
                        ...update,
                      },
                    },
                  },
                }));
              });
            },
            (clientId, devices) => {
              unstable_batchedUpdates(() => {
                set((store) => ({
                  clients: {
                    ...store.clients,
                    [clientId]: {
                      ...store.clients[clientId],
                      devices: devices,
                      state: {
                        ...store.clients[clientId].state,
                        devices: devices.map((it) => it.name),
                      },
                    },
                  },
                }));
              });
            }
          ),
        }));
      },
    }),
    {
      name: "buttplug-storage",
    }
  )
);

// export type ButtplugInstance = any;

// export function setButtplugInstance(instance: ButtplugInstance) {
//   unstable_batchedUpdates(() => {
//     useButtplugStore.getState().setInstance(instance);
//   });
// }
