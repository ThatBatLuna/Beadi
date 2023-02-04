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
  XYPosition,
} from "reactflow";
import create from "zustand";
import { persist } from "zustand/middleware";
import { nodeDefs } from "../nodes/nodes";

type NodeId = string;

type AddNode = (type: string, pos: XYPosition) => NodeId;
type AddEdge = (edge: Edge) => void;

export interface DisplayStore {
  nodes: Node[];
  edges: Edge[];
  handles: Record<string, any>;
  setHandle: (nodeId: string, handleId: string, data: any) => void;
  mergeNodeData: (nodeId: string, data: any) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: AddNode;
  addEdge: AddEdge;
  reset: () => void;
  overwrite: (
    nodes: Node[],
    edges: Edge[],
    handles: Record<string, any>
  ) => void;
}

const initialNodes: Node<any>[] = [
  {
    id: "welcome",
    type: "welcome",
    position: {
      x: 0,
      y: 0,
    },
    data: {},
  },
];
const initialEdges: Edge<any>[] = [];

export const useDisplayStore = create<DisplayStore>()(
  persist((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    handles: {},
    mergeNodeData: (node, data) => {
      //TODO This is hella slow... Maybe I should rethink the handling for node data?
      set(({ nodes }) => ({
        nodes: nodes.map((it) => {
          if (it.id === node) {
            return {
              ...it,
              data: {
                ...it.data,
                ...data,
              },
            };
          } else {
            return it;
          }
        }),
      }));
    },
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
    addEdge: (edge) => {
      set({
        edges: addEdge(edge, get().edges),
      });
    },
    reset: () => {
      set(() => ({
        nodes: initialNodes,
        edges: initialEdges,
        handles: [],
      }));
    },
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
              x: pos.x,
              y: pos.y,
            },
            type: type,
          },
        ]),
      });
      return id;
    },
  }))
);

export interface DataStore {
  committed: Record<string, Record<string, any>>;
  ephermal: Record<string, Record<string, any>>;
  commitData: (data: Record<string, Record<string, any>>) => void;
  pushEphermalData: (nodeId: string, handleId: string, data: any) => void;
  popEphermalData: () => Record<string, Record<string, any>>;
}
export const useDataStore = create<DataStore>()((set, get) => ({
  committed: {},
  ephermal: {},
  popEphermalData: () => {
    const values = get().ephermal;
    set(() => ({ ephermal: {} }));
    return values;
  },
  pushEphermalData: (nodeId, handleId, data) => {
    set((state) => {
      const newState = {
        ephermal: {
          ...state.ephermal,
          [nodeId]: {
            ...state.ephermal[nodeId],
            [handleId]: data,
          },
        },
      };
      return newState;
    });
  },
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
export function usePushEphermalData<T>(nodeId: string, handleId: string) {
  const push = useDataStore((state) => state.pushEphermalData);

  return useCallback(
    (data: T) => {
      push(nodeId, handleId, data);
    },
    [push, nodeId, handleId]
  );
}
export function useSetNodeName(nodeId: string) {
  const mergeNodeData = useDisplayStore((state) => state.mergeNodeData);
  return useCallback(
    (name: string) => {
      if (name.trim() === "") {
        mergeNodeData(nodeId, { name: undefined });
      } else {
        mergeNodeData(nodeId, { name });
      }
    },
    [nodeId, mergeNodeData]
  );
}
export function useMergeNodeData(nodeId: string) {
  const mergeNodeData = useDisplayStore((state) => state.mergeNodeData);
  return useCallback(
    (data: Record<string, any>) => {
      mergeNodeData(nodeId, data);
    },
    [nodeId, mergeNodeData]
  );
}
