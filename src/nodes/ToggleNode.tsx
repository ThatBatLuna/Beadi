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
      label: "Off Value",
      type: "number",
      default: 0.0,
    },
    {
      id: "b",
      label: "On Value",
      type: "number",
      default: 0.0,
    },
    {
      id: "toggle",
      label: "Toggle",
      type: "impulse",
      default: false,
    },
    {
      id: "on",
      label: "On",
      type: "impulse",
      default: false,
    },
    {
      id: "off",
      label: "Off",
      type: "impulse",
      default: false,
    },
  ],
  executor: ([a, b, toggle, on, off], { commit, committed }) => {
    const out = committed["switch"] || false;

    if (toggle) {
      commit("switch", !out);
    }
    if (on) {
      commit("switch", true);
    }
    if (off) {
      commit("switch", false);
    }

    return [out ? b : a];
  },
};
