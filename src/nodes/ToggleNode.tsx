import { nodeDef } from "../engine/node";
import { categories } from "./category";

export const toggleNodeDef = nodeDef({
  label: "Toggle",
  category: categories["control"],
  type: "toggle",
  outputs: {
    value: {
      label: "Value",
      type: "number",
    },
  },
  inputs: {
    a: {
      label: "Off Value",
      type: "number",
      default: 0.0,
    },
    b: {
      label: "On Value",
      type: "number",
      default: 0.0,
    },
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
    executor: ({ a, b, toggle, on, off }, switchOn: boolean) => {
      //If we got an odd amount of toggle commands, then flip the switch (!== is XOR)
      let nextValue = switchOn !== (toggle.length % 2 !== 0);
      if (on) {
        nextValue = true;
      }
      if (off) {
        nextValue = false;
      }
      return {
        outputs: { value: switchOn ? b : a },
        driverOutputs: {},
        persistentData: nextValue,
      };
    },
  },
});
