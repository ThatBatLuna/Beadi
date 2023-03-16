import _ from "lodash";
import { buildModel, EdgeData, Model, NodeTypeData } from ".";
import { evaluate } from "./evaluate";
import { useDataStore, useDisplayStore } from "./store";

const timestep = 1000 / 60;

let timeout: number | null = null;
let modelState: {
  nodes: NodeTypeData[];
  edges: EdgeData[];
  model: Model;
} | null = null;

function revalidateModel() {
  const { nodes, edges } = useDisplayStore.getState();
  const nodeTypeData: NodeTypeData[] = nodes.map((it) => ({
    type: it.type,
    id: it.id,
    data: undefined,
  }));
  const edgeData: EdgeData[] = edges.map((it) => ({
    source: it.source,
    target: it.target,
    sourceHandle: it.sourceHandle,
    targetHandle: it.targetHandle,
  }));

  if (
    !_.isEqual(edgeData, modelState?.edges) ||
    !_.isEqual(nodeTypeData, modelState?.nodes)
  ) {
    console.log(
      "Rebuilding Model",
      edgeData,
      modelState?.edges,
      nodeTypeData,
      modelState?.nodes
    );
    modelState = {
      nodes: nodeTypeData,
      edges: edgeData,
      model: buildModel(nodeTypeData, edges),
    };
  }
}

export function runEngineLoop() {
  // let last = Date.now();
  function update() {
    // const delta = Date.now() - last;
    // last = Date.now();
    // console.log(1000 / delta);
    //
    const ephermal = useDataStore.getState().popEphermalData();
    const data = useDisplayStore.getState().handles;
    const committedData = useDataStore.getState().committed;
    const commit = useDataStore.getState().commitData;

    if (modelState !== null) {
      const result = evaluate(modelState.model, data, committedData, ephermal);
      commit(result.toCommit);
    } else {
      console.warn("Couldn't evaluate as there was no model built.");
    }

    timeout = setTimeout(update, timestep) as any;
    revalidateModel();
  }
  if (timeout !== null) {
    console.log("Restarting Engine Loop");
    clearTimeout(timeout);
  }
  timeout = setTimeout(update, timestep) as any;
}
