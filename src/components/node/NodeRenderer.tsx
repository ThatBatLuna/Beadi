import { ComponentType, FunctionComponent, useMemo } from "react";
import { NodeProps, useEdges } from "reactflow";
import NumberInput from "../input/NumberInput";
import NodeHandleLine from "./NodeHandleLine";
import NodeShell from "./NodeShell";
import { AnyNodeDef, InputHandleDef, NodeDef } from "../../engine/node";
import { NODE_HANDLE_INPUT_TYPES } from "./nodeInputs";
import { UnknownBeadiNodeData } from "../../engine/store";
import { useModelState } from "../../engine/compiler";
export type HandleInputProps = {
  input: InputHandleDef;
  handleId: string;
  nodeId: string;
};
type HandleInputCProps = {
  type: string;
  input: InputHandleDef;
  nodeId: string;
  handleId: string;
};
function getHandleInput({ type, input, nodeId, handleId }: HandleInputCProps) {
  const Component = NODE_HANDLE_INPUT_TYPES[type];
  if (Component !== undefined) {
    return <Component input={input} nodeId={nodeId} handleId={handleId}></Component>;
  }
  return undefined;
}

export function makeNodeRenderer(def: AnyNodeDef): ComponentType<NodeProps<UnknownBeadiNodeData>> {
  const HeaderComponent = def.header;
  const inputs = Object.entries(def.inputs).filter(([inputId, it]) => it.hidden !== true);

  if (def.nodeComponent) {
    return def.nodeComponent;
  }

  return ({ id, data }) => {
    const edges = useEdges();
    const errors = useModelState((s) => s.model?.errors?.[id]);

    const connections = useMemo(() => {
      return inputs.map(([inputId, input]) => edges.findIndex((it) => it.target === id && it.targetHandle === inputId) >= 0);
    }, [edges, id]);

    return (
      <NodeShell title={def.label} color={def.category.color} errors={errors}>
        {HeaderComponent && <HeaderComponent id={id} data={data}></HeaderComponent>}
        {inputs.map(([inputId, input], index) => (
          <NodeHandleLine
            key={inputId}
            kind="input"
            nodeId={id}
            type={input.type}
            label={input.label}
            handleId={inputId}
            connected={connections[index]}
            input={getHandleInput({
              type: input.type,
              input: input,
              handleId: inputId,
              nodeId: id,
            })}
          ></NodeHandleLine>
        ))}
        {Object.entries(def.outputs).map(([outputId, output]) => (
          <NodeHandleLine
            key={outputId}
            handleId={outputId}
            kind="output"
            type={output.type}
            label={output.label}
            nodeId={id}
          ></NodeHandleLine>
        ))}
      </NodeShell>
    );
  };
}
