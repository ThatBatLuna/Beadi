import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { NodeProps, Handle, Position, useEdges } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeLine from "../components/node/NodeLine";
import NodeShell from "../components/node/NodeShell";
import { useInputHandleData } from "../engine/store";

const AddNode: FunctionComponent<NodeProps<any>> = ({ data, id }) => {
  const edges = useEdges();

  const [valueA, setValueA] = useInputHandleData<number>(id, "a");
  const [valueB, setValueB] = useInputHandleData<number>(id, "b");

  const connections = useMemo(() => {
    const inEdges = edges.filter((it) => it.target === id);
    // const outEdges = edges.filter((it) => it.source === id);

    // console.log(inEdges);

    return {
      value: inEdges.findIndex((it) => it.targetHandle === "a") >= 0,
      value2: inEdges.findIndex((it) => it.targetHandle === "b") >= 0,
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
          <NumberInput
            id="a"
            name="a"
            label="Value"
            value={valueA}
            onChange={(e) => setValueA(e.value)}
          ></NumberInput>
        }
      ></NodeLine>
      <NodeLine
        type="input"
        label="Value"
        id="b"
        connected={connections["value2"]}
        input={
          <NumberInput
            id="b"
            name="b"
            label="Value2"
            value={valueB}
            onChange={(e) => setValueB(e.value)}
          ></NumberInput>
        }
      ></NodeLine>
      <NodeLine id="sum" type="output" label="Value"></NodeLine>
    </NodeShell>
  );
};

export default AddNode;
