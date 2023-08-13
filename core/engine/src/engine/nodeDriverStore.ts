import { create } from "zustand";

type NodeDriverStore<T> = {
  nodes: Record<string, T>;
  setValue: (nodeId: string, value: T) => void;
  getValue: (nodeId: string) => T;
};

export function createNodeDriverStore<T>(defaultValue: T) {
  const useStore = create<NodeDriverStore<T>>()((set, get) => ({
    nodes: {},
    setValue: (node, value) => {
      set((it) => ({
        ...it,
        [node]: value,
      }));
    },
    getValue: (node) => {
      return get().nodes[node] ?? defaultValue;
    },
  }));

  const useNodeDriverStoreValue = (nodeId: string) => {
    return useStore((it) => it.nodes[nodeId] ?? defaultValue);
  };

  useNodeDriverStoreValue.store = useStore;

  return useNodeDriverStoreValue;
}
