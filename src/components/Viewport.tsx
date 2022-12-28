import {
  FunctionComponent,
  ReactNode,
  RefObject,
  useCallback,
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
import { nodeDefs } from "../engine/node";
import { DisplayStore, useDisplayStore } from "../engine/store";
import { makeNodeRenderer } from "./node/NodeRenderer";
import shallow from "zustand/shallow";
import { Engine } from "./Engine";
import { useDrop } from "react-dnd";

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
  const viewport = useViewport();
  const [_, drop] = useDrop(
    () => ({
      accept: "Node",
      drop: (item, monitor) => {
        console.log(item);
        const offset = monitor.getClientOffset();

        const viewportPos = position(wrapper.current!!);
        console.log(drop);
        const [clientX, clientY] = [
          (offset?.x || 0) - (viewportPos[0] || 0) - viewport.x,
          (offset?.y || 0) - (viewportPos[1] || 0) - viewport.y,
        ];
        console.log("L", viewportPos);

        console.log(clientX, clientY);
        onNodeDrop?.({ x: clientX, y: clientY }, (item as any).type);
      },
    }),
    [viewport]
  );

  return (
    <div ref={drop} className="top-0 left-0 w-full h-full">
      {children}
    </div>
  );
};

const nodeTypes: NodeTypes = _.mapValues(nodeDefs, (it) =>
  makeNodeRenderer(it)
);

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
  const { addNode, addEdge } = useDisplayStore(
    (s) => ({ addNode: s.addNode, addEdge: s.addEdge }),
    shallow
  );

  const complete = useCallback(
    (type: string) => {
      const newId = addNode(type, data.pos);
      const targetHandle = nodeDefs[type].inputs[0];

      addEdge({
        id: `${data.source}__${data.sourceHandle}___${newId}__${targetHandle.id}`,
        source: data.source,
        target: newId,
        sourceHandle: data.sourceHandle,
        targetHandle: targetHandle.id,
      });
    },
    [addNode, addEdge, data]
  );

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0" onClick={onClose}>
      <div
        className="absolute z-50 p-2 text-white border bg-black/90 border-primary-700"
        style={{ top: data.screenPos.y, left: data.screenPos.x }}
      >
        <ul>
          {Object.values(nodeDefs).map((it) => (
            <li onClick={() => complete(it.type)}>{it.label}</li>
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
