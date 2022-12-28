import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const memoryNodeDef: NodeDef = {
  label: "Memory",
  category: categories["control"],
  type: "memory",
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
    {
      id: "save",
      label: "Save",
      type: "impulse",
      default: 0.0,
    },
  ],
  executor: ([value, save], { commit, committed }) => {
    console.log(save);

    const out = committed["value"] || value;

    if (save) {
      commit("value", value);
    }

    return [out];
  },
};
