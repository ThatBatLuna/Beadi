import { ComponentType, FunctionComponent, useMemo } from "react";
import { NodeProps, useEdges } from "reactflow";
import NumberInput from "../input/NumberInput";
import NodeHandleLine from "./NodeHandleLine";
import NodeShell from "./NodeShell";
import { InputHandleDef, NodeDef } from "../../engine/node";
import { NodeData, useInputHandleData } from "../../engine/store";
import { MobileVisibleSwitch, PublishedSwitch } from "./NodeHeaderIcons";
import { NODE_HANDLE_INPUT_TYPES } from "./nodeInputs";
export type HandleInputProps = {
  input: InputHandleDef;
  nodeId: string;
};
type HandleInputCProps = {
  type: string;
  input: InputHandleDef;
  nodeId: string;
};
function getHandleInput({ type, input, nodeId }: HandleInputCProps) {
  const Component = NODE_HANDLE_INPUT_TYPES[type];
  if (Component !== undefined) {
    return <Component input={input} nodeId={nodeId}></Component>;
  }
  return undefined;
}

export function makeNodeRenderer(
  def: NodeDef
): ComponentType<NodeProps<NodeData>> {
  const HeaderComponent = def.header;
  const inputs = def.inputs.filter((it) => it.hidden !== true);

  if (def.nodeComponent) {
    return def.nodeComponent;
  }

  const canBeMobile = def.mobileView !== undefined;
  const publishable = def.publishable && canBeMobile;

  return ({ id, data }) => {
    const edges = useEdges();

    const connections = useMemo(() => {
      return inputs.map(
        (input) =>
          edges.findIndex(
            (it) => it.target === id && it.targetHandle === input.id
          ) >= 0
      );
    }, [edges, id]);

    return (
      <NodeShell
        title={def.label}
        color={def.category.color}
        headerIcons={
          <div className="flex flex-row">
            {canBeMobile && (
              <MobileVisibleSwitch
                visible={data.mobileVisible}
                nodeId={id}
              ></MobileVisibleSwitch>
            )}
            {publishable && (
              <PublishedSwitch
                published={data.published}
                nodeId={id}
              ></PublishedSwitch>
            )}
          </div>
        }
      >
        {HeaderComponent && (
          <HeaderComponent id={id} data={data}></HeaderComponent>
        )}
        {inputs.map((input, index) => (
          <NodeHandleLine
            key={input.id}
            kind="input"
            type={input.type}
            label={input.label}
            id={input.id}
            connected={connections[index]}
            input={getHandleInput({
              type: input.type,
              input: input,
              nodeId: id,
            })}
          ></NodeHandleLine>
        ))}
        {def.outputs.map((output) => (
          <NodeHandleLine
            key={output.id}
            id={output.id}
            kind="output"
            type={output.type}
            label={output.label}
          ></NodeHandleLine>
        ))}
      </NodeShell>
    );
  };
}
