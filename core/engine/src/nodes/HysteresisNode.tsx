import { nodeDef } from "../engine/node";
import { categories } from "./category";

export const hysteresisNodeDef = nodeDef()({
  label: "Hysteresis",
  category: categories["control"],
  type: "hysteresis",
  outputs: {
    value: {
      id: "value",
      label: "Value",
      type: "boolean",
    },
  },
  inputs: {
    value: {
      id: "value",
      label: "Value",
      type: "number",
      default: 0.0,
    },
    highThreshold: {
      id: "highThreshold",
      label: "High Threshold",
      type: "number",
      default: 1.0,
    },
    lowThreshold: {
      id: "lowThreshold",
      label: "Low Threshold",
      type: "number",
      default: 0.0,
    },
  },
  executor: {
    initialPersistence: {
      high: false,
    },
    executor: ({ value, highThreshold, lowThreshold }, { high }) => {
      if (value >= highThreshold) {
        high = true;
      }
      if (value <= lowThreshold) {
        high = false;
      }

      return {
        outputs: {
          value: high,
        },
        persistentData: {
          high,
        },
        driverOutputs: {},
      };
    },
  },
});
