import { FunctionComponent, useCallback } from "react";
import { Connection, Handle, Position } from "reactflow";
import clsx from "clsx";
import { useFileStore } from "../../storage";
import { handlesCompatible } from "../../engine/handles";
import { NodeHandleDisplay } from "./NodeHandle";
import { nodeHandleValuePreviews } from "./NodeHandleValuePreview";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { HandleType, InputHandleDef, OutputHandleDef } from "../../engine/node";
import { useBeadi } from "../../context";
import { NODE_HANDLE_INPUT_TYPES } from "./nodeInputs";

type NodeHandleLineProps = {
  // input?: ReactNode;
  kind: "input" | "output";
  type: HandleType;
  label: string;
  connected?: boolean;
  handleId: string;
  handleDef: InputHandleDef | OutputHandleDef;
  nodeId: string;

  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
};

export const NodeHandleLine: FunctionComponent<NodeHandleLineProps> = ({
  // input,
  kind,
  type,
  label,
  handleId,
  connected,
  nodeId,
  handleDef,
  expanded,
  setExpanded,
}) => {
  // const [open, setOpen] = useState(false);

  const beadi = useBeadi();

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (
        connection.source === null ||
        connection.target === null ||
        connection.sourceHandle === null ||
        connection.targetHandle === null
      ) {
        return false;
      }
      const nodes = useFileStore.getStateWith(beadi).data.nodes;
      const targetType = nodes[connection.target].type;
      const sourceType = nodes[connection.source].type;
      console.log(connection, targetType, sourceType, nodes);
      if (targetType !== undefined && sourceType !== undefined) {
        return (
          connection.source !== connection.target &&
          handlesCompatible(
            beadi.getNodeOutputs(nodes[connection.source].type, nodes[connection.source].data.settings)[connection.sourceHandle].type,
            beadi.getNodeInputs(nodes[connection.target].type, nodes[connection.target].data.settings)[connection.targetHandle].type
          )
        );
      }
      return false;
    },
    [beadi]
  );

  const NodeHandleValuePreview = nodeHandleValuePreviews[type];

  const InputComponent = NODE_HANDLE_INPUT_TYPES[type];

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
          {connected === true ? (
            <span
              className={clsx("block px-2", {
                "text-start": kind === "input",
                "text-end": kind === "output",
              })}
            >
              {label}
            </span>
          ) : (
            <InputComponent handleId={handleId} input={handleDef as InputHandleDef} nodeId={nodeId}></InputComponent>
          )}
          {kind === "output" && NodeHandleValuePreview !== undefined && (
            <button onMouseDownCapture={(e) => e.stopPropagation()} onClick={() => setExpanded(!expanded)}>
              {expanded ? <MdExpandLess></MdExpandLess> : <MdExpandMore></MdExpandMore>}
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
      {expanded && kind === "output" && <NodeHandleValuePreview handleId={handleId} nodeId={nodeId} type={type}></NodeHandleValuePreview>}
    </div>
  );
};
