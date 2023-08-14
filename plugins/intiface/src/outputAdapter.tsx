import { InputHandleDef, OutputAdapterSettingsEditorProps, notNull, outputAdapterDef } from "@beadi/engine";
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

type IntifaceHandleDefs =
  | {
      value: InputHandleDef & { type: "number" };
      speed: InputHandleDef;
    }
  | {
      value: InputHandleDef & { type: "number" };
      clockwise: InputHandleDef;
    }
  | {
      value: InputHandleDef & { type: "number" };
    };

export const INTIFACE_OUTPUT_ADAPTER_ID = "intifaceOutput";
export const intifaceAdapter = outputAdapterDef({
  id: INTIFACE_OUTPUT_ADAPTER_ID,
  getTypes: (settings, beadi) => {
    if (settings?.value != null) {
      const connection = useIntifaceStore.getStateWith(beadi).connections[settings.value.connectionId]?.state;
      if (connection != null) {
        if (connection.state === "connected") {
          const device = connection.devices[settings.value.deviceIndex];
          if (device != null) {
            const actuator = device.actuactors[settings.value.actuatorIndex];
            if (actuator.actuatorKind === "linear") {
              return {
                value: { type: "number", default: 0.0, min: 0.0, max: 1.0, label: "Value" },
                duration: { type: "number", default: 0.0, min: 0.0, label: "Duration" },
              } as IntifaceHandleDefs;
            }
            if (actuator.actuatorKind === "rotate") {
              return {
                value: { type: "number", default: 0.0, min: 0.0, max: 1.0, label: "Value" },
                clockwise: { type: "boolean", default: true, label: "Clockwise" },
              } as IntifaceHandleDefs;
            }
            if (actuator.actuatorKind === "scalar") {
              return {
                value: { type: "number", default: 0.0, min: 0.0, max: 1.0, label: "Value" },
              } as IntifaceHandleDefs;
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
              actuator.actuate(data.value ?? 0.0);
            } else if (actuator.actuatorKind === "linear") {
              actuator.actuate(data.value ?? 0.0, (data as any).duration ?? 1.0);
            } else if (actuator.actuatorKind === "rotate") {
              actuator.actuate(data.value ?? 0.0, (data as any).clockwise ?? false);
            }
          }
        }
      }
    }
  },
  label: "Intiface",
  settingsEditor: IntifaceSettingsEditor,
});
