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
  instance: ButtplugInstance | null;
  clients: Record<string, ButtplugClientHandle>;

  clientConfigs: Record<string, ButtplugClientConfig>;

  setInstance: (instance: ButtplugInstance) => void;

  addClient: (client: ButtplugClientConfig) => void;

  syncClients: () => void;
}

export const useButtplugStore = create<ButtplugState>()(
  devtools(
    (set, get) => ({
      instance: null,
      clientConfigs: {},
      clients: {},

      setInstance: (instance) => {
        console.log("Setting new buttplug instance: ", instance);
        set(() => ({ instance: instance }));
        get().syncClients();
      },

      addClient: (client) => {
        set((store) => ({
          clientConfigs: { ...store.clientConfigs, [client.id]: client },
        }));
        get().syncClients();
      },

      syncClients: () => {
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
                        devices: devices.map((it) => it.Name),
                      },
                    },
                  },
                }));
              });
            },
            store.instance
          ),
        }));
      },
    }),
    {
      name: "buttplug-storage",
    }
  )
);

export type ButtplugInstance = any;

export function setButtplugInstance(instance: ButtplugInstance) {
  unstable_batchedUpdates(() => {
    useButtplugStore.getState().setInstance(instance);
  });
}
