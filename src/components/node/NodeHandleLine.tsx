import { FunctionComponent, ReactNode, useCallback } from "react";
import { Connection, Handle, Position } from "reactflow";
import clsx from "clsx";
import { useDisplayStore } from "../../engine/store";
import { handlesCompatible } from "../../engine/handles";
import { NodeHandleDisplay } from "./NodeHandle";
import { nodeDefs } from "../../nodes/nodes";

type NodeHandleLineProps = {
  input?: ReactNode;
  kind: "input" | "output";
  type: string;
  label: string;
  connected?: boolean;
  id: string;
};

const NodeHandleLine: FunctionComponent<NodeHandleLineProps> = ({
  input,
  kind,
  type,
  label,
  id,
  connected,
}) => {
  const nodes = useDisplayStore((store) => store.nodes);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const targetType = nodes.find((it) => it.id === connection.target)?.type;
      const sourceType = nodes.find((it) => it.id === connection.source)?.type;
      console.log(connection, targetType, sourceType, nodes);
      if (targetType !== undefined && sourceType !== undefined) {
        return (
          connection.source !== connection.target &&
          handlesCompatible(
            nodeDefs[sourceType].outputs.find(
              (output) => output.id === connection.sourceHandle
            )?.type || "",
            nodeDefs[targetType].inputs.find(
              (input) => input.id === connection.targetHandle
            )?.type || ""
          )
        );
      }
      return false;
    },
    [nodes]
  );

  return (
    <div className="flex flex-row items-center mt-2">
      {kind === "input" && (
        <Handle
          type="target"
          id={id}
          isValidConnection={isValidConnection}
          position={Position.Left}
          className="!static !translate-y-0 !w-fit !h-fit !-ml-1.5 !bg-transparent !border-none"
        >
          <NodeHandleDisplay type={type}></NodeHandleDisplay>
        </Handle>
      )}
      <div
        className={clsx("grow", {
          "mr-1.5 ml-3": kind === "output",
          "mr-3 ml-1.5": kind === "input",
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
      </div>

      {kind === "output" && (
        <Handle
          type="source"
          id={id}
          position={Position.Right}
          isValidConnection={isValidConnection}
          className="!static !translate-y-0 !-mr-1.5 !w-fit !h-fit !bg-transparent !border-none"
        >
          <NodeHandleDisplay type={type}></NodeHandleDisplay>
        </Handle>
      )}
    </div>
  );
};

export default NodeHandleLine;
