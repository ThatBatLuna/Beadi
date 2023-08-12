import { FunctionComponent, ReactNode, useCallback, useState } from "react";
import { Connection, Handle, Position } from "reactflow";
import clsx from "clsx";
import { useFileStore } from "../../engine/store";
import { handlesCompatible } from "../../engine/handles";
import { NodeHandleDisplay } from "./NodeHandle";
import { nodeDefs } from "../../registries";
import { nodeHandleValuePreviews } from "./NodeHandleValuePreview";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { HandleType, getNodeInputs, getNodeOutputs } from "../../engine/node";

type NodeHandleLineProps = {
  input?: ReactNode;
  kind: "input" | "output";
  type: HandleType;
  label: string;
  connected?: boolean;
  handleId: string;
  nodeId: string;
};

const NodeHandleLine: FunctionComponent<NodeHandleLineProps> = ({ input, kind, type, label, handleId, connected, nodeId }) => {
  const [open, setOpen] = useState(false);

  const isValidConnection = useCallback((connection: Connection) => {
    if (connection.source === null || connection.target === null || connection.sourceHandle === null || connection.targetHandle === null) {
      return false;
    }
    const nodes = useFileStore.getState().data.nodes;
    const targetType = nodes[connection.target].type;
    const sourceType = nodes[connection.source].type;
    console.log(connection, targetType, sourceType, nodes);
    if (targetType !== undefined && sourceType !== undefined) {
      return (
        connection.source !== connection.target &&
        handlesCompatible(
          getNodeOutputs(nodes[connection.source].type, nodes[connection.source].data.settings)[connection.sourceHandle].type,
          getNodeInputs(nodes[connection.target].type, nodes[connection.target].data.settings)[connection.targetHandle].type
        )
      );
    }
    return false;
  }, []);

  const NodeHandleValuePreview = nodeHandleValuePreviews[type];

  return (
    <div className="flex flex-col items-stretch mt-2 w-full">
      <div className="flex flex-row items-center">
        {kind === "input" && (
          <Handle
            type="target"
            id={handleId}
            isValidConnection={isValidConnection}
            position={Position.Left}
            className="!static !translate-y-0 !w-fit !h-fit !-ml-1.5 !bg-transparent !border-none"
          >
            <NodeHandleDisplay type={type}></NodeHandleDisplay>
          </Handle>
        )}
        <div
          className={clsx("grow flex flex-row", {
            "mr-1.5 ml-3 justify-end": kind === "output",
            "mr-3 ml-1.5 justify-start": kind === "input",
          })}
        >
          {input && connected !== true ? (
            input
          ) : (
            <span
              className={clsx("block px-2", {
                "text-start": kind === "input",
                "text-end": kind === "output",
              })}
            >
              {label}
            </span>
          )}
          {kind === "output" && NodeHandleValuePreview !== undefined && (
            <button onMouseDownCapture={(e) => e.stopPropagation()} onClick={() => setOpen(!open)}>
              {open ? <MdExpandLess></MdExpandLess> : <MdExpandMore></MdExpandMore>}
            </button>
          )}
        </div>

        {kind === "output" && (
          <Handle
            type="source"
            id={handleId}
            position={Position.Right}
            isValidConnection={isValidConnection}
            className="!static !translate-y-0 !-mr-1.5 !w-fit !h-fit !bg-transparent !border-none"
          >
            <NodeHandleDisplay type={type}></NodeHandleDisplay>
          </Handle>
        )}
      </div>
      {open && <NodeHandleValuePreview handleId={handleId} nodeId={nodeId} type={type}></NodeHandleValuePreview>}
    </div>
  );
};

export default NodeHandleLine;
