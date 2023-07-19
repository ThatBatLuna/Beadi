import { NodeDef, nodeDef } from "../engine/node";
import { categories } from "./category";

export const memoryNodeDef = nodeDef()({
  label: "Memory",
  category: categories["control"],
  type: "memory",
  outputs: {
    value: {
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
    save: {
      id: "save",
      label: "Save",
      type: "impulse",
      default: 0.0,
    },
  },
  executor: {
    initialPersistence: {
      value: 0.0,
    },

    executor: ({ value, save }, persistent) => {
      if (save.length > 0) {
        persistent.value = value;
      }

      return {
        driverOutputs: {},
        outputs: {
          value: persistent.value,
        },
        persistentData: persistent,
      };
    },
  },
});
