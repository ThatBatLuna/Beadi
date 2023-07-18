import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const randomNodeDef: NodeDef = {
  label: "Random Generator",
  category: categories["generators"],
  type: "random",
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
  ],
  inputs: [
    {
      id: "height",
      label: "Height",
      type: "number",
      default: 1.0,
      min: 0.0,
    },
    {
      id: "frequency",
      label: "Frequency",
      type: "number",
      default: 1.0,
      min: 0.0,
    },
  ],
  executor: ([height, frequency], { commit, committed }) => {
    const out = committed["value"] || 0.0;
    const last = committed["last"] || 0.0;

    const sinceLast = new Date().getTime() - last;

    if (sinceLast > 1000 / frequency) {
      commit("value", Math.random() * height);
      commit("last", new Date().getTime());
    }

    return [out];
  },
};
