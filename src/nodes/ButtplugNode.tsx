import { FunctionComponent, useEffect, useRef, useState } from "react";
import { ButtplugClientHandle, useButtplugStore } from "../adapters/store";
import NodeLine from "../components/node/NodeLine";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData } from "../engine/store";
import { categories } from "./category";

const ButtplugNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const value = useCommittedData<number>(id, "value");

  const [client, setClient] = useState<string | null>(null);
  const [device, setDevice] = useState<number | null>(-1);

  const clients = useButtplugStore((store) => store.clients);
  const devices = useButtplugStore((store) =>
    client === null ? null : store.clients[client]?.state.devices
  );
  const deviceHandle = useButtplugStore((store) =>
    client === null || device === null
      ? null
      : store.clients[client]?.devices[device]
  );

  console.log("Value: ", value);
  console.log("Deviceds: ", devices);
  console.log("Deviceds: ", client);

  useEffect(() => {
    deviceHandle?.vibrate(value);
  }, [value, device]);

  return (
    <div>
      <select onChange={(e) => setClient(e.target.value)} className="bg-black">
        <option value={""}></option>
        {Object.entries(clients).map(([key, value]) => (
          <option key={key} value={key}>
            {value.config.name}
          </option>
        ))}
      </select>
      {devices !== null && (
        <select
          onChange={(e) => setDevice(parseInt(e.target.value))}
          className="bg-black"
        >
          <option value={-1}></option>
          {devices.map((value, key) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
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
    },
  ],
  executor: ([v], { commit }) => {
    commit("value", v);
    return [];
  },
};
