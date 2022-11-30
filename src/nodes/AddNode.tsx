import { FunctionComponent, useCallback } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeLine from "../components/node/NodeLine";
import NodeShell from "../components/node/NodeShell";

const AddNode: FunctionComponent<NodeProps<any>> = ({ data }) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt);
  }, []);

  return (
    <NodeShell title="Add">
      <NodeLine
        type="input"
        label="Value"
        input={
          <NumberInput
            id="value"
            name="value"
            label="Value"
            onChange={onChange}
          ></NumberInput>
        }
      ></NodeLine>
      <NodeLine
        type="input"
        label="Value"
        input={
          <NumberInput
            id="value"
            name="value"
            label="Value"
            onChange={onChange}
          ></NumberInput>
        }
      ></NodeLine>
      <NodeLine type="output" label="Value"></NodeLine>
    </NodeShell>
  );
};

export default AddNode;
