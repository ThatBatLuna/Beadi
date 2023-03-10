import _ from "lodash";
import { FunctionComponent, useEffect, useMemo } from "react";
import { useButtplugStore } from "../adapters/store";
import { Checkbox } from "../components/input/Checkbox";
import { Select } from "../components/input/Select";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData, useInputHandleData } from "../engine/store";
import { categories } from "./category";

type DeviceSelection = {
  client: string;
  device: number;
  label: string;
  deviceType: "rotate" | "linear" | "vibrate";
  index: number;
};

const ButtplugNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const value = useCommittedData<number>(id, "value");
  const [enabled, setEnabled] = useInputHandleData<boolean>(id, "enable");

  const [deviceH, setDevice] = useInputHandleData<DeviceSelection | null>(
    id,
    "device"
  );
  const device = deviceH || null;

  const instance = useButtplugStore((store) => store.instance);
  const clients = useButtplugStore((store) => store.clients);
  const deviceHandle = useButtplugStore((store) => {
    if (device === null) {
      return null;
    } else {
      const handle =
        store.clients[device.client]?.devices[device.device] || null;
      if (handle === null) {
        return null;
      }
      return handle;
    }
  });
  const connected = useButtplugStore((store) => {
    if (device !== null) {
      if (store.clients[device.client]?.state.connected) {
        if (
          store.clients[device.client]?.devices[device.device] !== undefined
        ) {
          return true;
        }
      }
    }
    return false;
  });

  const allDevices: DeviceSelection[] = useMemo(() => {
    const single = Object.values(clients).length === 1;
    return _.flatMap(clients, (client) =>
      client.state.devices.flatMap((device, i) => {
        const vibrators = client.devices[i].messageAttributes(0);
        const linears = client.devices[i].messageAttributes(1);
        const rotators = client.devices[i].messageAttributes(2);
        const common = {
          client: client.config.id,
          device: i,
          label: single
            ? client.devices[i].Name
            : `${client.config.name}:${client.devices[i].Name}`,
        };

        console.log(vibrators, linears, rotators);
        return [
          ...(vibrators === undefined
            ? []
            : new Array(vibrators.featureCount).fill(undefined).map((_, i) => ({
                deviceType: "vibrate" as const,
                index: i,
                ...common,
                label: `${common.label} - Vibrator ${i}`,
              }))),
          ...(linears === undefined
            ? []
            : new Array(linears.featureCount).fill(undefined).map((_, i) => ({
                deviceType: "linear" as const,
                index: i,
                ...common,
                label: `${common.label} - Linear ${i}`,
              }))),
          ...(rotators === undefined
            ? []
            : new Array(rotators.featureCount).fill(undefined).map((_, i) => ({
                deviceType: "rotate" as const,
                index: i,
                ...common,
                label: `${common.label} - Rotator ${i}`,
              }))),
        ];
      })
    );
  }, [clients]);

  useEffect(() => {
    if (connected && deviceHandle !== null && device !== null) {
      let actualValue = Math.max(0, Math.min(value));
      if (isNaN(actualValue) || !enabled) {
        actualValue = 0.0;
      }
      if (device.deviceType === "vibrate") {
        deviceHandle.vibrate([
          new instance.VibrationCmd(device.index, actualValue),
        ]);
      }
      if (device.deviceType === "rotate") {
        const TODO_CLOCKWISE = true;
        deviceHandle.rotate(
          [new instance.RotationCmd(device.index, actualValue, TODO_CLOCKWISE)],
          undefined
        ); //TODO Counterclockwise rotation with negative numbers
      }
      if (device.deviceType === "linear") {
        const TODO_DURATION = 500.0;
        deviceHandle.linear(
          [new instance.VectorCmd(device.index, TODO_DURATION, actualValue)],
          undefined
        );
      }
    }
  }, [value, device, deviceHandle, connected, instance, enabled]);

  return (
    <div className="flex flex-col gap-1 px-4">
      <Checkbox
        checked={enabled}
        onChange={setEnabled}
        label="Enabled"
      ></Checkbox>
      <Select
        options={allDevices}
        onSelect={setDevice}
        renderOption={(it) => it.label}
        selected={device}
      ></Select>
      {!connected && (
        <span className="text-sm">{device?.label} Disconnected</span>
      )}
    </div>
  );
};

export const buttplugNodeDef: NodeDef = {
  label: "Buttplug",
  category: categories["display"],
  type: "buttplug",
  header: ButtplugNode,
  outputs: [],
  inputs: [
    {
      terminal: true,
      id: "value",
      label: "Value",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
    {
      id: "device",
      label: "Device",
      type: "object",
      default: null,
      hidden: true,
    },
    {
      id: "enable",
      label: "Enable",
      type: "boolean",
      default: true,
      hidden: true,
    },
  ],
  executor: ([v], { commit }) => {
    commit("value", v);
    return [];
  },
};
