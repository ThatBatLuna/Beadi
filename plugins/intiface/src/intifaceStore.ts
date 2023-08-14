import produce, { Draft } from "immer";
import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { ButtplugClient, ButtplugBrowserWebsocketClientConnector, ButtplugClientDevice, ActuatorType } from "buttplug";
import { BeadiContext } from "@beadi/engine";
import { useIntifaceStore } from "./storage";
import _ from "lodash";

type IntifaceActuatorAttribute = {
  featureDescriptor: string;
  actuatorType: ActuatorType;
  actuatorKind: "scalar" | "rotate" | "linear";
};
type IntifaceDevice = {
  name: string;
  displayName: string;
  deviceIndex: number;
  actuactors: IntifaceActuatorAttribute[];
};

export type IntifaceConnectionDef = {
  url: string;
};
export type IntifaceConnection = {
  id: string;
  def: IntifaceConnectionDef;
  state: IntifaceConnectionState;
};

type IntifaceConnectionState =
  | {
      state: "disconnected";
      connect: () => void;
    }
  | {
      state: "connected";
      client: ButtplugClient;
      devices: Record<string, IntifaceDevice>;
      scanning: boolean;
      startScan: () => void;
      stopScan: () => void;
      disconnect: () => void;
    }
  | {
      devices: Record<string, IntifaceDevice>;
      state: "connecting";
      client: ButtplugClient;
      disconnect: () => void;
    };

type StateControls = {
  set: (recipe: ((draft: Draft<IntifaceConnectionState>) => void) | IntifaceConnectionState) => void;
  get: () => IntifaceConnection;
};
function makeDisconnectedState(actions: StateControls): IntifaceConnectionState & { state: "disconnected" } {
  return {
    state: "disconnected",
    connect: () => {
      //Transition to Connecting
      actions.set(makeConnectingState(actions));
    },
  };
}
function makeConnectingState(actions: StateControls): IntifaceConnectionState & { state: "connecting" } {
  const client = new ButtplugClient();

  const deviceAddedListener = (device: ButtplugClientDevice) => {
    console.warn("Device Connected while connecting ", device);
  };
  const deviceRemovedListener = (device: ButtplugClientDevice) => {
    console.warn("Device Removed while connecting", device);
  };
  const scanningFinishedListener = (e: unknown) => {
    console.warn("ScanningFinished while connecting", e);
  };
  const disconnectListener = () => {
    disconnect();
  };

  client.addListener("deviceadded", deviceAddedListener);
  client.addListener("deviceremoved", deviceRemovedListener);
  client.addListener("scanningfinished", scanningFinishedListener);
  client.addListener("disconnect", disconnectListener);

  const disconnect = () => {
    client.removeAllListeners();
    if (client.connected) {
      client.disconnect();
    }
    actions.set(makeDisconnectedState(actions));
  };

  const connector = new ButtplugBrowserWebsocketClientConnector(actions.get().def.url);
  client
    .connect(connector)
    .then(() => {
      actions.set(makeConnectedState(client, actions));
    })
    .catch((e) => {
      console.error("WebsocketClientConnector couldn't connect: ", e);
      disconnect();
    });

  return {
    state: "connecting",
    client,
    devices: {},
    disconnect,
  };
}

function makeDevice(device: ButtplugClientDevice): IntifaceDevice {
  return {
    name: device.name,
    displayName: device.displayName ?? device.name,
    deviceIndex: device.index,
    actuactors: [
      ...(device.messageAttributes.LinearCmd?.map((it) => ({
        featureDescriptor: it.FeatureDescriptor,
        actuatorType: it.ActuatorType,
        actuatorKind: "linear" as const,
      })) ?? []),
      ...(device.messageAttributes.RotateCmd?.map((it) => ({
        featureDescriptor: it.FeatureDescriptor,
        actuatorType: it.ActuatorType,
        actuatorKind: "rotate" as const,
      })) ?? []),
      ...(device.messageAttributes.ScalarCmd?.map((it) => ({
        featureDescriptor: it.FeatureDescriptor,
        actuatorType: it.ActuatorType,
        actuatorKind: "scalar" as const,
      })) ?? []),
    ],
  };
}
function makeConnectedState(client: ButtplugClient, actions: StateControls): IntifaceConnectionState & { state: "connected" } {
  const deviceAddedListener = (device: ButtplugClientDevice) => {
    actions.set((d) => {
      if (d.state === "connected") {
        d.devices[device.index] = makeDevice(device);
      }
    });
  };
  const deviceRemovedListener = (device: ButtplugClientDevice) => {
    actions.set((d) => {
      if (d.state === "connected") {
        delete d.devices[device.index];
      }
    });
  };
  const scanningFinishedListener = () => {
    console.log("Scanning finished");
    actions.set((d) => {
      if (d.state === "connected") {
        d.scanning = false;
      }
    });
  };
  const disconnectListener = () => {
    disconnect();
  };

  client.addListener("deviceadded", deviceAddedListener);
  client.addListener("deviceremoved", deviceRemovedListener);
  client.addListener("scanningfinished", scanningFinishedListener);
  client.addListener("disconnect", disconnectListener);

  const disconnect = () => {
    client.removeAllListeners();
    if (client.connected) {
      client.disconnect();
    }
    actions.set(makeDisconnectedState(actions));
  };

  const startScan = () => {
    client.startScanning().then(() => {
      actions.set((d) => {
        if (d.state === "connected") {
          d.scanning = true;
        }
      });
    });
  };

  const stopScan = () => {
    client.stopScanning().then(() => {
      actions.set((d) => {
        if (d.state === "connected") {
          d.scanning = false;
        }
      });
    });
  };

  return {
    state: "connected",
    client,
    scanning: false,
    devices: _.keyBy(
      client.devices.map((it) => makeDevice(it)),
      (it) => it.deviceIndex
    ),
    disconnect,
    startScan,
    stopScan,
  };
}

type IntifaceStore = {
  connections: Record<string, IntifaceConnection>;

  addConnection: (def: IntifaceConnectionDef, connectImmediately?: boolean) => void;
  removeConnection: (id: string) => void;
};
export function makeIntifaceStore() {
  return createStore(
    devtools<IntifaceStore>((set, get) => ({
      connections: {},

      addConnection: (def, connectImmediately = false) => {
        const id = `${new Date().getTime()}`;
        const state = makeDisconnectedState({
          get: () => {
            return get().connections[id];
          },
          set: (recipe) => {
            if (typeof recipe === "function") {
              set((s) =>
                produce(s, (draft) => {
                  recipe(draft.connections[id].state);
                })
              );
            } else {
              set((s) =>
                produce(s, (draft) => {
                  draft.connections[id].state = recipe;
                })
              );
            }
          },
        });
        set((s) =>
          produce(s, (draft) => {
            draft.connections[id] = {
              def: def,
              id: id,
              state: state,
            };
          })
        );
        if (connectImmediately) {
          console.log("Connect immediately");
          state.connect();
        }
      },
      removeConnection: (id) => {
        const state = get().connections[id].state;
        if (state.state !== "disconnected") {
          state.disconnect();
        } else {
          set((s) =>
            produce(s, (draft) => {
              delete draft.connections[id];
            })
          );
        }
      },
    }))
  );
}

export function persistIntifaceStore(beadi: BeadiContext) {
  const selectPersistent = (store: IntifaceStore) => {
    return _.values(store.connections).map((c) => ({
      def: c.def,
      connected: c.state.state === "connected",
    }));
  };

  useIntifaceStore.subscribeWith(beadi, (store) => {
    const serialized = JSON.stringify(selectPersistent(store));
    localStorage.setItem("intifaceStore", serialized);
  });

  //Loading

  const stored = localStorage.getItem("intifaceStore");
  if (stored != null) {
    const deserialized: ReturnType<typeof selectPersistent> = JSON.parse(stored);
    //TODO Check schema of deserialized
    for (const def of deserialized) {
      useIntifaceStore.getStateWith(beadi).addConnection(def.def, def.connected);
    }
  }
}
