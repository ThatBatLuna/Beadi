import { FunctionComponent, useCallback } from "react";
import { NodeProps, Handle, Position, useStore } from "reactflow";
import NumberInput, { ChangeEvent } from "../components/input/NumberInput";
import NodeHandleLine from "../components/node/NodeHandleLine";
import NodeShell from "../components/node/NodeShell";
import { useDataStore, useInputHandleData } from "../engine/store";

const WaveNode: FunctionComponent<NodeProps<any>> = ({ data, id }) => {
  const [value, setValue] = useInputHandleData<number>(id, "value");

  const onChange = useCallback(
    (evt: ChangeEvent) => {
      setValue(evt.value);
    },
    [setValue]
  );

  return (
    <NodeShell title={"Wave" + id}>
      <NodeHandleLine
        type="output"
        label="Value"
        id="value"
        input={
          <NumberInput
            id="value"
            name="value"
            label="Value"
            value={value}
            onChange={onChange}
          ></NumberInput>
        }
      ></NodeHandleLine>
    </NodeShell>
  );
};

export default WaveNode;
