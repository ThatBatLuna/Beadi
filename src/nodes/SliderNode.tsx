import { FunctionComponent, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TextInput } from "../components/input/TextInput";
import { MobileViewProps, NodeDef, NodeHeaderProps } from "../engine/node";
import {
  useInputHandleData,
  usePushEphermalData,
  useSetNodeName,
} from "../engine/store";
import { categories } from "./category";

const SliderMobile: FunctionComponent<MobileViewProps> = ({ id, data }) => {
  const [value, setValue] = useInputHandleData<number>(id, "value");

  return (
    <input
      className="w-full"
      type="range"
      step="0.01"
      min={0}
      max={1}
      onChange={(e) => setValue(+e.target.value)}
      value={value}
    ></input>
    // <Slider onClick={() => push(true)} className="w-full text-lg">
    //   {data.name || "Slider"}
    // </Slider>
  );
};

const SliderNode: FunctionComponent<NodeHeaderProps> = ({ id, data }) => {
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
      {/* <Slider onClick={() => push(true)}>Send Signal</Slider> */}
    </div>
  );
};

export const SLIDER_NODE_TYPE = "slider";
export const sliderNodeDef: NodeDef = {
  label: "Slider",
  category: categories["control"],
  type: SLIDER_NODE_TYPE,
  header: SliderNode,
  mobileView: SliderMobile,
  inputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
      default: 1.0,
      min: 0.0,
      max: 1.0,
    },
  ],
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
  ],
  executor: ([v]) => {
    return [v];
  },
};
