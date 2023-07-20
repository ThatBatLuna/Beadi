import { FunctionComponent } from "react";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { inputAdapterDefs, outputAdapterDefs } from "../registries";
import { useFileStore } from "../engine/store";

type OutputAdapterNodeSettings = {
  adapterId: string;
};

const OutputAdapterNodeHeader: FunctionComponent<NodeHeaderProps<{}, OutputAdapterNodeSettings, any>> = ({ id }) => {
  const [updateNode, settings] = useFileStore((s) => [s.updateNode, s.data.nodes[id].data.settings as OutputAdapterNodeSettings]);

  return (
    <div>
      <select
        onChange={(e) => updateNode(id, (draft) => ((draft.data.settings as OutputAdapterNodeSettings).adapterId = e.target.value))}
        value={settings.adapterId}
      >
        {Object.values(outputAdapterDefs).map((it) => (
          <option key={it.id} value={it.id}>
            {it.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const outputAdapterNode = nodeDef<OutputAdapterNodeSettings>()({
  label: "Output",
  category: categories["inout"],
  type: "outputAdapter",
  header: OutputAdapterNodeHeader,
  inputs: {
    value: {
      label: "Value",
      type: "number",
      default: 0.0,
    },
  },
  outputs: {},
  executor: {
    inputDriver: undefined,
    outputDriver: ({ value }, context) => {
      const adapter = outputAdapterDefs[context.settings.adapterId];
      if (adapter === undefined) {
        return {};
      }
      adapter.pushData(context.id, value);
    },
    initialPersistence: undefined,
    executor: ({ value }) => {
      return {
        outputs: {},
        driverOutputs: {
          value,
        },
        persistentData: undefined,
      };
    },
  },
});
