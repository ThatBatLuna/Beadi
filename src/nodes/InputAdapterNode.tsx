import { FunctionComponent } from "react";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { inputAdapterDefs } from "../registries";
import { useFileStore } from "../engine/store";
import { Select } from "../components/input/Select";

export type InputAdapterNodeSettings = {
  adapterId: string | null;
};

const InputAdapterNodeHeader: FunctionComponent<NodeHeaderProps<{}, InputAdapterNodeSettings, any>> = ({ id, data }) => {
  const updateNode = useFileStore((s) => s.updateNode);
  const adapterId = data.settings.adapterId;

  return (
    <Select
      options={Object.values(inputAdapterDefs)}
      allowUnselect={true}
      selected={adapterId === null ? null : inputAdapterDefs[adapterId]}
      onSelect={(def) => updateNode(id, (draft) => ((draft.data.settings as InputAdapterNodeSettings)["adapterId"] = def?.id ?? null))}
      renderOption={(s) => s.label}
    ></Select>
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
      if (context.settings.adapterId === null) {
        return { value: 0 };
      }
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
