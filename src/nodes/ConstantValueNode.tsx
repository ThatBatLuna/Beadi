import { FunctionComponent, useCallback } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeLine from "../components/node/NodeLine";
import NodeShell from "../components/node/NodeShell";

const ConstantValueNode: FunctionComponent<NodeProps<any>> = ({ data }) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt);
  }, []);

  return (
    <NodeShell title="Constant Value">
      <NodeLine
        type="output"
        label="Value"
        id="value"
        input={
          <NumberInput
            id="value"
            name="value"
            label="Value"
            onChange={onChange}
          ></NumberInput>
        }
      ></NodeLine>
    </NodeShell>
  );
};

export default ConstantValueNode;
