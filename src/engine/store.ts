import { useCallback } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import create, { StateCreator } from "zustand";
import { nodeDefs } from "./node";

type AddNode = (type: string) => void;

interface DisplaySlice {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: AddNode;
}

const initialNodes: Node<any>[] = [];
const initialEdges: Edge<any>[] = [];

const createDisplaySlice: StateCreator<
  DisplaySlice & DataSlice,
  [],
  [],
  DisplaySlice
> = (set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onConnect: (connection) => set({ edges: addEdge(connection, get().edges) }),
  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),
  addNode: (type) => {
    const id = "" + Date.now();
    nodeDefs[type].inputs.forEach((input) => {
      get().setHandle(id, `input__${input.id}`, input.default);
    });
    set({
      nodes: get().nodes.concat([
        {
          data: {},
          id: id,
          position: {
            x: 0,
            y: 0,
          },
          type: type,
        },
      ]),
    });
  },
});

interface DataSlice {
  handles: Record<string, any>;
  committed: Record<string, Record<string, any>>;
  setHandle: (nodeId: string, handleId: string, data: any) => void;
  commitData: (data: Record<string, Record<string, any>>) => void;
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
    set((state) => {
      const newState = {
        committed: {
          ...state.committed,
          ...Object.assign(
            {},
            ...Object.entries(data).map(([key, value]) => ({
              [key]: {
                ...state.committed[key],
                ...value,
              },
            }))
          ),
        },
      };
      return newState;
    });
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
  const value = useDataStore((state) => {
    return state.handles[`${nodeId}__input__${handleId}`];
  });
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
  const value = useDataStore((state) => {
    return state.committed[nodeId]?.[handleId];
  });
  return value as T;
}
