import { FunctionComponent, ReactNode, useCallback } from "react";
import { Connection, Handle, Position } from "reactflow";
import clsx from "clsx";
import { useDisplayStore } from "../../engine/store";
import { nodeDefs } from "../../engine/node";

type NodeHandleLineProps = {
  input?: ReactNode;
  kind: "input" | "output";
  type: string;
  label: string;
  connected?: boolean;
  id: string;
};

const ImpulseHandle: FunctionComponent<{}> = ({}) => {
  return (
    <svg
      viewBox="0 0 18 12"
      width="18"
      height="12"
      className="pointer-events-none fill-blue-900 stroke-white"
    >
      <path d="M 0.5,0.5 12,0.5 17.5,6 12,11.5 0.5,11.5 Z"></path>
    </svg>
  );
};

const NumberHandle: FunctionComponent<{}> = ({}) => {
  return (
    <div className="w-3 h-3 border border-white rounded-full pointer-events-none bg-primary-900"></div>
  );
};

const NodeHandleLine: FunctionComponent<NodeHandleLineProps> = ({
  input,
  kind,
  type,
  label,
  id,
  connected,
}) => {
  const classNames: Record<string, FunctionComponent<{}>> = {
    impulse: ImpulseHandle,
    number: NumberHandle,
  };

  const HandleDisplay = classNames[type];

  const nodes = useDisplayStore((store) => store.nodes);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const targetType = nodes.find((it) => it.id === connection.target)?.type;
      if (targetType !== undefined) {
        return (
          type ===
          nodeDefs[targetType].inputs.find(
            (input) => input.id === connection.targetHandle
          )?.type
        );
      }
      return false;
    },
    [type, nodes]
  );

  return (
    <div className="flex flex-row items-center mt-2">
      {kind === "input" && (
        <Handle
          type="target"
          id={id}
          isValidConnection={isValidConnection}
          position={Position.Left}
          className={clsx(
            "!static !translate-y-0 !w-fit !h-fit !-ml-1.5 !bg-transparent !border-none"
          )}
        >
          <HandleDisplay></HandleDisplay>
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
          className={clsx(
            "!static !translate-y-0 !-mr-1.5 !w-fit !h-fit !bg-transparent !border-none",
            classNames[type]
          )}
        >
          <HandleDisplay></HandleDisplay>
        </Handle>
      )}
    </div>
  );
};

export default NodeHandleLine;
