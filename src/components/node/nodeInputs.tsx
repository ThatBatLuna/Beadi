import { FunctionComponent } from "react";
import { useInputHandleData } from "../../engine/store";
import NumberInput from "../input/NumberInput";
import { TextInput } from "../input/TextInput";
import { HandleInputProps } from "./NodeRenderer";

const NumberHandleInput: FunctionComponent<HandleInputProps> = ({
  nodeId,
  input,
}) => {
  const [value, setValue] = useInputHandleData<any>(nodeId, input.id);

  return (
    <NumberInput
      id={`${nodeId}__${input.id}`}
      name={input.id}
      label={input.label}
      min={input.min}
      max={input.max}
      value={value}
      onChange={(e) => setValue(e.value)}
    ></NumberInput>
  );
};

const StringHandleInput: FunctionComponent<HandleInputProps> = ({
  nodeId,
  input,
}) => {
  const [value, setValue] = useInputHandleData<any>(nodeId, input.id);

  return (
    <TextInput
      id={`${nodeId}__${input.id}`}
      name={input.id}
      label={input.label}
      value={value}
      onChange={(e) => setValue(e)}
    ></TextInput>
  );
};

export const NODE_HANDLE_INPUT_TYPES: Record<
  string,
  FunctionComponent<HandleInputProps>
> = {
  number: NumberHandleInput,
  string: StringHandleInput,
};
