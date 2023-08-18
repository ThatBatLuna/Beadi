import { nodeDef } from "../engine/node";
import { categories } from "./category";

export const switchNodeDef = nodeDef()({
  label: "Switch",
  category: categories["control"],
  type: "switch",
  outputs: {
    value: {
      label: "Value",
      type: "number",
    },
  },
  inputs: {
    on: {
      label: "On Value",
      type: "number",
      default: 0.0,
    },
    off: {
      label: "Off Value",
      type: "number",
      default: 0.0,
    },
    zwitch: {
      label: "Switch",
      type: "boolean",
      default: true,
    },
  },
  executor: {
    inputDriver: () => ({}),
    outputDriver: () => {},
    initialPersistence: undefined,
    executor: ({ on, off, zwitch }) => {
      //If we got an odd amount of toggle commands, then flip the switch (!== is XOR)
      return {
        outputs: { value: zwitch ? on : off },
        driverOutputs: {},
        persistentData: undefined,
      };
    },
  },
});
