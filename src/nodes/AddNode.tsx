import { NodeDef, nodeDef } from "../engine/node";
import { categories } from "./category";

function makeMathNodeDef(it: { label: string; type: string; function: (a: number, b: number) => number }) {
  return nodeDef()({
    label: it.label,
    category: categories["math"],
    type: it.type,
    // component: makeNodeRenderer,
    outputs: {
      result: {
        label: "Result",
        type: "number",
      },
    },
    inputs: {
      a: {
        label: "Value",
        type: "number",
        default: 0.0,
      },
      b: {
        label: "Value",
        type: "number",
        default: 0.0,
      },
    },
    executor: {
      initialPersistence: undefined,
      executor: ({ a, b }) => {
        return {
          outputs: { result: it.function(a, b) },
          driverOutputs: {},
          persistentData: undefined,
        };
      },
    },
  });
}

export const addNodeDef = makeMathNodeDef({
  label: "Add",
  type: "add",
  function: (a, b) => a + b,
});
export const subtractNodeDef = makeMathNodeDef({
  label: "Subtract",
  type: "subtract",
  function: (a, b) => a - b,
});
export const multiplyNodeDef = makeMathNodeDef({
  label: "Multiply",
  type: "multiply",
  function: (a, b) => a * b,
});
export const divideNodeDef = makeMathNodeDef({
  label: "Divide",
  type: "divide",
  function: (a, b) => (b === 0 ? 0.0 : a / b),
});
