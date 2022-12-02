import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NodeProps, Handle, Position, useEdges } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeHandleLine from "../components/node/NodeHandleLine";
import NodeLine from "../components/node/NodeLine";
import NodeShell from "../components/node/NodeShell";
import { useCommittedData } from "../engine/store";

const DisplayNode: FunctionComponent<NodeProps<any>> = ({ data, id }) => {
  const value = useCommittedData<number>(id, "display");

  return (
    <NodeShell title={"Display" + id}>
      <NodeLine>
        <p>{value}</p>
      </NodeLine>
      <NodeHandleLine type="input" label="Value" id="value"></NodeHandleLine>
    </NodeShell>
  );
};

export default DisplayNode;
