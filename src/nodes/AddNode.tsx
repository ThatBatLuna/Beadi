import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { NodeProps, Handle, Position, useEdges } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeLine from "../components/node/NodeLine";
import NodeShell from "../components/node/NodeShell";

const AddNode: FunctionComponent<NodeProps<any>> = ({ data, id }) => {
  const edges = useEdges();

  const connections = useMemo(() => {
    const inEdges = edges.filter((it) => it.target === id);
    // const outEdges = edges.filter((it) => it.source === id);

    // console.log(inEdges);

    return {
      value: inEdges.findIndex((it) => it.targetHandle === "value") >= 0,
      value2: inEdges.findIndex((it) => it.targetHandle === "value2") >= 0,
    };
  }, [edges, id]);

  return (
    <NodeShell title={"Add" + id}>
      <NodeLine
        type="input"
        label="Value"
        id="a"
        connected={connections["value"]}
        input={
          <NumberInput id="value" name="value" label="Value"></NumberInput>
        }
      ></NodeLine>
      <NodeLine
        type="input"
        label="Value"
        id="b"
        connected={connections["value2"]}
        input={
          <NumberInput id="value2" name="value2" label="Value2"></NumberInput>
        }
      ></NodeLine>
      <NodeLine id="sum" type="output" label="Value"></NodeLine>
    </NodeShell>
  );
};

export default AddNode;
