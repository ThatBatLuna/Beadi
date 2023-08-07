import { FunctionComponent } from "react";
import { OutputAdapterDef, OutputAdapterSettingsEditorProps } from "../engine/adapter";
import { HandleType, asHandleType } from "../engine/node";
import { Select } from "../components/input/Select";
import { usePublishStateStore } from "./publish/publishStore";
import { useRemoteStateStore } from "./remote/remoteStore";
import { notNull } from "../utils/notNull";
import { sendMessage } from "./message";

export type RemoteOutputAdapterSettings = {
  type: HandleType;
};

export const RemoteOutputSettingsEditor: FunctionComponent<OutputAdapterSettingsEditorProps<RemoteOutputAdapterSettings>> = ({
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

export const REMOTE_OUTPUT_ADAPTER_ID = "remoteOutput";
export const remoteOutputAdapter: OutputAdapterDef<number, RemoteOutputAdapterSettings> = {
  id: REMOTE_OUTPUT_ADAPTER_ID,
  getType: (settings) => settings?.type,
  pushData: (nodeId, data, settings) => {
    if (settings === undefined) {
      return;
    }
    if (settings.type === "impulse") {
      console.error("Output impulses are not yet supported.");
    }
    const safeValue = asHandleType(settings.type, data);
    if (safeValue !== undefined) {
      usePublishStateStore.getState().state.updateValue(nodeId, safeValue, true);
    }
  },
  label: "Remote",
  settingsEditor: RemoteOutputSettingsEditor,
};

export type RemoteOutputToInputAdapterSettings = {
  value: {
    valueId: string;
    remoteId: string;
  } | null;
};

export const RemoteOutputToInputSettingsEditor: FunctionComponent<OutputAdapterSettingsEditorProps<RemoteOutputToInputAdapterSettings>> = ({
  settings,
  nodeId,
  updateSettings,
}) => {
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

export const remoteOutputToInputAdapter: OutputAdapterDef<number, RemoteOutputToInputAdapterSettings> = {
  id: "remoteOutputToInput",
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
  pushData: (nodeId, data, settings) => {
    if (settings?.value != null) {
      const remote = useRemoteStateStore.getState().remotes[settings.value.remoteId]?.state;
      if (remote !== undefined) {
        if (remote.state === "connected") {
          sendMessage(remote.socket, {
            ValueChanged: {
              endpoint: settings.value.valueId,
              value: data,
            },
          });
        }
      }
    }
  },
  label: "Set Remote Value",
  settingsEditor: RemoteOutputToInputSettingsEditor,
};
