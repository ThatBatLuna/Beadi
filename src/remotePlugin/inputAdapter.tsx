import { set } from "lodash";
import { InputAdapterDef, InputAdapterSettingsEditorProps } from "../engine/adapter";
import { HandleDef, HandleType, TypeOfHandleType, asHandleType } from "../engine/node";
import { useIOValueStore } from "./inputOutputStore";
import { Select } from "../components/input/Select";
import { useFileStore } from "../engine/store";
import { FunctionComponent } from "react";
import { emitImpulse } from "../engine/signal";
import { notNull } from "../utils/notNull";
import { useRemoteStateStore } from "./remote/remoteStore";

export type RemoteInputAdapterSettings = {
  type: HandleType;
};

export const RemoteInputSettingsEditor: FunctionComponent<InputAdapterSettingsEditorProps<RemoteInputAdapterSettings>> = ({
  settings,
  updateSettings,
}) => {
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
  getType: (settings) => settings?.type,
  getData: (nodeId: string, settings) => {
    if (settings === undefined) {
      return 0.0;
    }
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

export type RemoteInputFromOutputAdapterSettings = {
  value: {
    valueId: string;
    remoteId: string;
  } | null;
};

export const RemoteInputFromOutputSettingsEditor: FunctionComponent<
  InputAdapterSettingsEditorProps<RemoteInputFromOutputAdapterSettings>
> = ({ settings, nodeId, updateSettings }) => {
  const values = useRemoteStateStore((s) =>
    Object.values(s.remotes)
      .flatMap((remote) => {
        if (remote.state.state === "connected") {
          return Object.values(remote.state.values).map((value) => ({
            value: value,
            remote: remote.definition,
          }));
        } else {
          return null;
        }
      })
      .filter(notNull)
  );

  const selected = values.find(
    (it) => it.remote.remoteConnectionId === settings?.value?.remoteId && it.value.valueId === settings?.value?.valueId
  );

  const updateValue = (s: (typeof values)[number] | null) => {
    if (s === null) {
      updateSettings({
        value: null,
      });
    } else {
      updateSettings({
        value: {
          remoteId: s.remote.remoteConnectionId,
          valueId: s.value.valueId,
        },
      });
    }
  };

  return (
    <div>
      <Select
        options={values}
        allowUnselect={false}
        selected={selected ?? null}
        renderOption={(s) => (
          <>
            {" "}
            {s.remote.code} - {s.value.name}
          </>
        )}
        onSelect={updateValue}
      />
    </div>
  );
};
export const remoteInputFromOutputAdapter: InputAdapterDef<number, RemoteInputFromOutputAdapterSettings> = {
  id: "remoteInputFromOutput",
  getType: (settings) => {
    if (settings?.value != null) {
      const remote = useRemoteStateStore.getState().remotes[settings.value.remoteId]?.state;
      if (remote !== undefined) {
        if (remote.state === "connected") {
          return remote.values[settings.value.valueId]?.type;
        }
      }
    }
  },
  getData: (nodeId, settings) => {
    if (settings?.value != null) {
      const remote = useRemoteStateStore.getState().remotes[settings.value.remoteId]?.state;
      if (remote !== undefined) {
        if (remote.state === "connected") {
          return remote.values[settings.value.valueId].value;
        }
      }
    }
  },
  label: "Read Remote Output",
  settingsEditor: RemoteInputFromOutputSettingsEditor,
};
