import { FunctionComponent, useMemo } from "react";
import { NodeProps, useEdges } from "reactflow";
import NumberInput from "../input/NumberInput";
import NodeHandleLine from "./NodeHandleLine";
import NodeShell from "./NodeShell";
import { InputHandleDef, NodeDef } from "../../engine/node";
import { useInputHandleData } from "../../engine/store";
type HandleInputProps = {
  input: InputHandleDef;
  nodeId: string;
};
const NumberHandleInput: FunctionComponent<HandleInputProps> = ({
  nodeId,
  input,
}) => {
  const [value, setValue] = useInputHandleData<any>(nodeId, input.id);

  return (
    <NumberInput
      id={input.id}
      name={input.id}
      label={input.label}
      min={input.min}
      max={input.max}
      value={value}
      onChange={(e) => setValue(e.value)}
    ></NumberInput>
  );
};
const inputs: Record<string, FunctionComponent<HandleInputProps>> = {
  number: NumberHandleInput,
};
type HandleInputCProps = {
  type: string;
  input: InputHandleDef;
  nodeId: string;
};
function getHandleInput({ type, input, nodeId }: HandleInputCProps) {
  const Component = inputs[type];
  if (Component !== undefined) {
    return <Component input={input} nodeId={nodeId}></Component>;
  }
  return undefined;
}

export function makeNodeRenderer(
  def: NodeDef
): FunctionComponent<NodeProps<any>> {
  const HeaderComponent = def.header;
  const inputs = def.inputs.filter((it) => it.hidden !== true);

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
      <NodeShell title={def.label} color={def.category.color}>
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
