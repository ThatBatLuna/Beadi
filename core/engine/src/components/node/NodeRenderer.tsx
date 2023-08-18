import { FunctionComponent, useMemo } from "react";
import { NodeProps, useEdges } from "reactflow";
import { NodeHandleLine } from "./NodeHandleLine";
import { InputHandleDef } from "../../engine/node";
import { UnknownBeadiNodeData, useFileStore } from "../../engine/store";
import { useModelState } from "../../engine/compiler";
import { EditableNodeTitle } from "./EditableNodeTitle";
import { NodeShell } from "@beadi/components";
import { useBeadiInstance } from "../..";
import { current } from "immer";
export type HandleInputProps = {
  input: InputHandleDef;
  handleId: string;
  nodeId: string;
};
export const BeadiNodeRenderer: FunctionComponent<NodeProps<UnknownBeadiNodeData>> = ({ id, data, type }) => {
  const beadi = useBeadiInstance();
  const edges = useEdges();
  const errors = useModelState((s) => s.model?.errors?.[id]);

  const def = beadi.context.nodeDefs[type];
  const HeaderComponent = def.header;

  const nodeInputs = beadi.getNodeInputs(def.type, data.settings);
  const inputs = Object.entries(nodeInputs).filter(([_inputId, it]) => it.hidden !== true);
  const connections = useMemo(() => {
    return inputs.map(([inputId, _input]) => edges.findIndex((it) => it.target === id && it.targetHandle === inputId) >= 0);
  }, [edges, id, inputs]);

  const nodeOutputs = beadi.getNodeOutputs(def.type, data.settings);

  const updateNode = useFileStore((s) => s.updateNode);
  const setNodeName = (s: string) => {
    let name = s.trim();
    if (name.length === 0) {
      updateNode(id, (n) => {
        n.data.name = undefined;
      });
    } else {
      updateNode(id, (n) => {
        n.data.name = s;
      });
    }
  };

  const setHandleExpanded = (e: boolean, handle: string) => {
    console.log("SHE", id, e, handle);
    updateNode(id, (n) => {
      console.log("D", handle, current(n.data.outputHandles));
      if (handle in n.data.outputHandles) {
        console.log("Expand ", e, handle, current(n.data.outputHandles));
        n.data.outputHandles[handle].preview = e;
      }
    });
  };

  return (
    <NodeShell
      title={<EditableNodeTitle title={data.name} emptyLabel={def.label} onChange={setNodeName}></EditableNodeTitle>}
      color={def.category.color}
      errors={errors}
    >
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
          expanded={false}
          setExpanded={() => {}}
          handleDef={input}
          // input={getHandleInput({
          //   type: input.type,
          //   input: input,
          //   handleId: inputId,
          //   nodeId: id,
          // })}
        ></NodeHandleLine>
      ))}
      {Object.entries(nodeOutputs).map(([outputId, output]) => (
        <NodeHandleLine
          key={outputId}
          handleId={outputId}
          kind="output"
          type={output.type}
          label={output.label}
          nodeId={id}
          handleDef={output}
          expanded={data.outputHandles?.[outputId]?.preview ?? false}
          setExpanded={(expanded) => setHandleExpanded(expanded, outputId)}
        ></NodeHandleLine>
      ))}
    </NodeShell>
  );
};
