import { FunctionComponent, useState } from "react";
import { useRemoteStateStore, useRemoteStore } from "./store";
import { TextInput } from "../../components/input/TextInput";
import { Button } from "../../components/input/Button";
import { MdDelete, MdWifi, MdWifiOff } from "react-icons/md";
import { CollapsibleCard } from "../../components/CollapsibleCard";
import { Typo } from "../../components/Typo";

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
    <div>
      <TextInput onChange={setCode} value={code} label="Code" id="code"></TextInput>
      <Button onClick={connect} disabled={code.trim() === ""}>
        Connect
      </Button>
    </div>
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
      <RemoteConnectionForm></RemoteConnectionForm>
    </div>
  );
};
