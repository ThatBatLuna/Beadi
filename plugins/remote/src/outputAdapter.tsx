import { sendMessage } from "./message";

import { OutputAdapterSettingsEditorProps, outputAdapterDef } from "@beadi/engine";
import { HandleType, asHandleType } from "@beadi/engine";
import { notNull } from "@beadi/engine";
import { FunctionComponent } from "react";
import { Select } from "@beadi/components";
import { usePublishStateStore, useRemoteStateStore } from "./storage";

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
export const remoteOutputAdapter = outputAdapterDef({
  id: REMOTE_OUTPUT_ADAPTER_ID,
  getTypes: (settings) =>
    settings == null
      ? undefined
      : {
          value: {
            label: "Value",
            type: settings.type,
            default: 0.0,
          },
        },
  pushData: (nodeId, data, settings, beadi) => {
    if (settings === undefined) {
      return;
    }
    if (settings.type === "impulse") {
      console.error("Output impulses are not yet supported.");
    }
    const safeValue = asHandleType(settings.type, data.value);
    if (safeValue !== undefined) {
      usePublishStateStore.getStateWith(beadi).state.updateValue(nodeId, safeValue, true);
    }
  },
  label: "Remote Display",
  settingsEditor: RemoteOutputSettingsEditor,
});

export type RemoteOutputToInputAdapterSettings = {
  value: {
    valueId: string;
    remoteId: string;
  } | null;
};

export const RemoteOutputToInputSettingsEditor: FunctionComponent<OutputAdapterSettingsEditorProps<RemoteOutputToInputAdapterSettings>> = ({
  settings,
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

export const remoteOutputToInputAdapter = outputAdapterDef({
  id: "remoteOutputToInput",
  getTypes: (settings, beadi) => {
    if (settings?.value != null) {
      const remote = useRemoteStateStore.getStateWith(beadi).remotes[settings.value.remoteId]?.state;
      if (remote !== undefined) {
        if (remote.state === "connected") {
          return {
            value: {
              label: "Value",
              type: remote.values[settings.value.valueId]?.type,
              //TODO Typesafe defaults
              default: 0.0,
            },
          };
        }
      }
    }
  },
  pushData: (_nodeId, data, settings, beadi) => {
    if (settings?.value != null) {
      const remote = useRemoteStateStore.getStateWith(beadi).remotes[settings.value.remoteId]?.state;
      if (remote !== undefined) {
        if (remote.state === "connected") {
          //TODO Why is valueChanged.value always a number?
          //TODO Maybe typecheck data.value here?
          sendMessage(remote.socket, {
            ValueChanged: {
              endpoint: settings.value.valueId,
              value: data.value as any,
            },
          });
        }
      }
    }
  },
  label: "Set Remote Value",
  settingsEditor: RemoteOutputToInputSettingsEditor,
});
