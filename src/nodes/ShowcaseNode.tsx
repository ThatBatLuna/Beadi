import { FunctionComponent, useCallback } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeHandleLine from "../components/node/NodeHandleLine";
import NodeShell from "../components/node/NodeShell";

const ShowCaseNode: FunctionComponent<NodeProps<any>> = ({ data }) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt);
  }, []);

  return (
    <NodeShell title="Showcase">
      <NodeHandleLine
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
      ></NodeHandleLine>
      <NodeHandleLine
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
      ></NodeHandleLine>
      <NodeHandleLine id="output1" type="output" label="Value"></NodeHandleLine>
      <NodeHandleLine id="output2" type="input" label="Value"></NodeHandleLine>
    </NodeShell>
  );
};

export default ShowCaseNode;
