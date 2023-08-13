import { useSyncExternalStore } from "react";
import { useDebouncedWith } from "./useDeepDebounced";

export type AnyStoreHandleSelecting<TSelectedData> = StoreHandle<any, TSelectedData>;

export type StoreHandle<TStore, TSelectedData> = {
  subscribe: (listener: () => void) => () => void;
  getState: () => TStore;
  selectData: (store: TStore) => TSelectedData;
};
export function useDynamicStore<TStore, TSelectedData, TData>(
  handle: StoreHandle<TStore, TSelectedData>,
  select: (store: TSelectedData) => TData,
  isEqual: (a: TData, b: TData) => boolean = (a, b) => a === b
) {
  const storeState = useSyncExternalStore(handle.subscribe, handle.getState);
  const data = select(handle.selectData(storeState));
  return useDebouncedWith(data, isEqual);
}
