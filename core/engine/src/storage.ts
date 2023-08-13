import { StoreApi, useStore } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { makeFileStore, makeSignalBus } from ".";
import { makeModelState } from "./engine/compiler";
import { makePreviewStore } from "./engine/preview";
import _ from "lodash";
import { BeadiContext, useBeadi } from "./context";

//=== Types extracted from from zustand react.d.ts
type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;
type ReadonlyStoreApi<T> = Pick<StoreApi<T>, "getState" | "subscribe">;
type WithReact<S extends ReadonlyStoreApi<unknown>> = S & {
  getServerState?: () => ExtractState<S>;
};
//===

export class Storage {
  shards: Record<string, StorageShardDef<StorageShard>>;
  constructor(shards: StorageShardDef<StorageShard>[]) {
    this.shards = _.keyBy(shards, (it) => it.name);
  }
}

type Store<TState> = WithReact<StoreApi<TState>>;
export type StorageShardDef<TShard extends StorageShard> = {
  name: string;
  shard: TShard;
};
export type StorageShardDefBuilder<TShard extends StorageShard> = {
  name: string;
  makeShards: { [Key in keyof TShard]: (beadi: BeadiContext) => TShard[Key] };
};
export type StorageShard = Record<string, StoreApi<any>>;
type StorageShardHooks<D extends StorageShard> = {
  [Store in keyof D as `use${Capitalize<Store & string>}`]: StorageShardHook<D[Store]>;
} & {
  [Store in keyof D as `use${Capitalize<Store & string>}EqualityFn`]: StorageShardEqualityFnHook<D[Store]>;
};
// type StorageShardHook<TStore> = () => ExtractState<TStore>;

type StorageShardEqualityFnHook<TStore extends Store<any>> = <TData = ExtractState<TStore>>(
  selector?: (store: ExtractState<TStore>) => TData,
  equalityFn?: (a: ExtractState<TStore>, b: ExtractState<TStore>) => boolean
) => TData;
type StorageShardHookFn<TStore extends Store<any>> = <TData = ExtractState<TStore>>(
  selector?: (store: ExtractState<TStore>) => TData
) => TData;
interface StorageShardHook<TStore extends Store<any>> extends StorageShardHookFn<TStore> {
  subscribeWith: (beadi: BeadiContext, subscriber: (store: ExtractState<TStore>) => void) => () => void;
  getStateWith: (beadi: BeadiContext) => ExtractState<TStore>;
  setStateWith: (
    beadi: BeadiContext,
    state: Partial<ExtractState<TStore>> | ((old: ExtractState<TStore>) => ExtractState<TStore>)
  ) => ExtractState<TStore>;
}

type CreateStorageShard<T extends StorageShard> = [StorageShardDefBuilder<T>, StorageShardHooks<T>];
export function createStorageShard<T extends StorageShard>(shard: StorageShardDefBuilder<T>): CreateStorageShard<T> {
  const hooks = Object.fromEntries([
    ...Object.keys(shard.makeShards).map((key) => {
      const useHook: StorageShardHookFn<any> = (selector) => {
        const storage = useBeadi().getStorage();
        const shardDef = storage.shards[shard.name];
        return useStore(shardDef.shard[key], selector as any);
      };
      (useHook as StorageShardHook<any>).subscribeWith = (beadi, subscriber) => {
        const storage = beadi.getStorage(); //useStorage
        const shardDef = storage.shards[shard.name];
        return shardDef.shard[key].subscribe(subscriber);
      };
      (useHook as StorageShardHook<any>).getStateWith = (beadi) => {
        const storage = beadi.getStorage(); //useStorage
        const shardDef = storage.shards[shard.name];
        return shardDef.shard[key].getState();
      };
      (useHook as StorageShardHook<any>).setStateWith = (beadi, state) => {
        const storage = beadi.getStorage(); //useStorage
        const shardDef = storage.shards[shard.name];
        return shardDef.shard[key].setState(state);
      };
      return [`use${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof StorageShardHooks<T>, useHook];
    }),
    ...Object.keys(shard.makeShards).map((key) => {
      const useHook: StorageShardEqualityFnHook<any> = (selector, equality) => {
        const storage = useBeadi().getStorage();
        const shardDef = storage.shards[shard.name];
        return useStoreWithEqualityFn(shardDef.shard[key], selector as any, equality as any);
      };
      return [`use${key.charAt(0).toUpperCase() + key.slice(1)}EqualityFn` as keyof StorageShardHooks<T>, useHook];
    }),
  ]) as StorageShardHooks<T>;
  console.log("createStorageShard: ", shard, hooks);
  return [shard, hooks];
}

const [
  shard,
  {
    useFileStore,
    usePreviewStore,
    useSignalBus,
    useModelState,
    useFileStoreEqualityFn,
    useModelStateEqualityFn,
    usePreviewStoreEqualityFn,
    useSignalBusEqualityFn,
  },
] = createStorageShard({
  name: "beadi",
  makeShards: {
    fileStore: () => makeFileStore(),
    previewStore: () => makePreviewStore(),
    signalBus: () => makeSignalBus(),
    modelState: () => makeModelState(),
  },
});

export {
  useFileStore,
  usePreviewStore,
  useSignalBus,
  useModelState,
  useFileStoreEqualityFn,
  useModelStateEqualityFn,
  usePreviewStoreEqualityFn,
  useSignalBusEqualityFn,
};
export { shard as beadiStorageShard };
