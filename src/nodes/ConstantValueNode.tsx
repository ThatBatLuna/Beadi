import { NodeDef } from "../engine/node";

export const constantValueNodeDef: NodeDef = {
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
    },
  ],
  executor: (i) => {
    return i;
  },
};
