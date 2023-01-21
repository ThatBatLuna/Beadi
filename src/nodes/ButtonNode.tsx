import { FunctionComponent, useCallback } from "react";
import { Button } from "../components/input/Button";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { usePushEphermalData } from "../engine/store";
import { categories } from "./category";

const ButtonNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const push = usePushEphermalData(id, "signal");

  const fire = useCallback(() => {
    push(true);
  }, [push]);

  return (
    <div className="mx-auto w-fit">
      <Button onClick={fire}>Send Signal</Button>
    </div>
  );
};

export const BUTTON_NODE_TYPE = "button";
export const buttonNodeDef: NodeDef = {
  label: "Button",
  category: categories["control"],
  type: BUTTON_NODE_TYPE,
  header: ButtonNode,
  inputs: [],
  outputs: [
    {
      id: "signal",
      label: "Signal",
      type: "impulse",
    },
  ],
  executor: ([v], { ephermal }) => {
    return [ephermal["signal"] || false];
  },
};
