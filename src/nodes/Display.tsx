import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { NodeProps, Handle, Position, useEdges } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeLine from "../components/node/NodeLine";
import NodeShell from "../components/node/NodeShell";
import { useCommittedData } from "../engine/store";

const DisplayNode: FunctionComponent<NodeProps<any>> = ({ data, id }) => {
  const value = useCommittedData(id, "display");

  console.log(value);

  return (
    <NodeShell title={"Display" + id + " " + value}>
      <NodeLine type="input" label="Value" id="value"></NodeLine>
    </NodeShell>
  );
};

export default DisplayNode;
