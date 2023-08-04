import { set } from "lodash";
import { InputAdapterDef } from "../engine/adapter";
import { HandleDef, HandleType, TypeOfHandleType, asHandleType } from "../engine/node";
import { useIOValueStore } from "./inputOutputStore";
import { Select } from "../components/input/Select";
import { useFileStore } from "../engine/store";
import { FunctionComponent } from "react";
import { emitImpulse } from "../engine/signal";

export type RemoteInputAdapterSettings = {
  type: HandleType;
};

type RemoteInputSettingsEditorProps = {
  settings: RemoteInputAdapterSettings;
  updateSettings: (s: RemoteInputAdapterSettings) => void;
};
export const RemoteInputSettingsEditor: FunctionComponent<RemoteInputSettingsEditorProps> = ({ settings, updateSettings }) => {
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

export const REMOTE_INPUT_ADAPTER_ID = "remoteInput";
export const remoteInputAdapter: InputAdapterDef<TypeOfHandleType<HandleType>, RemoteInputAdapterSettings> = {
  id: REMOTE_INPUT_ADAPTER_ID,
  getType: (settings) => settings.type,
  getData: (nodeId: string, settings) => {
    if (settings.type === "impulse") {
      const value = useIOValueStore.getState().values[nodeId]?.value;
      const safeValue = asHandleType(settings.type, value);
      return emitImpulse(safeValue?.length ?? 0);
    }
    const value = useIOValueStore.getState().values[nodeId]?.value;
    const safeValue = asHandleType(settings.type, value);
    return safeValue ?? 0.0;
  },
  label: "Remote",
  settingsEditor: RemoteInputSettingsEditor,
};

export const remoteInputFromOutputAdapter: InputAdapterDef<number, RemoteInputAdapterSettings> = {
  id: "remoteInputFromOutput",
  getType: (settings) => settings.type,
  getData: (nodeId) => {
    // console.log("RemoteOutputToRemoteInput", data);
    return 0.0;
  },
  label: "Read Remote Output",
};

export const testRemoteInputAdapter: InputAdapterDef<number, RemoteInputAdapterSettings> = {
  id: "remoteInput2",
  getType: (settings) => settings.type,
  getData: (nodeId: string) => {
    return 83;
  },
  label: "Remote2",
};
