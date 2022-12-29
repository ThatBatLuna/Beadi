import { FunctionComponent, useCallback } from "react";
import { Button } from "../components/input/Button";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { usePushEphermalData } from "../engine/store";
import { categories } from "./category";

const ButtonNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const push = usePushEphermalData(id, "signal");

  const fire = useCallback(() => {
    console.log("FIRE");
    push(true);
  }, [push]);

  return (
    <>
      <Button onClick={fire}>Fire</Button>
    </>
  );
};

export const buttonNodeDef: NodeDef = {
  label: "Button",
  category: categories["control"],
  type: "button",
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
