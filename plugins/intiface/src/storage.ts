import { createStorageShard } from "@beadi/engine";
import { makeIntifaceStore } from "./intifaceStore";

const [shard, { useIntifaceStore, useIntifaceStoreEqualityFn }] = createStorageShard({
  name: "intiface",
  makeShards: {
    intifaceStore: () => makeIntifaceStore(),
  },
});

export { shard, useIntifaceStore, useIntifaceStoreEqualityFn };
