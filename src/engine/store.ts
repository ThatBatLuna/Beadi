import { useCallback } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import create, { StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DisplaySlice {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}
const createDisplaySlice: StateCreator<DisplaySlice, [], [], DisplaySlice> = (
  set,
  get
) => ({
  nodes: [],
  edges: [],
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
});

interface DataSlice {
  handles: Record<string, any>;
  committed: Record<string, any>;
  setHandle: (nodeId: string, handleId: string, data: any) => void;
  commitData: (data: Record<string, any>) => void;
}
const createDataSlice: StateCreator<DataSlice, [], [], DataSlice> = (
  set,
  get
) => ({
  handles: {},
  committed: {},
  setHandle: (nodeId, handleId, data) =>
    set((state) => ({
      handles: {
        ...state.handles,
        [`${nodeId}__${handleId}`]: data,
      },
    })),
  commitData: (data) => {
    set((state) => ({
      committed: {
        ...state.handles,
        ...data,
      },
    }));
  },
});

export type DataStore = DataSlice & DisplaySlice;

export const useDataStore = create<DataStore>()((...a) => ({
  ...createDataSlice(...a),
  ...createDisplaySlice(...a),
}));

export type HandleData<T> = [T, (value: T) => void];
export function useHandleData<T>(
  handleType: string,
  nodeId: string,
  handleId: string
): HandleData<T> {
  const value = useDataStore(
    (state) => state.handles[`${nodeId}__input__${handleId}`]
  );
  const setHandle = useDataStore((state) => state.setHandle);
  const setValue = useCallback(
    (value: T) => {
      setHandle(nodeId, `${handleType}__${handleId}`, value);
    },
    [setHandle, nodeId, handleId, handleType]
  );

  return [value as T, setValue];
}

export function useInputHandleData<T>(
  nodeId: string,
  handleId: string
): HandleData<T> {
  return useHandleData("input", nodeId, handleId);
}
export function useCommittedData<T>(nodeId: string, handleId: string): T {
  const value = useDataStore(
    (state) => state.committed[`${nodeId}__commit__${handleId}`]
  );
  return value as T;
}
