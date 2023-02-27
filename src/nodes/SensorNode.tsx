import { ButtplugClientDevice, RawSubscribeCmd, SensorType } from "buttplug";
import _ from "lodash";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useButtplugStore } from "../adapters/store";
import { Checkbox } from "../components/input/Checkbox";
import { Select } from "../components/input/Select";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import {
  useCommitData,
  useCommittedData,
  useInputHandleData,
} from "../engine/store";
import { BUTTON_NODE_TYPE } from "./ButtonNode";
import { categories } from "./category";

type DeviceSelection = {
  client: string;
  device: number;
  label: string;
  deviceType: "sensor";
  index: number;
};

function useSensorValue(
  deviceHandle: ButtplugClientDevice | null,
  device: number | null
): number {
  const [reading, setReading] = useState(0);
  const [progress, setProgress] = useState(false);

  if (!progress) {
    if (deviceHandle !== null && device !== null) {
      setProgress(true);
      deviceHandle
        .sensorRead(device, SensorType.Battery)
        .then((it) => {
          setReading(it[0]);
          console.log("Result: ", it);
        })
        .finally(() => {
          setProgress(false);
        });
    }
  }

  return reading;
}

export const SensorNodeInterface: FunctionComponent<NodeHeaderProps> = ({
  id,
}) => {
  const updateValue = useCommitData<number>(id, "value");
  const [enabled, setEnabled] = useInputHandleData<boolean>(id, "enable");

  const [deviceH, setDevice] = useInputHandleData<DeviceSelection | null>(
    id,
    "device"
  );
  const device = deviceH || null;

  // const instance = useButtplugStore((store) => store.instance);
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
        const sensorSubscriptions =
          client.devices[i].messageAttributes.SensorSubscribeCmd;
        const sensorReadings =
          client.devices[i].messageAttributes.SensorReadCmd;
        console.log("AAA", sensorSubscriptions, sensorReadings);
        const common = {
          client: client.config.id,
          device: i,
          label: single
            ? client.devices[i].name
            : `${client.config.name}:${client.devices[i].name}`,
        };

        return [
          ...(sensorReadings === undefined
            ? []
            : new Array(sensorReadings.length).fill(undefined).map((_, i) => ({
                deviceType: "sensor" as const,
                index: i,
                ...common,
                label: `${common.label} ${sensorReadings[i].FeatureDescriptor} ${i}`,
              }))),
        ];
      })
    );
  }, [clients]);

  let value = useSensorValue(deviceHandle, device?.index ?? null);
  updateValue(value);

  if (allDevices.length === 0) {
    return (
      <div className="px-4">
        It looks like you don't have any devices connected. Head over to the
        Settings to connect some.
      </div>
    );
  }

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

export const SENSOR_NODE_TYPE = "sensor";

export const sensorNodeDef: NodeDef = {
  label: "Sensor",
  category: categories["display"],
  type: SENSOR_NODE_TYPE,
  header: SensorNodeInterface,
  mobileView: SensorNodeInterface,
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
  ],
  inputs: [
    {
      id: "device",
      label: "Device",
      type: "object",
      default: null,
      hidden: true,
    },
  ],
  executor: ([v], { committed }) => {
    return [committed["value"]];
  },
};
