import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { update } from "../engine";
import AddNode from "../nodes/AddNode";
import ConstantValueNode from "../nodes/ConstantValueNode";
import DisplayNode from "../nodes/Display";
import ShowCaseNode from "../nodes/ShowcaseNode";

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
    type: "showcase",
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

const Viewport: FunctionComponent<{}> = (props) => {
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      constantValue: ConstantValueNode,
      add: AddNode,
      showcase: ShowCaseNode,
      display: DisplayNode,
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

  useEffect(() => {
    let interval = setTimeout(() => {
      //   console.log("Calc");
      setNodes((nodes) => update(nodes, edges));
    }, 20);

    return () => {
      clearTimeout(interval);
    };
  }, [setNodes, edges]);

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
