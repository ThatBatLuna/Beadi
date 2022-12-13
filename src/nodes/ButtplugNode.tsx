import { FunctionComponent, useRef } from "react";
import NodeLine from "../components/node/NodeLine";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData } from "../engine/store";
import { categories } from "./category";

const ButtplugNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const value = useCommittedData<number>(id, "value");

  console.log("Value: ", value);

  return <></>;
};

export const buttplugNodeDef: NodeDef = {
  label: "Buttplug",
  category: categories["display"],
  type: "buttplug",
  header: ButtplugNode,
  outputs: [],
  inputs: [
    {
      terminal: true,
      id: "value",
      label: "Value",
      type: "number",
      default: 0.0,
    },
  ],
  executor: ([v], { commit }) => {
    commit("value", v);
    return [];
  },
};
