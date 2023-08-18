import { nodeDef } from "../engine/node";
import { categories } from "./category";

export const toggleNodeDef = nodeDef()({
  label: "Toggle",
  category: categories["control"],
  type: "toggle",
  outputs: {
    value: {
      label: "Value",
      type: "boolean",
    },
  },
  inputs: {
    toggle: {
      label: "Toggle",
      type: "impulse",
      default: false,
    },
    on: {
      label: "On",
      type: "impulse",
      default: false,
    },
    off: {
      label: "Off",
      type: "impulse",
      default: false,
    },
  },
  executor: {
    inputDriver: () => ({}),
    outputDriver: () => {},
    initialPersistence: false,
    executor: ({ toggle, on, off }, switchOn: boolean) => {
      //If we got an odd amount of toggle commands, then flip the switch (!== is XOR)
      let nextValue = switchOn !== (toggle.length % 2 !== 0);
      if (on.length > 0) {
        nextValue = true;
      }
      if (off.length > 0) {
        nextValue = false;
      }
      return {
        outputs: { value: nextValue },
        driverOutputs: {},
        persistentData: nextValue,
      };
    },
  },
});
