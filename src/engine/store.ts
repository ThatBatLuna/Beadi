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
import create from "zustand";
import { persist } from "zustand/middleware";
import { nodeDefs } from "./node";

type AddNode = (type: string, pos: [number, number]) => void;

export interface DisplayStore {
  nodes: Node[];
  edges: Edge[];
  handles: Record<string, any>;
  setHandle: (nodeId: string, handleId: string, data: any) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: AddNode;
  overwrite: (
    nodes: Node[],
    edges: Edge[],
    handles: Record<string, any>
  ) => void;
}

const initialNodes: Node<any>[] = [];
const initialEdges: Edge<any>[] = [];

export const useDisplayStore = create<DisplayStore>()(
  persist((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    handles: {},
    overwrite: (nodes, edges, handles) => {
      set(() => ({
        nodes,
        edges,
        handles,
      }));
    },
    setHandle: (nodeId, handleId, data) =>
      set((state) => ({
        handles: {
          ...state.handles,
          [`${nodeId}__${handleId}`]: data,
        },
      })),
    onConnect: (connection) => {
      set({
        edges: addEdge(
          connection,
          get().edges.filter(
            (edge) =>
              !(
                edge.target === connection.target &&
                edge.targetHandle === connection.targetHandle
              )
          )
        ),
      });
    },
    onNodesChange: (changes) =>
      set({ nodes: applyNodeChanges(changes, get().nodes) }),
    onEdgesChange: (changes) =>
      set({ edges: applyEdgeChanges(changes, get().edges) }),
    addNode: (type, pos) => {
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
              x: pos[0],
              y: pos[1],
            },
            type: type,
          },
        ]),
      });
    },
  }))
);

export interface DataStore {
  committed: Record<string, Record<string, any>>;
  commitData: (data: Record<string, Record<string, any>>) => void;
}
export const useDataStore = create<DataStore>()((set, get) => ({
  committed: {},
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
}));

export type HandleData<T> = [T, (value: T) => void];
export function useHandleData<T>(
  handleType: string,
  nodeId: string,
  handleId: string
): HandleData<T> {
  const value = useDisplayStore((state) => {
    return state.handles[`${nodeId}__input__${handleId}`];
  });
  const setHandle = useDisplayStore((state) => state.setHandle);
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
