import { FunctionComponent, useCallback, useMemo, useState } from "react";
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
import ConstantValueNode from "../nodes/ConstantValueNode";

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
    position: { x: 100, y: 0 },
    data: 0,
  },
];

const initialEdges: Edge<any>[] = [];

const Viewport: FunctionComponent<{}> = (props) => {
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      constantValue: ConstantValueNode,
    }),
    []
  );

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

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
