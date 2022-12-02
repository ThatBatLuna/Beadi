import { FunctionComponent, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
  OnConnect,
} from "reactflow";
import { buildModel } from "../engine";
import _ from "lodash";
import { nodeDefs } from "../engine/node";
import { evaluate } from "../engine/evaluate";
import { useDataStore } from "../engine/store";
import { makeNodeRenderer } from "./node/NodeRenderer";

const initialNodes: Node<any>[] = [
  {
    id: "1",
    type: "constantValue",
    position: { x: 0, y: 0 },
    data: {
      value: 8,
    },
  },
  {
    id: "2",
    type: "add",
    position: { x: 0, y: 0 },
    data: {
      value: 8,
    },
  },
  {
    id: "3",
    type: "wave",
    position: { x: 0, y: 0 },
    data: {},
  },
  {
    id: "4",
    type: "display",
    position: { x: 0, y: 0 },
    data: {
      value: 8,
    },
  },
];

const initialEdges: Edge<any>[] = [];

const nodeTypes: NodeTypes = _.mapValues(nodeDefs, (it) =>
  makeNodeRenderer(it)
);
const timestep = 1000 / 60;

const Viewport: FunctionComponent<{}> = (props) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [model, setModel] = useState<any>(null);

  const data = useDataStore((store) => store.handles);
  const commit = useDataStore((store) => store.commitData);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => {
        let newNodes = applyNodeChanges(changes, nds);
        return newNodes;
      }),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        let newEdges = applyEdgeChanges(changes, eds);
        return newEdges;
      }),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        let newEdges = addEdge(params, eds);
        setModel(buildModel(nodes, newEdges));
        return newEdges;
      }),
    [nodes]
  );

  useEffect(() => {
    console.log("Model", model);
  }, [model]);
  useEffect(() => {
    console.log("Data: ", data);
  }, [data]);

  useEffect(() => {
    let timeout: number | null = null;
    // let last = Date.now();
    function update() {
      // const delta = Date.now() - last;
      // last = Date.now();
      // console.log(1000 / delta);

      const result = evaluate(model, data);
      commit(result.toCommit);

      timeout = setTimeout(() => update(), timestep) as any;
    }
    console.log("Starting Updating Loop");
    timeout = setTimeout(() => update(), timestep) as any;
    return () => {
      if (timeout !== null) {
        console.log("Clearing Updating Loop");
        clearTimeout(timeout);
      }
    };
  }, [model, data, commit]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
    >
      <Controls></Controls>
      <Background></Background>
    </ReactFlow>
  );
};

export default Viewport;
