import produce, { Draft } from "immer";
import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import {
  ButtplugClient,
  ButtplugBrowserWebsocketClientConnector,
  ButtplugClientDevice,
  ActuatorType,
  ScalarCmd,
  ScalarSubcommand,
  RotateSubcommand,
  RotateCmd,
  LinearCmd,
  VectorSubcommand,
} from "buttplug";
import {
  BeadiContext,
  BeadiFileData,
  FileStore,
  OUTPUT_ADAPTER_NODE_ID,
  OutputAdapterNodeSettings,
  notNull,
  useFileStore,
} from "@beadi/engine";
import { useIntifaceStore } from "./storage";
import _ from "lodash";
import { INTIFACE_OUTPUT_ADAPTER_ID, IntifaceAdapterSettings } from "./outputAdapter";

type IntifaceActuatorAttribute = {
  featureDescriptor: string;
  actuatorType: ActuatorType;
} & (
  | {
      actuatorKind: "scalar";
      actuate: (n: number) => void;
    }
  | {
      actuatorKind: "linear";
      actuate: (n: number, duration: number) => void;
    }
  | {
      actuatorKind: "rotate";
      actuate: (speed: number, clockwise: boolean) => void;
    }
);
type IntifaceDevice = {
  name: string;
  displayName: string;
  deviceIndex: number;
  actuactors: IntifaceActuatorAttribute[];
};

export type IntifaceConnectionDef = {
  url: string;
  connectionId: string;
};
export type IntifaceConnection = {
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
        actuate: (n: number, durationSec: number) => {
          const duration = Math.floor(durationSec * 1000.0);
          const subcommand = new VectorSubcommand(it.Index, n, duration);
          device.sendExpectOk(new LinearCmd([subcommand], device.index));
        },
      })) ?? []),
      ...(device.messageAttributes.RotateCmd?.map((it) => ({
        featureDescriptor: it.FeatureDescriptor,
        actuatorType: it.ActuatorType,
        actuatorKind: "rotate" as const,
        actuate: (n: number, clockwise: boolean) => {
          const subcommand = new RotateSubcommand(it.Index, n, clockwise);
          device.sendExpectOk(new RotateCmd([subcommand], device.index));
        },
      })) ?? []),
      ...(device.messageAttributes.ScalarCmd?.map((it) => ({
        featureDescriptor: it.FeatureDescriptor,
        actuatorType: it.ActuatorType,
        actuatorKind: "scalar" as const,
        actuate: (n: number) => {
          const subcommand = new ScalarSubcommand(it.Index, n, it.ActuatorType);
          device.sendExpectOk(new ScalarCmd([subcommand], device.index));
        },
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

  addConnection: (def: Partial<IntifaceConnectionDef> & Omit<IntifaceConnectionDef, "connectionId">, connectImmediately?: boolean) => void;
  removeConnection: (id: string) => void;
};
export function makeIntifaceStore() {
  return createStore(
    devtools<IntifaceStore>((set, get) => ({
      connections: {},

      addConnection: (pdef, connectImmediately = false) => {
        const def: IntifaceConnectionDef = {
          ...pdef,
          connectionId: pdef.connectionId ?? `${new Date().getTime()}`,
        };
        const state = makeDisconnectedState({
          get: () => {
            return get().connections[def.connectionId];
          },
          set: (recipe) => {
            if (typeof recipe === "function") {
              set((s) =>
                produce(s, (draft) => {
                  recipe(draft.connections[def.connectionId].state);
                })
              );
            } else {
              set((s) =>
                produce(s, (draft) => {
                  draft.connections[def.connectionId].state = recipe;
                })
              );
            }
          },
        });
        set((s) =>
          produce(s, (draft) => {
            draft.connections[def.connectionId] = {
              def: def,
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

export function stopUnusedDevices(beadi: BeadiContext) {
  let lastAdapters: NonNullable<IntifaceAdapterSettings["value"]>[];
  const checkUnusedDevices = (nodes: FileStore) => {
    const adapters = _.values(nodes.data.nodes)
      .filter(
        (it) =>
          it.type === OUTPUT_ADAPTER_NODE_ID && (it.data.settings as OutputAdapterNodeSettings).adapterId === INTIFACE_OUTPUT_ADAPTER_ID
      )
      .map(
        (it) =>
          ((it.data.settings as OutputAdapterNodeSettings).adapterSettings?.["intifaceOutput"] as IntifaceAdapterSettings)?.value ?? null
      )
      .filter(notNull);
    if (!_.isEqual(adapters, lastAdapters)) {
      lastAdapters = adapters;
      const connections = useIntifaceStore.getStateWith(beadi).connections;
      for (const cId in connections) {
        const state = connections[cId].state;
        if (state.state === "connected") {
          const devices = state.devices;
          for (const dId in devices) {
            const device = devices[dId];
            for (let actuatorIndex = 0; actuatorIndex < device.actuactors.length; actuatorIndex++) {
              const actuator = device.actuactors[actuatorIndex];
              const adapter = lastAdapters.find(
                (adapter) =>
                  adapter.deviceIndex === device.deviceIndex && adapter.connectionId === cId && adapter.actuatorIndex === actuatorIndex
              );
              console.log("Checking: ", actuator, " => ", adapter);
              if (adapter === undefined) {
                if (actuator.actuatorKind === "linear") {
                  actuator.actuate(0.0, 1);
                } else if (actuator.actuatorKind === "rotate") {
                  actuator.actuate(0.0, false);
                } else if (actuator.actuatorKind === "scalar") {
                  actuator.actuate(0.0);
                } else {
                  console.error("Unsupported: ", actuator);
                  throw new Error(`Unsupported actuatorKind`);
                }
              }
            }
          }
        }
      }
    }
  };
  useFileStore.subscribeWith(beadi, checkUnusedDevices);
  checkUnusedDevices(useFileStore.getStateWith(beadi));
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

// export function startSendCommandLoop(beadi: BeadiContext) {
//   function sendCommands() {
//     const state = useIntifaceStore.getStateWith(beadi);
//     for (const connectionId in state.connections) {
//       const connectionState = state.connections[connectionId].state;
//       if (connectionState.state === "connected") {
//       }
//     }
//   }
// }
