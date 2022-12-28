import { FunctionComponent, ReactNode, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  NodeTypes,
  useViewport,
  ReactFlowProvider,
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
  onNodeDrop?: (pos: [number, number], type: string) => void;
};
const ViewportDropTarget: FunctionComponent<ViewportDropTargetDrop> = ({
  children,
  onNodeDrop,
}) => {
  const viewport = useViewport();
  const elem = useRef<HTMLDivElement | null>(null);
  const [_, drop] = useDrop(
    () => ({
      accept: "Node",
      drop: (item, monitor) => {
        console.log(item);
        const offset = monitor.getClientOffset();

        const viewportPos = position(elem.current!!);
        console.log(drop);
        const [clientX, clientY] = [
          (offset?.x || 0) - (viewportPos[0] || 0) - viewport.x,
          (offset?.y || 0) - (viewportPos[1] || 0) - viewport.y,
        ];
        console.log("L", viewportPos);

        console.log(clientX, clientY);
        onNodeDrop?.([clientX, clientY], (item as any).type);
      },
    }),
    [viewport]
  );

  return (
    <div ref={elem} className="top-0 left-0 w-full h-full">
      <div ref={drop} className="top-0 left-0 w-full h-full">
        {children}
      </div>
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
});

const Viewport: FunctionComponent<{}> = (props) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useDisplayStore(selector, shallow);

  return (
    <div className="relative grow">
      <ReactFlowProvider>
        <ViewportDropTarget onNodeDrop={(pos, type) => addNode(type, pos)}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
          >
            <Controls></Controls>
            <Background className="bg-primary-1100"></Background>
          </ReactFlow>
          <Engine edges={edges} nodes={nodes}></Engine>
        </ViewportDropTarget>
      </ReactFlowProvider>
    </div>
  );
};

export default Viewport;
