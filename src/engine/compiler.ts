import _ from "lodash";
import { useFileStore } from "./store";
import create from "zustand";
import { AnyNodeExecutorDef } from "./node";
import { nodeDefs } from "../nodes/nodes";
import { getConversionFunction } from "./handles";

export type RecipeDependency = {
  nodeId: string;
  handleId: string;
  convert?: (it: any) => any;
};
export type Recipe = {
  dependencies: Record<string, RecipeDependency | null>;
  nodeId: string;
  type: string;
  // executor: AnyNodeExecutorDef;
};

export type Model = {
  executionPlan: Recipe[];
};

export function buildModel({ nodes, edges }: ModelSources): Model {
  //Find all terminating handles
  console.log("Rebuilding Model");

  let terminals = [];
  let nodeDict: Record<string, ModelNode> = {};

  for (const node of nodes) {
    nodeDict[node.id] = node;
    let nodeType = nodeDefs[node.type!!];
    if (nodeType !== undefined) {
      for (const inputId in nodeType.inputs) {
        const input = nodeType.inputs[inputId];
        if (input.terminal) {
          terminals.push({
            node: node.id,
            handle: inputId,
          });
        }
      }
    }
  }

  let executedNodes = new Set<string>([]);
  let executionPlan: Recipe[] = [];

  function resolveInputHandles(nodeId: string) {
    if (!executedNodes.has(nodeId)) {
      // console.group("Resolving ", nodeId);
      const nodeType = nodeDefs[nodeDict[nodeId].type!!];
      let suppliers = edges.filter((edge) => edge.target === nodeId);
      let outputForInput: Record<string, RecipeDependency> = {};
      for (const edge of suppliers) {
        const supplierNode = edge.source;

        const supplierType = nodeDefs[nodeDict[supplierNode].type].outputs[edge.sourceHandle]?.type;

        outputForInput[edge.targetHandle || "??"] = {
          convert: getConversionFunction(supplierType, nodeType.inputs[edge.targetHandle].type),
          nodeId: edge.source,
          handleId: edge.sourceHandle,
        };
        //Resolve the supplier Node
        resolveInputHandles(supplierNode);
      }

      executionPlan.push({
        dependencies: _.mapValues(nodeType.inputs, (handle, handleId) => {
          if (handleId in outputForInput) {
            return outputForInput[handleId];
          } else {
            return null;
          }
        }),
        nodeId: nodeId,
        type: nodeType.type,
      });
      executedNodes.add(nodeId);

      // console.groupEnd();
    }
  }

  for (const handle of terminals) {
    resolveInputHandles(handle.node);
  }

  return {
    executionPlan: executionPlan,
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
  nodes: ModelNode[];
  edges: ModelEdge[];
};
export type ModelStore = {
  sources: ModelSources;
  model: Model | null;
};

export const modelState = create<ModelStore>()(() => ({
  sources: {
    nodes: [],
    edges: [],
  },
  model: null,
}));
