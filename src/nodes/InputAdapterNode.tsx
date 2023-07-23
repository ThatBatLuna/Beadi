import { FunctionComponent } from "react";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { inputAdapterDefs } from "../registries";
import { useFileStore } from "../engine/store";

export type InputAdapterNodeSettings = {
  adapterId: string;
};

const InputAdapterNodeHeader: FunctionComponent<NodeHeaderProps<{}, InputAdapterNodeSettings, any>> = ({ id, data }) => {
  const updateNode = useFileStore((s) => s.updateNode);
  const adapterId = data.settings.adapterId;

  return (
    <select
      onChange={(e) => updateNode(id, (draft) => ((draft.data.settings as InputAdapterNodeSettings)["adapterId"] = e.target.value))}
      value={adapterId}
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
      if (context.settings.adapterId === undefined) {
        return { value: 0 };
      }
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
