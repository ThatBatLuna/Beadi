import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { NodeProps, Handle, Position, useEdges } from "reactflow";
import NumberInput from "../components/input/NumberInput";
import NodeLine from "../components/node/NodeLine";
import NodeShell from "../components/node/NodeShell";

const DisplayNode: FunctionComponent<NodeProps<any>> = ({ data, id }) => {
  return (
    <NodeShell title="Display">
      <NodeLine type="input" label="Value" id="value"></NodeLine>
    </NodeShell>
  );
};

export default DisplayNode;
