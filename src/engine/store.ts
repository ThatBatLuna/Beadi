import { Draft } from "immer";
import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange, XYPosition, applyNodeChanges } from "reactflow";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { nodeDefs } from "../registries";
import _ from "lodash";
import { useCallback } from "react";

export interface NodeData {
  mobileVisible?: boolean;
  published?: boolean;
  name?: string;
}

export type BeadiNode<TDisplaySettings, TSettings, THandles extends Record<string, any>> = {
  id: Node<NodeData>["id"];
  position: Node<NodeData>["position"];
  type: NonNullable<Node<NodeData>["type"]>;
  data: {
    displaySettings: TDisplaySettings;
    settings: TSettings;
    handles: THandles;
  };
};

export type UnknownBeadiNode = BeadiNode<unknown, unknown, Record<string, unknown>>;

export type BeadiEdge = {
  id: Edge["id"];
  sourceHandle: NonNullable<Edge["sourceHandle"]>;
  targetHandle: NonNullable<Edge["targetHandle"]>;
  source: Edge["source"];
  target: Edge["target"];
};

export type BeadiFileData = {
  nodes: Record<UnknownBeadiNode["id"], UnknownBeadiNode>;
  edges: Record<BeadiEdge["id"], BeadiEdge>;
};

export type FileStore = {
  data: BeadiFileData;

  setHandle: (nodeId: string, handleId: string, data: any) => void;
  getHandle: (nodeId: string, handleId: string) => any;
  updateNode: (nodeId: string, recipe: (node: Draft<UnknownBeadiNode>) => void) => void;
  overwrite: (file: BeadiFileData) => void;

  //TODO Change this to a immer recipe instead of merging
  //   mergeNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addEdge: (edge: Omit<BeadiEdge, "id">) => string;
  addNode: (type: string, pos: XYPosition) => string;

  exportJson: () => any;
  importJson: (data: any) => void;
  //   reset: () => void;
};
export const useFileStore = create<FileStore>()(
  immer(
    persist((set, get) => ({
      data: {
        nodes: {} as BeadiFileData["nodes"],
        edges: {} as BeadiFileData["edges"],
      },

      addNode: (type, pos) => {
        const id = "" + Date.now();
        const nodeType = nodeDefs[type];
        set((draft) => {
          draft.data.nodes[id] = {
            id: id,
            position: pos,
            type: type,
            data: {
              displaySettings: {},
              handles: _.mapValues(nodeType.inputs, (handle) => handle.default),
              settings: {},
            },
          };
        });
        return id;
      },
      addEdge: (edge) => {
        const id = `${edge.source}${edge.sourceHandle}=${edge.target}${edge.targetHandle}`;
        set((draft) => {
          draft.data.edges[id] = {
            ...edge,
            id: id,
          };
        });
        return id;
      },
      onConnect: (connection) => {
        if (
          connection.source !== null &&
          connection.sourceHandle !== null &&
          connection.target !== null &&
          connection.targetHandle !== null
        ) {
          get().addEdge(connection as any);
        } else {
          console.warn("onConnect with null values is not supported.");
        }
      },
      onNodesChange: (changes) => {
        set((draft) => {
          for (const c of changes) {
            if (c.type === "add") {
              console.warn("Add is not yet handled.");
            } else if (c.type === "dimensions") {
              console.warn("Dimensions is not yet handled.");
            } else if (c.type === "position") {
              if (c.position !== undefined) {
                draft.data.nodes[c.id].position = c.position;
              } else {
                console.warn("Position without position is not yet handled.");
              }
            } else if (c.type === "remove") {
              delete draft.data.nodes[c.id];
            } else if (c.type === "reset") {
              console.warn("Reset is not yet handled.");
            } else if (c.type === "select") {
              console.warn("Select is not yet handled.");
            }
          }
        });
      },
      onEdgesChange: (changes) => {
        set((draft) => {
          for (const c of changes) {
            if (c.type === "add") {
              console.warn("Add is not yet handled.");
            } else if (c.type === "remove") {
              delete draft.data.edges[c.id];
            } else if (c.type === "reset") {
              console.warn("Reset is not yet handled.");
            } else if (c.type === "select") {
              console.warn("Select is not yet handled.");
            }
          }
        });
      },

      setHandle: (nodeId, handleId, data) => {
        set((store) => {
          const node = store.data.nodes[nodeId];
          if (node !== undefined) {
            node.data.handles[handleId] = data;
          } else {
            console.trace("Tried to set handle of node, but node '", nodeId, "' does not exist.");
          }
        });
      },

      getHandle: (nodeId, handleId) => {
        const node = get().data.nodes[nodeId];
        if (node !== undefined) {
          return node.data.handles[handleId];
        } else {
          return null;
        }
      },

      overwrite: (file) => {
        set((store) => (store.data = file));
      },
      updateNode: (nodeId, recipe) => {
        set((store) => {
          const node = store.data.nodes[nodeId];
          if (node !== undefined) {
            recipe(node);
          } else {
            console.trace("Tried to update nonexisting node '", nodeId, "'");
          }
        });
      },
      exportJson: () => {
        return {
          version: 2,
          data: get().data,
        };
      },
      importJson: (data: any) => {
        //TODO Sanitize input

        //Crude cleaning of possibly weird javascript objects.
        const cleanData = JSON.parse(JSON.stringify(data));
        console.warn("TODO importing unsanitized input data:", data, " => ", cleanData);
        set({
          data: cleanData,
        });
      },
    }))
  )
);

export type UseInputHandleData<T> = [T, (value: T) => void];
export function useInputHandleData<T>(nodeId: string, handleId: string): UseInputHandleData<T> {
  const value = useFileStore((state) => {
    return state.data.nodes[nodeId].data.handles[handleId];
  });
  const setHandle = useFileStore((state) => state.setHandle);
  const setValue = useCallback(
    (value: T) => {
      setHandle(nodeId, handleId, value);
    },
    [setHandle, nodeId, handleId]
  );

  return [value as T, setValue];
}

export const ResetDocument: BeadiFileData = {
  edges: {},
  nodes: {
    welcome: {
      id: "welcome",
      type: "welcome",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        displaySettings: {},
        handles: {},
        settings: {},
      },
    },
  },
};
