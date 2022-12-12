import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const constantValueNodeDef: NodeDef = {
  label: "Value",
  category: categories["generators"],
  type: "constantValue",
  // component: ConstantValueNode,
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
  ],
  inputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
      default: 0.0,
    },
  ],
  executor: (i) => {
    return i;
  },
};
