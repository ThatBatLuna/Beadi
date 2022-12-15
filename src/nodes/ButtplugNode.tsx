import _ from "lodash";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useButtplugStore } from "../adapters/store";
import { Select } from "../components/input/Select";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData } from "../engine/store";
import { categories } from "./category";

type DeviceSelection = {
  client: string;
  device: number;
  label: string;
};

const ButtplugNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const value = useCommittedData<number>(id, "value");

  const [device, setDevice] = useState<DeviceSelection | null>(null);

  const clients = useButtplugStore((store) => store.clients);
  const deviceHandle = useButtplugStore((store) =>
    device === null
      ? null
      : store.clients[device.client]?.devices[device.device]
  );

  const allDevices: DeviceSelection[] = useMemo(() => {
    const single = Object.values(clients).length === 1;
    return _.flatMap(clients, (client) =>
      client.state.devices.map((device, i) => ({
        client: client.config.id,
        device: i,
        label: single
          ? client.devices[i].Name
          : `${client.config.name}:${client.devices[i].Name}`,
      }))
    );
  }, [clients]);

  console.log("Value: ", value);
  console.log("Value: ", allDevices);

  useEffect(() => {
    const actualValue = Math.max(0, Math.min(value));
    deviceHandle?.vibrate(actualValue);
  }, [value, deviceHandle]);

  return (
    <div className="flex flex-col px-4">
      <Select
        options={allDevices}
        onSelect={setDevice}
        renderOption={(it) => it.label}
        selected={device}
      ></Select>
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
  ],
  executor: ([v], { commit }) => {
    commit("value", v);
    return [];
  },
};
