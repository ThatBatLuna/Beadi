import { FunctionComponent, useEffect, useState } from "react";
import ReactFlow, { Controls, Background, NodeTypes } from "reactflow";
import { buildModel } from "../engine";
import _ from "lodash";
import { nodeDefs } from "../engine/node";
import { evaluate } from "../engine/evaluate";
import { DataStore, useDataStore } from "../engine/store";
import { makeNodeRenderer } from "./node/NodeRenderer";
import shallow from "zustand/shallow";

const nodeTypes: NodeTypes = _.mapValues(nodeDefs, (it) =>
  makeNodeRenderer(it)
);
const timestep = 1000 / 60;

const selector = (state: DataStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const Viewport: FunctionComponent<{}> = (props) => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useDataStore(selector, shallow);

  const [model, setModel] = useState<any>(null);

  const data = useDataStore((store) => store.handles);
  const commit = useDataStore((store) => store.commitData);

  useEffect(() => {
    setModel(buildModel(nodes, edges));
  }, [nodes, edges]);
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
