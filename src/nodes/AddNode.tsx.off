import { NodeDef } from "../engine/node";
import { categories } from "./category";

function makeMathNodeDef(it: {
  label: string;
  type: string;
  function: (a: number, b: number) => number;
}): NodeDef {
  return {
    label: it.label,
    category: categories["math"],
    type: it.type,
    // component: makeNodeRenderer,
    outputs: [
      {
        id: "sum",
        label: "Sum",
        type: "number",
      },
    ],
    inputs: [
      {
        id: "a",
        label: "Value",
        type: "number",
        default: 0.0,
      },
      {
        id: "b",
        label: "Value",
        type: "number",
        default: 0.0,
      },
    ],
    executor: ([a, b]) => {
      return [it.function(a, b)];
    },
  };
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
