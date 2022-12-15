import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const hysteresisNodeDef: NodeDef = {
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
      id: "transparent",
      label: "Transparent",
      type: "number",
      default: 0.0,
    },
  ],
  executor: ([value, transparent], { commit, committed }) => {
    const out = committed["value"] || 0;

    if (transparent >= 1.0) {
      commit("value", 1.0);
    }

    return [out];
  },
};
