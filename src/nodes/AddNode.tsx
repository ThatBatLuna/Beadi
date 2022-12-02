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
    return [a + b];
  },
};
