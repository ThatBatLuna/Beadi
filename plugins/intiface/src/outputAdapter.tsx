import { OutputAdapterDef, OutputAdapterSettingsEditorProps, notNull } from "@beadi/engine";
import { FunctionComponent } from "react";
import { useIntifaceStore } from "./storage";
import { Select } from "@beadi/components";

export type IntifaceAdapterSettings = {
  value: {
    actuatorIndex: number;
    deviceIndex: number;
    connectionId: string;
  } | null;
};

export const IntifaceSettingsEditor: FunctionComponent<OutputAdapterSettingsEditorProps<IntifaceAdapterSettings>> = ({
  settings,
  updateSettings,
}) => {
  const actuators = useIntifaceStore((s) =>
    Object.values(s.connections)
      .flatMap((connection) => {
        if (connection.state.state === "connected") {
          return Object.values(connection.state.devices).flatMap((device) =>
            device.actuactors.map((actuator, index) => ({
              actuatorIndex: index,
              actuator: actuator,
              deviceIndex: device.deviceIndex,
              deviceName: device.name,
              connection: connection.def,
            }))
          );
        } else {
          return null;
        }
      })
      .filter(notNull)
  );

  const selected = actuators.find(
    (it) =>
      it.connection.connectionId === settings?.value?.connectionId &&
      it.deviceIndex === settings?.value?.deviceIndex &&
      it.actuatorIndex === settings?.value?.actuatorIndex
  );

  const updateValue = (s: (typeof actuators)[number] | null) => {
    if (s === null) {
      updateSettings({
        value: null,
      });
    } else {
      updateSettings({
        value: {
          actuatorIndex: s.actuatorIndex,
          connectionId: s.connection.connectionId,
          deviceIndex: s.deviceIndex,
        },
      });
    }
  };

  return (
    <div>
      <Select
        options={actuators}
        allowUnselect={false}
        selected={selected ?? null}
        renderOption={(s) => (
          <>
            {" "}
            {s.deviceName}::{s.actuator.actuatorType}
          </>
        )}
        onSelect={updateValue}
      />
    </div>
  );
};

export const intifaceAdapter: OutputAdapterDef<number, IntifaceAdapterSettings> = {
  id: "intifaceOutput",
  getType: (settings, beadi) => {
    if (settings?.value != null) {
      const connection = useIntifaceStore.getStateWith(beadi).connections[settings.value.connectionId]?.state;
      if (connection != null) {
        if (connection.state === "connected") {
          const device = connection.devices[settings.value.deviceIndex];
          if (device != null) {
            const actuator = device.actuactors[settings.value.actuatorIndex];
            if (actuator.actuatorKind === "scalar") {
              return "number";
            }
            if (actuator.actuatorKind === "linear") {
              //TODO Allow multiple outputs from an adapter, we need another scalar speed
              return "number";
            }
            if (actuator.actuatorKind === "rotate") {
              //TODO Allow multiple outputs from an adapter, we need a clockwise bool additionally
              return "number";
            }
          }
        }
      }
    }
    return undefined;
  },
  pushData: (_nodeId, data, settings, beadi) => {
    if (settings?.value != null) {
      const connection = useIntifaceStore.getStateWith(beadi).connections[settings.value.connectionId]?.state;
      if (connection != null) {
        if (connection.state === "connected") {
          const device = connection.devices[settings.value.deviceIndex];
          if (device != null) {
            //TODO These events should be batched
            const actuator = device.actuactors[settings.value.actuatorIndex];
            if (actuator.actuatorKind === "scalar") {
              actuator.actuate(data);
            }
          }
        }
      }
    }
  },
  label: "Intiface",
  settingsEditor: IntifaceSettingsEditor,
};
