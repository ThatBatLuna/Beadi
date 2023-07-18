import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const hysteresisNodeDef: NodeDef = {
  label: "Hysteresis",
  category: categories["control"],
  type: "hysteresis",
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
      id: "high",
      label: "High Threshold",
      type: "number",
      default: 1.0,
    },
    {
      id: "low",
      label: "Low Threshold",
      type: "number",
      default: 0.0,
    },
  ],
  executor: ([value, high, low], { commit, committed }) => {
    const out = committed["value"] || 0;

    if (value >= high) {
      commit("value", 1.0);
    }
    if (value <= low) {
      commit("value", 0.0);
    }

    return [out];
  },
};
