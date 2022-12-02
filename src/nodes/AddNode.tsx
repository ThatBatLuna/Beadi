import { NodeDef } from "../engine/node";

export const addNodeDef: NodeDef = {
  type: "add",
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
    },
    {
      id: "b",
      label: "Value",
      type: "number",
    },
  ],
  executor: ([a, b]) => {
    return [a + b];
  },
};
