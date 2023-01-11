import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const clampNodeDef: NodeDef = {
  label: "Clamp",
  category: categories["math"],
  type: "clamp",
  // component: WaveNode,
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
  ],
  inputs: [
    {
      id: "max",
      label: "Max",
      type: "number",
      default: 1.0,
    },
    {
      id: "min",
      label: "Min",
      type: "number",
      default: 0.0,
    },
    {
      id: "value",
      label: "Value",
      type: "number",
      default: 0.0,
    },
  ],
  executor: ([max, min, value]) => {
    return [Math.min(max, Math.max(min, value))];
  },
};
