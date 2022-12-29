import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const toggleNodeDef: NodeDef = {
  label: "Toggle",
  category: categories["control"],
  type: "toggle",
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
  ],
  inputs: [
    {
      id: "a",
      label: "Value",
      type: "number",
      default: 0.0,
    },
    {
      id: "b",
      label: "Value",
      type: "number",
      default: 0.0,
    },
    {
      id: "toggle",
      label: "Toggle",
      type: "impulse",
      default: false,
    },
  ],
  executor: ([a, b, toggle], { commit, committed }) => {
    const out = committed["switch"] || false;

    if (toggle) {
      commit("switch", !out);
    }

    return [out ? b : a];
  },
};
