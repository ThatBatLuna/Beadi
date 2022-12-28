import { FunctionComponent, useCallback } from "react";
import { Button } from "../components/input/Button";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useHandleData } from "../engine/store";
import { categories } from "./category";

const ButtonNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const [value, setValue] = useHandleData("input", id, "signal");

  const fire = useCallback(() => {
    console.log("FIRE");
    setValue(true);
  }, [setValue]);

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
  outputs: [
    {
      id: "signal",
      label: "Signal",
      type: "impulse",
    },
  ],
  inputs: [
    {
      id: "signal",
      label: "Signal",
      type: "impulse",
      default: false,
    },
  ],
  executor: ([v], { commit }) => {
    return [v];
  },
};
