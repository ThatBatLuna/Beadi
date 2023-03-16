import { Node, Edge } from "reactflow";
import { nodeDefs } from "../nodes/nodes";
import { getConversionFunction } from "./handles";
import { NodeExecutor } from "./node";

export type NodeTypeData = Pick<Node<any>, "data" | "id" | "type">;
export type EdgeData = Pick<
  Edge<any>,
  "source" | "target" | "sourceHandle" | "targetHandle"
>;

export type RecipeDependency = {
  id: string;
  convert?: (it: any) => any;
};
export type Recipe = {
  dependencies: RecipeDependency[];
  outpus: string[];
  nodeId: string;
  func: NodeExecutor;
};

export type Model = {
  executionPlan: Recipe[];
};

function handleId(nodeId: string, handleId: string) {
  return `${nodeId}__${handleId}`;
}

type OutputDataEntry = {
  id: string;
  type: string;
};

export function buildModel(nodes: NodeTypeData[], edges: EdgeData[]): Model {
  //Find all terminating handles
  console.log("Rebuilding Model");

  let terminals = [];
  let nodeDict: Record<string, NodeTypeData> = {};

  for (const node of nodes) {
    nodeDict[node.id] = node;
    let nodeType = nodeDefs[node.type!!];
    if (nodeType !== undefined) {
      for (const input of nodeType.inputs) {
        if (input.terminal) {
          terminals.push({
            node: node.id,
            handle: input.id,
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
      let outputForInput: Record<string, OutputDataEntry> = {};
      for (const edge of suppliers) {
        const supplierNode = edge.source;

        const supplierType = nodeDefs[
          nodeDict[supplierNode].type!!
        ].outputs.find((it) => it.id === edge.sourceHandle)?.type;

        outputForInput[edge.targetHandle || "??"] = {
          type: supplierType!!,
          id: handleId(edge.source, edge.sourceHandle || "??"),
        };
        //Resolve the supplier Node
        resolveInputHandles(supplierNode);
      }

      executionPlan.push({
        dependencies: nodeType.inputs.map((inputHandle) => ({
          convert: getConversionFunction(
            outputForInput[inputHandle.id]?.type || inputHandle.type,
            inputHandle.type
          ),
          id:
            outputForInput[inputHandle.id]?.id ||
            `${nodeId}__input__${inputHandle.id}`,
        })),
        outpus: nodeType.outputs.map((outputHandle) =>
          handleId(nodeId, outputHandle.id)
        ),
        nodeId: nodeId,
        func: nodeType.executor,
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
