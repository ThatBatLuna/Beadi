import { FunctionComponent } from "react";
import { useInputHandleData } from "../../engine/store";
import NumberInput from "../input/NumberInput";
import { TextInput } from "../input/TextInput";
import { HandleInputProps } from "./NodeRenderer";
import { Button } from "../input/Button";
import { useSignalBus } from "../../engine/signal";
import { Checkbox } from "../input/Checkbox";

const NumberHandleInput: FunctionComponent<HandleInputProps> = ({ nodeId, handleId, input }) => {
  const [value, setValue] = useInputHandleData<any>(nodeId, handleId);

  return (
    <NumberInput
      id={`${nodeId}__${handleId}`}
      name={handleId}
      label={input.label}
      min={input.min}
      max={input.max}
      value={value}
      onChange={(e) => setValue(e.value)}
    ></NumberInput>
  );
};

const StringHandleInput: FunctionComponent<HandleInputProps> = ({ handleId, nodeId, input }) => {
  const [value, setValue] = useInputHandleData<any>(nodeId, handleId);

  return (
    <TextInput id={`${nodeId}__${handleId}`} name={handleId} label={input.label} value={value} onChange={(e) => setValue(e)}></TextInput>
  );
};

const BooleanHandleInput: FunctionComponent<HandleInputProps> = ({ handleId, nodeId, input }) => {
  //TODO GUI STUB
  const [value, setValue] = useInputHandleData<boolean>(nodeId, handleId);

  return (
    <div onMouseDownCapture={(e) => e.stopPropagation()}>
      <Checkbox checked={value} onChange={(c) => setValue(c)} label={input.label}></Checkbox>
    </div>
  );
};

const ImpulseHandleInput: FunctionComponent<HandleInputProps> = ({ handleId, nodeId, input }) => {
  const emit = useSignalBus((s) => s.emit);

  return (
    <div onMouseDownCapture={(e) => e.stopPropagation()}>
      <Button onClick={() => emit(nodeId, handleId)}>{input.label}</Button>
    </div>
  );
};

export const NODE_HANDLE_INPUT_TYPES: Record<string, FunctionComponent<HandleInputProps>> = {
  number: NumberHandleInput,
  string: StringHandleInput,
  boolean: BooleanHandleInput,
  impulse: ImpulseHandleInput,
};
