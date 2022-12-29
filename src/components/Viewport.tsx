import {
  FunctionComponent,
  ReactNode,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Controls,
  Background,
  NodeTypes,
  useViewport,
  ReactFlowProvider,
  useReactFlow,
  OnConnectEnd,
  XYPosition,
  OnConnectStart,
  OnConnectStartParams,
} from "reactflow";
import _ from "lodash";
import { DisplayStore, useDisplayStore } from "../engine/store";
import { makeNodeRenderer } from "./node/NodeRenderer";
import shallow from "zustand/shallow";
import { Engine } from "./Engine";
import { useDrop } from "react-dnd";
import { handlesCompatible } from "../engine/handles";
import { NodeHandleDisplay } from "./node/NodeHandle";
import { WelcomeNode } from "../nodes/WelcomeNode";
import { nodeDefs } from "../nodes/nodes";

function position(e: HTMLElement) {
  let element: HTMLElement | null = e;
  let x = 0;
  let y = 0;

  while (element != null) {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.parentElement;
  }

  return [x, y];
}

type ViewportDropTargetDrop = {
  children: ReactNode;
  wrapper: RefObject<HTMLDivElement>;
  onNodeDrop?: (pos: XYPosition, type: string) => void;
};
const ViewportDropTarget: FunctionComponent<ViewportDropTargetDrop> = ({
  children,
  onNodeDrop,
  wrapper,
}) => {
  const { project } = useReactFlow();

  const [_, drop] = useDrop(
    () => ({
      accept: "Node",
      drop: (item, monitor) => {
        const offset = monitor.getClientOffset();

        const viewportPos = position(wrapper.current!!);
        const pos = project({
          x: (offset?.x || 0) - (viewportPos[0] || 0),
          y: (offset?.y || 0) - (viewportPos[1] || 0),
        });
        onNodeDrop?.(pos, (item as any).type);
      },
    }),
    [project]
  );

  return (
    <div ref={drop} className="top-0 left-0 w-full h-full">
      {children}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  ..._.mapValues(nodeDefs, (it) => makeNodeRenderer(it)),
  welcome: WelcomeNode,
};

const selector = (state: DisplayStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  addEdge: state.addEdge,
});

type NodeDropdownData = {
  source: string;
  sourceHandle: string;
  pos: XYPosition;
  screenPos: XYPosition;
};
type NewNodeDropDownProps = {
  data: NodeDropdownData;
  onClose: () => void;
};
const NewNodeDropdown: FunctionComponent<NewNodeDropDownProps> = ({
  data,
  onClose,
}) => {
  const { addNode, addEdge, nodes } = useDisplayStore(
    (s) => ({ addNode: s.addNode, addEdge: s.addEdge, nodes: s.nodes }),
    shallow
  );

  const handles = useMemo(() => {
    const sourceNodeType = nodes.find((it) => it.id === data.source)?.type;
    if (sourceNodeType !== undefined) {
      const handleType = nodeDefs[sourceNodeType].outputs.find(
        (output) => output.id === data.sourceHandle
      )!!;

      return Object.values(nodeDefs)
        .flatMap((def) => def.inputs.map((it) => ({ node: def, input: it })))
        .filter(
          (it) =>
            handlesCompatible(it.input.type, handleType!!.type) &&
            it.input.hidden !== true
        );
    } else {
      return [];
    }
  }, [data.source, data.sourceHandle, nodes]);

  const complete = useCallback(
    (type: string, handle: string) => {
      const newId = addNode(type, data.pos);

      addEdge({
        id: `reactflow__edge-${data.source}${data.sourceHandle}-${newId}${handle}`,
        source: data.source,
        target: newId,
        sourceHandle: data.sourceHandle,
        targetHandle: handle,
      });
    },
    [addNode, addEdge, data]
  );

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0" onClick={onClose}>
      <div
        className="absolute z-50 text-white border rounded-md bg-black/90 border-primary-700"
        style={{ top: data.screenPos.y, left: data.screenPos.x }}
      >
        <ul className="overflow-y-scroll max-h-60">
          {handles.map((it) => (
            <li
              onClick={() => complete(it.node.type, it.input.id)}
              className="flex flex-row items-center gap-2 px-2 hover:bg-primary-800"
            >
              <NodeHandleDisplay type={it.input.type}></NodeHandleDisplay>
              {it.node.label} - {it.input.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Viewport: FunctionComponent<{
  wrapper: RefObject<HTMLDivElement | null>;
}> = ({ wrapper }) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useDisplayStore(selector, shallow);
  const { project } = useReactFlow();

  const connectingNode = useRef<OnConnectStartParams | null>(null);

  const onConnectStart: OnConnectStart = useCallback((_, start) => {
    connectingNode.current = start;
  }, []);

  const [nodeDropdownData, setNodeDropdownData] =
    useState<null | NodeDropdownData>(null);

  const closeDropdown = useCallback(() => {
    setNodeDropdownData(null);
  }, [setNodeDropdownData]);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = (event.target as any).classList.contains(
        "react-flow__pane"
      );
      if (targetIsPane) {
        const rect = wrapper.current?.getBoundingClientRect();

        const pos = project({
          x: event.clientX - rect!!.left - 75,
          y: event.clientY - rect!!.top,
        });

        if (connectingNode.current !== null) {
          setNodeDropdownData({
            pos: pos,
            screenPos: {
              x: event.clientX,
              y: event.clientY,
            },
            source: connectingNode.current.nodeId!!,
            sourceHandle: connectingNode.current.handleId!!,
          });
        }

        connectingNode.current = null;
      }
    },
    [project, wrapper, connectingNode, setNodeDropdownData]
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onConnectStart={onConnectStart}
        nodeTypes={nodeTypes}
      >
        <Controls></Controls>
        <Background className="bg-primary-1100"></Background>
      </ReactFlow>
      <Engine edges={edges} nodes={nodes}></Engine>
      {nodeDropdownData && (
        <NewNodeDropdown
          data={nodeDropdownData}
          onClose={closeDropdown}
        ></NewNodeDropdown>
      )}
    </>
  );
};

const ViewportWrapper: FunctionComponent<{}> = (props) => {
  const addNode = useDisplayStore((s) => s.addNode, shallow);
  const wrapper = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative grow" ref={wrapper}>
      <ReactFlowProvider>
        <ViewportDropTarget
          onNodeDrop={(pos, type) => addNode(type, pos)}
          wrapper={wrapper}
        >
          <Viewport wrapper={wrapper}></Viewport>
        </ViewportDropTarget>
      </ReactFlowProvider>
    </div>
  );
};

export default ViewportWrapper;
