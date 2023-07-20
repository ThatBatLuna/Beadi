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
      independent: true,
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
        console.log("Saving", value);
        persistent.value = value;
      }

      return {
        driverOutputs: {},
        outputs: {},
        persistentData: persistent,
      };
    },
    independentExecutor: (persistent) => {
      return {
        outputs: {
          value: persistent.value,
        },
      };
    },
  },
});
