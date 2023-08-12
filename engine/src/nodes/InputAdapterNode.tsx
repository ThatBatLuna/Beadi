import { FunctionComponent } from "react";
import { NodeHeaderProps, OutputHandleDefs, nodeDef } from "../engine/node";
import { categories } from "./category";
import { useFileStore } from "../engine/store";
import { Select } from "../components/input/Select";
import { useBeadi } from "../context";

export type InputAdapterNodeSettings = {
  adapterId: string | null;
  /** adapterSettings stores settings per adapterId, so that if the adapter is changed the settings are kept */
  adapterSettings: Record<string, any>;
};

const InputAdapterNodeHeader: FunctionComponent<NodeHeaderProps<{}, InputAdapterNodeSettings, any>> = ({ id, data }) => {
  const updateNode = useFileStore((s) => s.updateNode);
  const beadi = useBeadi();
  const adapterId = data.settings.adapterId;
  const adapterSettings = data.settings.adapterId == null ? undefined : data.settings.adapterSettings?.[data.settings.adapterId];
  const AdapterSettingsEditor = adapterId != null ? beadi.inputAdapterDefs[adapterId]?.settingsEditor : undefined;

  const updateNodeSettings = (s: any) => {
    if (adapterId !== null) {
      updateNode(id, (d) => {
        (d.data.settings as InputAdapterNodeSettings).adapterSettings = {
          [adapterId]: s,
        };
      });
    }
  };

  return (
    <div className="w-full p-2">
      <Select
        options={Object.values(beadi.inputAdapterDefs)}
        selected={adapterId == null ? null : beadi.inputAdapterDefs[adapterId]}
        onSelect={(def) => updateNode(id, (draft) => ((draft.data.settings as InputAdapterNodeSettings)["adapterId"] = def?.id ?? null))}
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

export const INPUT_ADAPTER_NODE_ID = "inputAdapter";
export const inputAdapterNode = nodeDef<InputAdapterNodeSettings>()({
  label: "Input",
  category: categories["inout"],
  type: INPUT_ADAPTER_NODE_ID,
  header: InputAdapterNodeHeader,
  outputs: (s, beadi) => {
    if (s.adapterId === null) {
      return {} as OutputHandleDefs;
    }
    const inputAdatperDef = beadi.inputAdapterDefs[s.adapterId];
    if (inputAdatperDef === undefined) {
      return {} as OutputHandleDefs;
    }
    const type = inputAdatperDef.getType(s.adapterSettings?.[s.adapterId]);
    if (type === undefined) {
      return {} as OutputHandleDefs;
    }
    return {
      value: {
        label: "Value",
        type: type,
      },
    };
  },
  inputs: {},
  executor: {
    inputDriver: (context, beadi) => {
      if (context.settings.adapterId === null) {
        return {};
      }
      const adapter = beadi.inputAdapterDefs[context.settings.adapterId];
      if (context.settings.adapterId === undefined) {
        return {};
      }
      const settings = context.settings.adapterSettings?.[context.settings.adapterId];
      return { value: adapter.getData(context.id, settings) };
    },
    outputDriver: () => {},
    initialPersistence: undefined,
    executor: (_a, _b, data) => {
      return {
        outputs: {
          value: data.value,
        },
        driverOutputs: {},
        persistentData: undefined,
      };
    },
  },
});
