import { FunctionComponent } from "react";
import { InputAdapterDef, OutputAdapterDef } from "../engine/adapter";
import { HandleType, asHandleType } from "../engine/node";
import { Select } from "../components/input/Select";
import { useIOValueStore } from "./inputOutputStore";

export type RemoteOutputAdapterSettings = {
  type: HandleType;
};

type RemoteOutputSettingsEditorProps = {
  settings: RemoteOutputAdapterSettings;
  updateSettings: (s: RemoteOutputAdapterSettings) => void;
};
export const RemoteOutputSettingsEditor: FunctionComponent<RemoteOutputSettingsEditorProps> = ({ settings, updateSettings }) => {
  const updateType = (type: HandleType | null) => {
    updateSettings({
      ...settings,
      type: type ?? "number",
    });
  };

  return (
    <div>
      <Select
        options={["number", "boolean", "impulse"] as HandleType[]}
        allowUnselect={false}
        selected={settings?.type ?? null}
        renderOption={(s) => s}
        onSelect={updateType}
      />
    </div>
  );
};

export const REMOTE_OUTPUT_ADAPTER_ID = "remoteOutput";
export const remoteOutputAdapter: OutputAdapterDef<number, RemoteOutputAdapterSettings> = {
  id: REMOTE_OUTPUT_ADAPTER_ID,
  getType: (settings) => settings.type,
  pushData: (nodeId, data, settings) => {
    if (settings.type === "impulse") {
      console.error("Output impulses are not yet supported.");
    }
    const safeValue = asHandleType(settings.type, data);
    if (safeValue !== undefined) {
      useIOValueStore.getState().setValue(nodeId, safeValue);
    }
  },
  label: "Remote",
  settingsEditor: RemoteOutputSettingsEditor,
};

export const remoteOutputToInputAdapter: OutputAdapterDef<number, {}> = {
  id: "remoteOutputToInput",
  getType: () => "number",
  pushData: (nodeId, data) => {
    console.log("RemoteOutputToRemoteInput", data);
  },
  label: "Set Remote Input",
};

export const testRemoteOutputAdapter: OutputAdapterDef<number, {}> = {
  id: "remoteOutput2",
  getType: () => "number",
  pushData: (nodeId, data) => {
    // console.log("Output2: ", data);
  },
  label: "Remote2",
};
