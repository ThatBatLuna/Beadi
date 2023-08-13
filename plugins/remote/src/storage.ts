import { createStorageShard } from "@beadi/engine";
import { makeIOValueStore } from "./inputOutputStore";
import { makePublishStateStore } from "./publish/publishStore";
import { makeInterfaceFileStore } from "./interface/interfaceStores";
import { makeRemoteStateStore, makeRemoteStore } from "./remote/remoteStore";

const [shard, { useIOValueStore, usePublishStateStore, useInterfaceFileStore, useRemoteStore, useRemoteStateStore }] = createStorageShard({
  name: "remotePlugin",
  makeShards: {
    IOValueStore: () => makeIOValueStore(),
    publishStateStore: (beadi) => makePublishStateStore(beadi),
    interfaceFileStore: () => makeInterfaceFileStore(),
    remoteStore: () => makeRemoteStore(),
    remoteStateStore: () => makeRemoteStateStore(),
  },
});

export { shard, useIOValueStore, usePublishStateStore, useInterfaceFileStore, useRemoteStore, useRemoteStateStore };
