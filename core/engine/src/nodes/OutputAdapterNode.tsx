import { FunctionComponent } from "react";
import { InputHandleDefs, NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { useFileStore } from "../storage";
import { useBeadi } from "../context";
import { Select } from "@beadi/components";

export type OutputAdapterNodeSettings = {
  adapterId: string | null;
  adapterSettings: Record<string, any>;
};

const OutputAdapterNodeHeader: FunctionComponent<NodeHeaderProps<{}, OutputAdapterNodeSettings, any, any>> = ({ id, data }) => {
  const beadi = useBeadi();
  const updateNode = useFileStore((s) => s.updateNode);
  const adapterId = data.settings.adapterId;
  const adapterSettings = data.settings.adapterId == null ? undefined : data.settings.adapterSettings?.[data.settings.adapterId];
  const AdapterSettingsEditor = adapterId != null ? beadi.outputAdapterDefs[adapterId]?.settingsEditor : undefined;

  const updateNodeSettings = (s: any) => {
    if (adapterId !== null) {
      updateNode(id, (d) => {
        (d.data.settings as OutputAdapterNodeSettings).adapterSettings = {
          [adapterId]: s,
        };
      });
    }
  };

  return (
    <div className="w-full p-2">
      <Select
        options={Object.values(beadi.outputAdapterDefs)}
        selected={adapterId == null ? null : beadi.outputAdapterDefs[adapterId]}
        onSelect={(def) => updateNode(id, (draft) => ((draft.data.settings as OutputAdapterNodeSettings)["adapterId"] = def?.id ?? null))}
        renderOption={(s) => s.label}
      ></Select>
      {AdapterSettingsEditor && (
        <div>
          <AdapterSettingsEditor nodeId={id} settings={adapterSettings} updateSettings={updateNodeSettings}></AdapterSettingsEditor>
        </div>
      )}
    </div>
  );
};

export const OUTPUT_ADAPTER_NODE_ID = "outputAdapter";
export const outputAdapterNode = nodeDef<OutputAdapterNodeSettings>()({
  label: "Output",
  category: categories["inout"],
  type: OUTPUT_ADAPTER_NODE_ID,
  header: OutputAdapterNodeHeader,
  inputs: (s, beadi) => {
    if (s.adapterId === null) {
      return {} as InputHandleDefs;
    }
    const outputAdatperDef = beadi.context.outputAdapterDefs[s.adapterId];
    if (outputAdatperDef === undefined) {
      return {} as InputHandleDefs;
    }
    const inputs = outputAdatperDef.getTypes(s.adapterSettings?.[s.adapterId], beadi);
    if (inputs === undefined) {
      return {} as InputHandleDefs;
    }
    return inputs;
  },
  outputs: {},
  executor: {
    inputDriver: undefined,
    outputDriver: (handleValues, context, beadi) => {
      if (context.settings.adapterId === null) {
        return {};
      }
      const adapter = beadi.context.outputAdapterDefs[context.settings.adapterId];
      if (context.settings.adapterId === undefined) {
        return {};
      }
      const settings = context.settings.adapterSettings?.[context.settings.adapterId];
      if (settings === undefined) {
        return {};
      }
      adapter.pushData(context.id, handleValues, settings, beadi);
    },
    initialPersistence: undefined,
    executor: (handleValues) => {
      return {
        outputs: {},
        driverOutputs: handleValues,

        persistentData: undefined,
      };
    },
  },
});
