import { FunctionComponent, useCallback } from "react";
import { Button } from "../components/input/Button";
import { TextInput } from "../components/input/TextInput";
import { MobileViewProps, NodeDef, NodeHeaderProps } from "../engine/node";
import { usePushEphermalData, useSetNodeName } from "../engine/store";
import { categories } from "./category";

const ButtonMobile: FunctionComponent<MobileViewProps> = ({ id, data }) => {
  const push = usePushEphermalData(id, "signal");

  return (
    <Button onClick={() => push(true)} className="w-full text-lg">
      {data.name || "Button"}
    </Button>
  );
};

const ButtonNode: FunctionComponent<NodeHeaderProps> = ({ id, data }) => {
  const push = usePushEphermalData(id, "signal");

  const setNodeName = useSetNodeName(id);

  return (
    <div className="flex flex-col gap-2 px-2 ">
      <TextInput
        label="Label"
        onChange={setNodeName}
        value={data.name || ""}
        id={`${id}__mobile_label`}
      ></TextInput>
      <Button onClick={() => push(true)}>Send Signal</Button>
    </div>
  );
};

export const BUTTON_NODE_TYPE = "button";
export const buttonNodeDef: NodeDef = {
  label: "Button",
  category: categories["control"],
  type: BUTTON_NODE_TYPE,
  header: ButtonNode,
  mobileView: ButtonMobile,
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
