import { FunctionComponent } from "react";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { inputAdapterDefs } from "../registries";
import { useFileStore } from "../engine/store";

type InputAdapterNodeSettings = {
  adapterId: string;
};

const InputAdapterNodeHeader: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const [updateNode, adapter] = useFileStore((s) => [s.updateNode, s.data.nodes[id].data.settings as InputAdapterNodeSettings]);

  return (
    <select
      onChange={(e) => updateNode(id, (draft) => ((draft.data.settings as InputAdapterNodeSettings)["adapterId"] = e.target.value))}
      value={adapter.adapterId}
    >
      {Object.values(inputAdapterDefs).map((it) => (
        <option key={it.id} value={it.id}>
          {it.label}
        </option>
      ))}
    </select>
  );
};

export const inputAdapterNode = nodeDef<InputAdapterNodeSettings>()({
  label: "Input",
  category: categories["inout"],
  type: "inputAdapter",
  header: InputAdapterNodeHeader,
  outputs: {
    value: {
      label: "Value",
      type: "number",
    },
  },
  inputs: {},
  executor: {
    inputDriver: (context) => {
      const adapter = inputAdapterDefs[context.settings.adapterId];
      return { value: adapter.getData(context.id) };
    },
    outputDriver: () => {},
    initialPersistence: undefined,
    executor: (_a, _b, { value }) => {
      return {
        outputs: {
          value,
        },
        driverOutputs: {},
        persistentData: undefined,
      };
    },
  },
});
