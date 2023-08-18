import { Select } from "@beadi/components";
import { FunctionComponent } from "react";
import { NodeHeaderProps, useFileStore, useBeadi, InputAdapterNodeSettings } from "../..";

export const InputAdapterNodeHeader: FunctionComponent<NodeHeaderProps<{}, InputAdapterNodeSettings, any, any>> = ({ id, data }) => {
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
      <div className="w-full bg-primary-1000 rounded-md">
        <Select
          options={Object.values(beadi.inputAdapterDefs)}
          selected={adapterId == null ? null : beadi.inputAdapterDefs[adapterId]}
          onSelect={(def) => updateNode(id, (draft) => ((draft.data.settings as InputAdapterNodeSettings)["adapterId"] = def?.id ?? null))}
          renderOption={(s) => s.label}
        ></Select>
        {AdapterSettingsEditor && (
          <div className="bg-primary-1000 p-2">
            <AdapterSettingsEditor nodeId={id} settings={adapterSettings} updateSettings={updateNodeSettings}></AdapterSettingsEditor>
          </div>
        )}
      </div>
    </div>
  );
};
