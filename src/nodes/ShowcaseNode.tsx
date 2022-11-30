import { FunctionComponent, useCallback } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeLine from "../components/node/NodeLine";
import NodeShell from "../components/node/NodeShell";

const ShowCaseNode: FunctionComponent<NodeProps<any>> = ({ data }) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt);
  }, []);

  return (
    <NodeShell title="Showcase">
      <NodeLine
        type="input"
        label="Value"
        id="value1"
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
        type="output"
        label="Value"
        id="value2"
        input={
          <NumberInput
            id="value"
            name="value"
            label="Value"
            onChange={onChange}
          ></NumberInput>
        }
      ></NodeLine>
      <NodeLine id="output1" type="output" label="Value"></NodeLine>
      <NodeLine id="output2" type="input" label="Value"></NodeLine>
    </NodeShell>
  );
};

export default ShowCaseNode;
