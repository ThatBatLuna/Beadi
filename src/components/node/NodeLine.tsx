import { FunctionComponent, ReactNode } from "react";
import { Handle, Position } from "reactflow";
import clsx from "clsx";

type NodeLineProps = {
  input?: ReactNode;
  type: "input" | "output";
  label: string;
};

const NodeLine: FunctionComponent<NodeLineProps> = ({ input, type, label }) => {
  return (
    <div className="flex flex-row items-center mt-2">
      {type === "input" && (
        <Handle
          type="target"
          id="value2"
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
        {input ? (
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
          id="value2"
          position={Position.Right}
          className="!static !translate-y-0 !w-3 !h-3 !-mr-1.5"
        ></Handle>
      )}
    </div>
  );
};

export default NodeLine;
