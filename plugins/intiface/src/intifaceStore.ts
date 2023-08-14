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
import { BeadiContext, FileStore, OUTPUT_ADAPTER_NODE_ID, OutputAdapterNodeSettings, notNull, useFileStore } from "@beadi/engine";
import { useIntifaceStore } from "./storage";
import _ from "lodash";
import { INTIFACE_OUTPUT_ADAPTER_ID, IntifaceAdapterSettings } from "./outputAdapter";

type IntifaceActuatorAttribute = {
  featureDescriptor: string;
  actuatorType: ActuatorType;
} & (
  | {
      actuatorKind: "scalar";
      scalarAttributeIndex: number;
      actuate: (n: number) => void;
      wanted: {
        value: number;
      } | null;
      actual: {
        value: number;
      } | null;
    }
  | {
      actuatorKind: "linear";
      linearAttributeIndex: number;
      actuate: (n: number, duration: number) => void;
      wanted: {
        value: number;
        duration: number;
      } | null;
      actual: {
        value: number;
        duration: number;
      } | null;
    }
  | {
      actuatorKind: "rotate";
      rotateAttributeIndex: number;
      actuate: (speed: number, clockwise: boolean) => void;
      wanted: {
        speed: number;
        clockwise: boolean;
      } | null;
      actual: {
        speed: number;
        clockwise: boolean;
      } | null;
    }
);
type IntifaceDevice = {
  name: string;
  displayName: string;
  deviceIndex: number;
  deviceHandle: ButtplugClientDevice;
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

function makeDevice(device: ButtplugClientDevice, actions: StateControls): IntifaceDevice {
  return {
    name: device.name,
    displayName: device.displayName ?? device.name,
    deviceIndex: device.index,
    deviceHandle: device,
    actuactors: [
      ...(device.messageAttributes.LinearCmd?.map((it) => ({ kind: "linear" as const, attribute: it })) ?? []),
      ...(device.messageAttributes.RotateCmd?.map((it) => ({ kind: "rotate" as const, attribute: it })) ?? []),
      ...(device.messageAttributes.ScalarCmd?.map((it) => ({ kind: "scalar" as const, attribute: it })) ?? []),
    ].map((it, index) => {
      if (it.kind === "linear") {
        return {
          featureDescriptor: it.attribute.FeatureDescriptor,
          actuatorType: it.attribute.ActuatorType,
          actuatorKind: "linear" as const,
          linearAttributeIndex: it.attribute.Index,
          wanted: null,
          actual: null,
          actuate: (n: number, durationSec: number) => {
            actions.set((d) => {
              if (d.state === "connected") {
                d.devices[device.index].actuactors[index].wanted = {
                  value: n,
                  duration: durationSec,
                };
              }
            });
          },
        } satisfies IntifaceActuatorAttribute;
      }
      if (it.kind === "rotate") {
        return {
          featureDescriptor: it.attribute.FeatureDescriptor,
          actuatorType: it.attribute.ActuatorType,
          actuatorKind: "rotate" as const,
          rotateAttributeIndex: it.attribute.Index,
          wanted: null,
          actual: null,
          actuate: (n: number, clockwise: boolean) => {
            actions.set((d) => {
              if (d.state === "connected") {
                d.devices[device.index].actuactors[index].wanted = {
                  value: n,
                  clockwise: clockwise,
                };
              }
            });
          },
        };
      }
      if (it.kind === "scalar") {
        return {
          featureDescriptor: it.attribute.FeatureDescriptor,
          actuatorType: it.attribute.ActuatorType,
          actuatorKind: "scalar" as const,
          scalarAttributeIndex: it.attribute.Index,
          wanted: null,
          actual: null,
          actuate: (n: number) => {
            actions.set((d) => {
              if (d.state === "connected") {
                d.devices[device.index].actuactors[index].wanted = {
                  value: n,
                };
              }
            });
          },
        };
      }
      throw new Error("");
    }),
  };
}
function makeConnectedState(client: ButtplugClient, actions: StateControls): IntifaceConnectionState & { state: "connected" } {
  const deviceAddedListener = (device: ButtplugClientDevice) => {
    actions.set((d) => {
      if (d.state === "connected") {
        d.devices[device.index] = makeDevice(device, actions);
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

  const devices = _.keyBy(
    client.devices.map((it) => makeDevice(it, actions)),
    (it) => it.deviceIndex
  );

  console.log("Connected with devices: ", devices);
  return {
    state: "connected",
    client,
    scanning: false,
    devices,
    disconnect,
    startScan,
    stopScan,
  };
}

type IntifaceStore = {
  connections: Record<string, IntifaceConnection>;

  addConnection: (def: Partial<IntifaceConnectionDef> & Omit<IntifaceConnectionDef, "connectionId">, connectImmediately?: boolean) => void;
  removeConnection: (id: string) => void;
  updateActuator: (
    connectionId: string,
    deviceIndex: number,
    actuatorIndex: number,
    recipe: (draft: Draft<IntifaceActuatorAttribute>) => void
  ) => void;
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
      updateActuator: (connId, devIdx, actIdx, recipe) => {
        set((s) =>
          produce(s, (draft) => {
            const state = draft.connections[connId]?.state;
            if (state?.state === "connected") {
              const dev = state.devices[devIdx];
              if (dev != null) {
                const act = dev.actuactors[actIdx];
                recipe(act);
              }
            }
          })
        );
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

export function startSendCommandLoop(beadi: BeadiContext) {
  let inFlight = 0;
  function sendUpdates() {
    if (inFlight > 20) {
      console.warn("Probably sending too many requests to intiface server. Currently ", inFlight, " requests in flight.");
    }
    const state = useIntifaceStore.getStateWith(beadi);
    for (const connectionId in state.connections) {
      const connectionState = state.connections[connectionId].state;
      if (connectionState.state === "connected") {
        const devices = connectionState.devices;
        for (const dId in devices) {
          const device = devices[dId];
          for (let actuatorIndex = 0; actuatorIndex < device.actuactors.length; actuatorIndex++) {
            const actuator = device.actuactors[actuatorIndex];
            if (!_.isEqual(actuator.wanted, actuator.actual)) {
              console.log(
                "Updating for : ",
                "Device ",
                dId,
                "/",
                device.deviceIndex,
                "act: ",
                connectionState.client.devices,
                actuatorIndex
              );
              const updateActual = () => {
                useIntifaceStore
                  .getStateWith(beadi)
                  .updateActuator(connectionId, device.deviceIndex, actuatorIndex, (draft) => (draft.actual = actuator.wanted));
                inFlight--;
              };
              switch (actuator.actuatorKind) {
                case "linear":
                  {
                    const duration = Math.floor((actuator.wanted?.duration ?? 1.0) * 1000.0);
                    const subcommand = new VectorSubcommand(actuator.linearAttributeIndex, actuator.wanted?.value ?? 0.0, duration);
                    inFlight++;
                    // connectionState.client.devices.find(it => it.index === device.deviceIndex)
                    device.deviceHandle
                      .sendExpectOk(new LinearCmd([subcommand], device.deviceIndex))
                      .then(updateActual)
                      .catch(() => inFlight--);
                  }
                  break;
                case "rotate":
                  {
                    const subcommand = new RotateSubcommand(
                      actuator.rotateAttributeIndex,
                      actuator.wanted?.speed ?? 0.0,
                      actuator.wanted?.clockwise ?? false
                    );
                    inFlight++;
                    device.deviceHandle
                      .sendExpectOk(new RotateCmd([subcommand], device.deviceIndex))
                      .then(updateActual)
                      .catch(() => inFlight--);
                  }
                  break;
                case "scalar":
                  {
                    const subcommand = new ScalarSubcommand(
                      actuator.scalarAttributeIndex,
                      actuator.wanted?.value ?? 0.0,
                      actuator.actuatorType
                    );
                    inFlight++;
                    device.deviceHandle
                      .sendExpectOk(new ScalarCmd([subcommand], device.deviceIndex))
                      .then(updateActual)
                      .catch(() => inFlight--);
                  }
                  break;
              }
            }
          }
        }
      }
    }
  }

  setInterval(sendUpdates, 1000 / 20.0);
}
