import { FunctionComponent, useState } from "react";
import { useRemoteStateStore, useRemoteStore } from "./store";
import { TextInput } from "../../components/input/TextInput";
import { Button } from "../../components/input/Button";

type RemoteConnectionDisplayProps = {
  remoteConnectionId: string;
};
export const RemoteConnectionDisplay: FunctionComponent<RemoteConnectionDisplayProps> = ({ remoteConnectionId }) => {
  const connectionState = useRemoteStateStore((s) => s.remotes[remoteConnectionId]);

  return <div>{JSON.stringify(connectionState)}</div>;
};

type RemoteConnectionFormProps = {};
export const RemoteConnectionForm: FunctionComponent<RemoteConnectionFormProps> = ({}) => {
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
export const ConnectionManager: FunctionComponent<ConnectionManagerProps> = ({}) => {
  const remoteStore = useRemoteStateStore((s) => Object.values(s.remotes));

  const removeConnection = useRemoteStore((s) => s.removeConnection);

  return (
    <div>
      <ul>
        {remoteStore.map((s) => (
          <li key={s.definition.remoteConnectionId}>
            Connection to {s.definition.code}
            <Button onClick={() => removeConnection(s.definition.remoteConnectionId)}>X</Button>
            <code>{JSON.stringify(s.state)}</code>
          </li>
        ))}
      </ul>
      <RemoteConnectionForm></RemoteConnectionForm>
    </div>
  );
};
