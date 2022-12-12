import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const addNodeDef: NodeDef = {
  label: "Add",
  category: categories["math"],
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
