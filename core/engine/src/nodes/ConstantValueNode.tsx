import { nodeDef } from "../engine/node";
import { categories } from "./category";

export const constantValueNodeDef = nodeDef()({
  label: "Value",
  category: categories["generators"],
  type: "constantValue",
  // component: ConstantValueNode,
  outputs: {
    value: {
      id: "value",
      label: "Value",
      type: "number",
    },
  },
  inputs: {
    value: {
      id: "value",
      label: "Value",
      type: "number",
      default: 0.0,
    },
  },
  executor: {
    initialPersistence: {},
    executor: ({ value }) => {
      return {
        driverOutputs: {},
        persistentData: {},
        outputs: {
          value: value,
        },
      };
    },
  },
});
