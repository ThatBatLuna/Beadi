import { nodeDef } from "../engine/node";
import { categories } from "./category";

export const randomNodeDef = nodeDef()({
  label: "Random Generator",
  category: categories["generators"],
  type: "random",
  outputs: {
    value: {
      label: "Value",
      type: "number",
    },
  },
  inputs: {
    height: {
      label: "Height",
      type: "number",
      default: 1.0,
      min: 0.0,
    },
    frequency: {
      label: "Frequency",
      type: "number",
      default: 1.0,
      min: 0.0,
    },
  },
  executor: {
    initialPersistence: {
      value: 0.0,
      last: new Date(),
    },

    executor: ({ height, frequency }, persistent) => {
      const sinceLast = new Date().getTime() - persistent.last.getTime();

      if (sinceLast > 1000 / frequency) {
        persistent.value = Math.random() * height;
        persistent.last = new Date();
      }

      return {
        persistentData: persistent,
        outputs: {
          value: persistent.value,
        },
        driverOutputs: {},
      };
    },
  },
});
