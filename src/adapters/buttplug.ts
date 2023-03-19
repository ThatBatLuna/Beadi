import {
  ButtplugClient,
  ButtplugClientDevice,
  ButtplugEmbeddedConnectorOptions,
  ButtplugWebsocketConnectorOptions,
} from "buttplug";
import _ from "lodash";
import { ButtplugInstance } from "./store";
import {
  ButtplugClientActions,
  ButtplugClientConfig,
  ButtplugClientHandle,
} from "./store";

export type ButtplugClientState = {
  connected: boolean;
  error: string | null;
  devices: string[];
  scanning: boolean;
};

export type AnyClientDeviceListener = (
  clientId: string,
  update: ButtplugClientDevice[]
) => void;
export type ClientDeviceListener = (update: ButtplugClientDevice[]) => void;

export type ClientStateListener = (
  update: Partial<ButtplugClientState>
) => void;
export type AnyClientStateListener = (
  clientId: string,
  update: Partial<ButtplugClientState>
) => void;

export function makeClient(
  config: ButtplugClientConfig,
  listener: ClientStateListener,
  deviceListener: ClientDeviceListener,
  instance: ButtplugInstance
): ButtplugClientHandle {
  let connector:
    | null
    | ButtplugWebsocketConnectorOptions
    | ButtplugEmbeddedConnectorOptions = null;
  if (config.connection === "embedded") {
    connector = new instance.ButtplugEmbeddedConnectorOptions();
  } else {
    const c = new instance.ButtplugWebsocketConnectorOptions();
    if (config.connection.startsWith("ws://") || config.connection.startsWith("wss://")) {
      c.Address = config.connection;
    } else {
      c.Address = `ws://${config.connection}`;
    }
    connector = c;
  }
  console.log("Created new Client ", config);
  let client: ButtplugClient = new instance.ButtplugClient(
    `Beadi Client '${config.name}'`
  );

  const actions: ButtplugClientActions = {
    connect: () => {
      console.log("Connecting");
      client
        .connect(connector!!)
        .then(() => {
          console.log("ServerConnect", client.Devices);
          listener({
            connected: true,
            error: null,
          });
          deviceListener(client.Devices);
        })
        .catch((e) => {
          console.log("Error", e);
          listener({
            connected: false,
            error: e.message,
          });
        });
    },
    disconnect: () => {
      console.log("Disconnecting");
      client.disconnect();
    },
    stopAll: () => {
      console.log("StopAll");
      client.stopAllDevices();
    },
    scan: () => {
      console.log("StartScan");
      client.startScanning().then(() => {
        listener({
          scanning: true,
        });
      });
    },
    stopScan: () => {
      console.log("StopScan");
      client.stopScanning().then(() => {
        listener({
          scanning: false,
        });
      });
    },
  };

  actions.connect();

  client.addListener("serverdisconnect", () => {
    console.log("ServerDisconnect");
    listener({
      connected: false,
    });
  });
  client.addListener("scanningfinished", () => {
    console.log("ScanningFinished");
    listener({
      scanning: false,
    });
  });
  client.addListener("deviceadded", () => {
    console.log("DeviceAdded", client.Devices);
    deviceListener(client.Devices);
  });
  client.addListener("deviceremoved", () => {
    console.log("DeviceRemoved", client.Devices);
    deviceListener(client.Devices);
  });

  return {
    client: client,
    config: config,
    state: {
      connected: false,
      error: null,
      devices: [],
      scanning: false,
    },
    devices: [],
    actions,
  };
}

export function destroyClient(
  client: ButtplugClientHandle,
  instance: ButtplugInstance
) {
  console.log("Destroyed Client: ", client);
  if (client.client.Connected) {
    client.actions.disconnect();
  }
}

export function syncClientState(
  oldClients: Record<string, ButtplugClientHandle>,
  config: Record<string, ButtplugClientConfig>,
  listener: AnyClientStateListener,
  deviceListener: AnyClientDeviceListener,
  instance: ButtplugInstance
): Record<string, ButtplugClientHandle> {
  let newClients = _.clone(oldClients);
  let queue = _.clone(config);

  //Check all serverIds that currently are
  for (const serverId in oldClients) {
    //If this server should further exist with the same config
    if (
      serverId in queue &&
      _.isEqual(newClients[serverId].config, queue[serverId])
    ) {
      //If this server is correct, we do not need to do anything further
      delete queue[serverId];
    } else {
      //Remove this Client from the servers, either for good, or to readd it later with the updated configs
      destroyClient(newClients[serverId], instance);
      delete newClients[serverId];
    }
  }
  //All servers that should be readded remain in the queue
  for (const clientId in queue) {
    newClients[clientId] = makeClient(
      queue[clientId],
      (update) => listener(clientId, update),
      (update) => deviceListener(clientId, update),
      instance
    );
  }

  return newClients;
}
