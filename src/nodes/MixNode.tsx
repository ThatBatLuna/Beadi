import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const mixNodeDef: NodeDef = {
  label: "Mix",
  category: categories["math"],
  type: "mix",
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
      id: "amount",
      label: "Amount",
      type: "number",
      default: 1.0,
      min: 0.0,
    },
  ],
  executor: ([a, b, amount]) => {
    return [a * amount + b * (1 - amount)];
  },
};
