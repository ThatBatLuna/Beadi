import { FunctionComponent, useState } from "react";
import { MdDelete, MdWifi, MdWifiOff } from "react-icons/md";
import { CollapsibleCard, Button, Typo, TextInput } from "@beadi/components";
import { useRemoteStateStore, useRemoteStore } from "../storage";

type RemoteConnectionDisplayProps = {
  remoteConnectionId: string;
};
const RemoteConnectionDisplay: FunctionComponent<RemoteConnectionDisplayProps> = ({ remoteConnectionId }) => {
  const connectionState = useRemoteStateStore((s) => s.remotes[remoteConnectionId]);
  const removeConnection = useRemoteStore((s) => s.removeConnection);

  const state = connectionState.state;
  return (
    <CollapsibleCard
      header={
        <>
          {state.state === "connected" && <MdWifi className="w-6 h-6 m-2" />}
          {state.state === "connecting" && <MdWifi className="w-6 h-6 m-2 animate-pulse" />}
          {state.state === "disconnected" && <MdWifiOff className="w-6 h-6 m-2" />}
          {state.state === "closing" && <MdWifiOff className="w-6 h-6 m-2 animate-pulse" />}
          <div>{connectionState.definition.code}</div>
          <div className="grow"></div>
          <Button onClick={() => removeConnection(remoteConnectionId)} icon={<MdDelete />}></Button>
        </>
      }
    >
      {state.state === "connected" && (
        <>
          <Typo>Interfaces</Typo>
          <ul>
            {Object.entries(state.interfaces).map(([key, iface]) => (
              <li key={key}>{iface.name}</li>
            ))}
          </ul>
          <Typo>Values</Typo>
          <ul>
            {Object.entries(state.values).map(([key, value]) => (
              <li key={key}>{value.valueId}</li>
            ))}
          </ul>
        </>
      )}
    </CollapsibleCard>
  );
};

type RemoteConnectionFormProps = {};
export const RemoteConnectionForm: FunctionComponent<RemoteConnectionFormProps> = () => {
  const addConnection = useRemoteStore((s) => s.addConnection);
  const [code, setCode] = useState("");

  const connect = () => {
    addConnection({
      code: code.trim(),
    });
    setCode("");
  };

  return (
    <form onSubmit={connect} className="flex flex-row">
      <div className="grow mr-2">
        <TextInput onChange={setCode} value={code} label="Code" id="code"></TextInput>
      </div>
      <Button type="submit" disabled={code.trim() === ""}>
        Connect
      </Button>
    </form>
  );
};

type ConnectionManagerProps = {};
export const ConnectionManager: FunctionComponent<ConnectionManagerProps> = () => {
  const remoteStore = useRemoteStateStore((s) => Object.values(s.remotes));

  return (
    <div>
      <ul>
        {remoteStore.map((s) => (
          <li key={s.definition.remoteConnectionId} className="my-2">
            <RemoteConnectionDisplay remoteConnectionId={s.definition.remoteConnectionId}></RemoteConnectionDisplay>
          </li>
        ))}
      </ul>
      <CollapsibleCard
        forceExpanded={remoteStore.length === 0 ? true : undefined}
        header={
          <>
            <div className="font-bold">Add Remote Connection</div>
            <div className="grow"></div>
          </>
        }
      >
        <RemoteConnectionForm></RemoteConnectionForm>
      </CollapsibleCard>
    </div>
  );
};
