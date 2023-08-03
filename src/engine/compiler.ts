import _ from "lodash";
import create from "zustand";
import { getNodeOutputs } from "./node";
import { nodeDefs } from "../registries";
import { getConversionFunction } from "./handles";

export type RecipeDependency = {
  nodeId: string;
  handleId: string;
  convert?: (it: any) => any;
};
export type Recipe = {
  dependencies: Record<string, RecipeDependency | null>;
  settings: any;
  nodeId: string;
  type: string;
  // executor: AnyNodeExecutorDef;
};

export type Model = {
  preprocessIndependent: Recipe[];
  executionPlan: Recipe[];
  errors: Record<string, string>;
};

type EdgedNode = ModelNode & {
  originalIncomingEdges: Record<string, ModelEdge>;
  incomingEdges: ModelEdge[];
  outgoingEdges: ModelEdge[];
};

export function buildModel({ nodes: rawNodes, edges }: ModelSources): Model {
  const nodes = _.omitBy(rawNodes, (node) => !(node.type in nodeDefs));

  //Find all terminating handles
  console.log("Rebuilding Model");
  const errors: Record<string, string> = {};

  //NodeId -> FragmentId -> Data
  const edgedNodes: Record<string, EdgedNode> = _.mapValues(nodes, (n) => ({
    ...n,
    originalIncomingEdges: {},
    incomingEdges: [],
    outgoingEdges: [],
  }));
  for (const e of edges) {
    if (!(e.source in nodes)) {
      console.error("Could not find node source node of edge", e.id, " (", e.source, " => ", e.target, ")");
      continue;
    }
    if (!(e.target in nodes)) {
      console.error("Could not find node source node of edge", e.id, " (", e.source, " => ", e.target, ")");
      continue;
    }
    const sourceNodeOutputs = getNodeOutputs(nodes[e.source].type, nodes[e.source].settings);
    const sourceHandleDef = sourceNodeOutputs?.[e.sourceHandle];
    if (sourceHandleDef === undefined) {
      //If this edge invalid, log an error and ignore it
      console.warn("buildModel encountered invalid edge ", e, " that connects to nonexisting source.");
      continue;
    }
    //If its an impulse, we don't care about the ordering
    //If its an independent output it is present anyways before any executors are called.
    if (sourceHandleDef.type !== "impulse" && sourceHandleDef.independent !== true) {
      edgedNodes[e.target].incomingEdges.push(e);
      edgedNodes[e.source].outgoingEdges.push(e);
    }
    edgedNodes[e.target].originalIncomingEdges[e.targetHandle] = e;
  }

  const startNodes: EdgedNode[] = [];
  const restNodes: typeof edgedNodes = {};
  for (const node of Object.values(edgedNodes)) {
    if (node.incomingEdges.length === 0) {
      startNodes.push(node);
    } else {
      restNodes[node.id] = node;
    }
  }

  const plan: Recipe[] = [];

  while (startNodes.length > 0) {
    let node = startNodes.pop()!!;

    //PLAN PUSH
    plan.push({
      type: node.type,
      nodeId: node.id,
      settings: node.settings,
      dependencies: _.mapValues(nodeDefs[node.type].inputs, (inputDef, handleId) => {
        if (handleId in node.originalIncomingEdges) {
          const sourceNode = nodes[node.originalIncomingEdges[handleId].source];
          const sourceNodeOutputs = getNodeOutputs(sourceNode.type, sourceNode.settings);
          return {
            nodeId: node.originalIncomingEdges[handleId].source,
            handleId: node.originalIncomingEdges[handleId].sourceHandle,
            convert: getConversionFunction(sourceNodeOutputs[node.originalIncomingEdges[handleId].sourceHandle].type, inputDef.type),
          };
        } else {
          return null;
        }
      }),
    });

    //Remove all outgoing edges from the graph.
    for (const edge of node.outgoingEdges) {
      let targetNode = restNodes[edge.target];
      _.remove(targetNode.incomingEdges, (incomingEdge) => incomingEdge.id === edge!!.id);
      if (targetNode.incomingEdges.length === 0) {
        startNodes.push(targetNode);
        delete restNodes[edge.target];
      }
    }
  }

  for (const id in restNodes) {
    console.warn("Compiler found a loop at node id: ", id);
    errors[id] = "Node cannot be executed, because it sits within a loop of dependencies.";
  }

  return {
    executionPlan: plan,
    preprocessIndependent: _.values(nodes).map((node) => ({
      dependencies: {},
      nodeId: node.id,
      settings: node.settings,
      type: node.type,
    })),
    errors,
  };
}

/*

Constant 2 --->  Add 1 --\
           \->             ->  Add 4 ---> Display 5
                           -> 
          Constant 3 -----/


//Execution Plan
[
  2,
  1,
  3,
  4,
  5
]

//Nodes
{
  1: {
    inputs: [2_value, 2_value],
    exec: [FUNCTION, adds both inputs and writes 1_sum]
  }
  2: {
    inputs: [2_ivalue],
    exec: [FUNCTION, forwards input to 2_value]
  }
  3: {
    inputs: [2_ivalue],
    exec: [FUNCTION, forwards input to 2_value]
  }
  4: {
    inputs: [1_sum, 3_value],
    exec: [FUNCTION, adds both inputs and writes 4_sum]
  }
  5: {
    inputs: [4_sum],
    exec: [FUNCTION, displays 4_sum]
  }
}

//Datas
{
  2_ivalue: 1,
  3_ivalue: 2
}


*/

// function revalidateModel() {
//   const { nodes, edges } = useFileStore.getState();
//   const nodeTypeData: NodeTypeData[] = nodes.map((it) => ({
//     type: it.type,
//     id: it.id,
//     data: undefined,
//   }));
//   const edgeData: EdgeData[] = edges.map((it) => ({
//     source: it.source,
//     target: it.target,
//     sourceHandle: it.sourceHandle,
//     targetHandle: it.targetHandle,
//   }));

//   if (
//     !_.isEqual(edgeData, modelState?.edges) ||
//     !_.isEqual(nodeTypeData, modelState?.nodes)
//   ) {
//     console.log(
//       "Rebuilding Model",
//       edgeData,
//       modelState?.edges,
//       nodeTypeData,
//       modelState?.nodes
//     );
//     modelState = {
//       nodes: nodeTypeData,
//       edges: edgeData,
//       model: buildModel(nodeTypeData, edges),
//     };
//   }
// }

export type ModelNode = {
  id: string;
  type: string;
  settings: any;
};
export type ModelEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
};
export type ModelSources = {
  nodes: Record<string, ModelNode>;
  edges: ModelEdge[];
};
export type ModelStore = {
  sources: ModelSources;
  model: Model | null;
};

export const useModelState = create<ModelStore>()(() => ({
  sources: {
    nodes: {},
    edges: [],
  },
  model: null,
}));
