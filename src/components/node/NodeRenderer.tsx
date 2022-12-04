import { FunctionComponent, useMemo } from "react";
import { NodeProps, useEdges } from "reactflow";
import NumberInput from "../input/NumberInput";
import NodeHandleLine from "./NodeHandleLine";
import NodeShell from "./NodeShell";
import { NodeDef } from "../../engine/node";
import { useInputHandleData } from "../../engine/store";

export function makeNodeRenderer(
  def: NodeDef
): FunctionComponent<NodeProps<any>> {
  const HeaderComponent = def.header;

  return ({ id, data }) => {
    const edges = useEdges();

    const store = def.inputs.map((input) => {
      const [value, setValue] = useInputHandleData<any>(id, input.id);
      return {
        value,
        setValue,
      };
    });

    const connections = useMemo(() => {
      return def.inputs.map(
        (input) =>
          edges.findIndex(
            (it) => it.target === id && it.targetHandle === input.id
          ) >= 0
      );
    }, [edges, id]);

    return (
      <NodeShell title={def.type + " " + id}>
        {HeaderComponent && (
          <HeaderComponent id={id} data={data}></HeaderComponent>
        )}
        {def.inputs.map((input, index) => (
          <NodeHandleLine
            key={input.id}
            type="input"
            label={input.label}
            id={input.id}
            connected={connections[index]}
            input={
              <NumberInput
                id={input.id}
                name={input.id}
                label={input.label}
                min={input.min}
                value={store[index].value}
                onChange={(e) => store[index].setValue(e.value)}
              ></NumberInput>
            }
          ></NodeHandleLine>
        ))}
        {def.outputs.map((output) => (
          <NodeHandleLine
            key={output.id}
            id={output.id}
            type="output"
            label={output.label}
          ></NodeHandleLine>
        ))}
      </NodeShell>
    );
  };
}
