import { FunctionComponent, ReactNode, useState } from "react";
import { Handle, Position } from "reactflow";
import clsx from "clsx";

type NodeLineProps = {
  input?: ReactNode;
  type: "input" | "output";
  label: string;
  connected?: boolean;
  id: string;
};

const NodeLine: FunctionComponent<NodeLineProps> = ({
  input,
  type,
  label,
  id,
  connected,
}) => {
  return (
    <div className="flex flex-row items-center mt-2">
      {type === "input" && (
        <Handle
          type="target"
          id={id}
          position={Position.Left}
          className="!static !translate-y-0 !w-3 !h-3 !-ml-1.5"
        ></Handle>
      )}
      <div
        className={clsx("grow", {
          "mr-1.5 ml-3": type === "output",
          "mr-3 ml-1.5": type === "input",
        })}
      >
        {input && connected !== true ? (
          input
        ) : (
          <span
            className={clsx("block px-2", {
              "text-start": type === "input",
              "text-end": type === "output",
            })}
          >
            {label}
          </span>
        )}
      </div>

      {type === "output" && (
        <Handle
          type="source"
          id={id}
          position={Position.Right}
          className="!static !translate-y-0 !w-3 !h-3 !-mr-1.5"
        ></Handle>
      )}
    </div>
  );
};

export default NodeLine;
