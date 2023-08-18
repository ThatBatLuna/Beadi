import { createStorageShard } from "@beadi/engine";
import { makeIOValueStore } from "./inputOutputStore";
import { makePublishStateStore } from "./publish/publishStore";
import { makeInterfaceFileStore } from "./interface/interfaceStores";
import { makeRemoteStateStore, makeRemoteStore } from "./remote/remoteStore";

const [
  shard,
  {
    useIOValueStore,
    usePublishStateStore,
    useInterfaceFileStore,
    useRemoteStore,
    useRemoteStateStore,
    useIOValueStoreEqualityFn,
    useInterfaceFileStoreEqualityFn,
    usePublishStateStoreEqualityFn,
    useRemoteStateStoreEqualityFn,
    useRemoteStoreEqualityFn,
  },
] = createStorageShard({
  name: "remotePlugin",
  makeShards: {
    IOValueStore: () => makeIOValueStore(),
    publishStateStore: ({ beadiInstance }) =>
      makePublishStateStore(beadiInstance, (beadiInstance.context.globals as any).remotePlugin.remoteServerUrl),
    interfaceFileStore: () => makeInterfaceFileStore(),
    remoteStore: () => makeRemoteStore(),
    remoteStateStore: () => makeRemoteStateStore(),
  },
});

export {
  shard,
  useIOValueStore,
  usePublishStateStore,
  useInterfaceFileStore,
  useRemoteStore,
  useRemoteStateStore,
  useIOValueStoreEqualityFn,
  useInterfaceFileStoreEqualityFn,
  usePublishStateStoreEqualityFn,
  useRemoteStateStoreEqualityFn,
  useRemoteStoreEqualityFn,
};
