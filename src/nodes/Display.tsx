import { FunctionComponent } from "react";
import NodeLine from "../components/node/NodeLine";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData } from "../engine/store";

const DisplayNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const value = useCommittedData<number>(id, "display");

  return (
    <NodeLine>
      <p>{value}</p>
    </NodeLine>
  );
};

export const displayNodeDef: NodeDef = {
  type: "display",
  // component: DisplayNode,
  header: DisplayNode,
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
  executor: ([v], commit) => {
    commit("display", v);
    return [];
  },
};
