import { FunctionComponent } from "react";
import { useIntifaceStore } from "../storage";
import { Button } from "@beadi/components";
import { IntifaceConnection } from "../intifaceStore";

type IntifaceConnectionListEntryProps = {
  connection: IntifaceConnection;
};
export const IntifaceConnectionListEntry: FunctionComponent<IntifaceConnectionListEntryProps> = ({ connection }) => {
  const removeConnection = useIntifaceStore((s) => s.removeConnection);

  const state = connection.state;
  return (
    <li>
      <div>{connection.state.state}</div>
      <code className="break-all">{JSON.stringify(connection.def)}</code>
      <Button onClick={() => removeConnection(connection.def.connectionId)}>X</Button>

      {state.state === "disconnected" && <Button onClick={() => state.connect()}>Connect</Button>}
      {state.state === "connected" && !state.scanning && <Button onClick={() => state.startScan()}>Scan</Button>}
      {state.state === "connected" && state.scanning && <Button onClick={() => state.stopScan()}>Stop Scan</Button>}
      {state.state !== "disconnected" && <Button onClick={() => state.disconnect()}>Disconnect</Button>}
      {state.state === "connected" && state.scanning && <div>Scanning</div>}
      {state.state === "connected" && <div>{JSON.stringify(state.devices)}</div>}
    </li>
  );
};

type IntifaceConnectionListProps = {};
export const IntifaceConnectionList: FunctionComponent<IntifaceConnectionListProps> = ({}) => {
  const connections = useIntifaceStore((s) => s.connections);

  return (
    <ul>
      {Object.values(connections).map((it) => (
        <IntifaceConnectionListEntry connection={it} key={it.def.connectionId}></IntifaceConnectionListEntry>
      ))}
    </ul>
  );
};
