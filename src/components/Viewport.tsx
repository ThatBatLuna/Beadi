import { FunctionComponent } from "react";
import ReactFlow, { Controls, Background, NodeTypes } from "reactflow";
import _ from "lodash";
import { nodeDefs } from "../engine/node";
import { DisplayStore, useDisplayStore } from "../engine/store";
import { makeNodeRenderer } from "./node/NodeRenderer";
import shallow from "zustand/shallow";
import { Engine } from "./Engine";

const nodeTypes: NodeTypes = _.mapValues(nodeDefs, (it) =>
  makeNodeRenderer(it)
);

const selector = (state: DisplayStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const Viewport: FunctionComponent<{}> = (props) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useDisplayStore(selector, shallow);

  return (
    <>
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
    </>
  );
};

export default Viewport;
