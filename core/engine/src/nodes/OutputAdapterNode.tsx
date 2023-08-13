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

const OutputAdapterNodeHeader: FunctionComponent<NodeHeaderProps<{}, OutputAdapterNodeSettings, any>> = ({ id, data }) => {
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
    const outputAdatperDef = beadi.outputAdapterDefs[s.adapterId];
    if (outputAdatperDef === undefined) {
      return {} as InputHandleDefs;
    }
    const type = outputAdatperDef.getType(s.adapterSettings?.[s.adapterId], beadi);
    if (type === undefined) {
      return {} as InputHandleDefs;
    }
    return {
      value: {
        label: "Value",
        type: type,
        default: 0.0, //TODO Typesafe defaults
      },
    };
  },
  outputs: {},
  executor: {
    inputDriver: undefined,
    outputDriver: ({ value }, context, beadi) => {
      if (context.settings.adapterId === null) {
        return {};
      }
      const adapter = beadi.outputAdapterDefs[context.settings.adapterId];
      if (context.settings.adapterId === undefined) {
        return {};
      }
      const settings = context.settings.adapterSettings?.[context.settings.adapterId];
      if (settings === undefined) {
        return {};
      }
      adapter.pushData(context.id, value, settings, beadi);
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
