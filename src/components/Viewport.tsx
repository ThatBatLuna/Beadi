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
    type: "showCase",
    position: { x: 0, y: 0 },
    data: {
      value: 8,
    },
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

const nodeTypes: NodeTypes = _.mapValues(nodeDefs, (it) => it.component);

const Viewport: FunctionComponent<{}> = (props) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [model, setModel] = useState<any>(null);

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
    console.log(model);
  }, [model]);

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
