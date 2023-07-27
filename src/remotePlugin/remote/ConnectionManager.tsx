import { FunctionComponent, useState } from "react";
import { useRemoteStateStore, useRemoteStore } from "./store";
import { TextInput } from "../../components/input/TextInput";
import { Button } from "../../components/input/Button";
import { useInterfaceDisplayStore } from "../interface/stores";

type RemoteConnectionDisplayProps = {
  remoteConnectionId: string;
};
const RemoteConnectionDisplay: FunctionComponent<RemoteConnectionDisplayProps> = ({ remoteConnectionId }) => {
  const connectionState = useRemoteStateStore((s) => s.remotes[remoteConnectionId]);
  const removeConnection = useRemoteStore((s) => s.removeConnection);

  const addRemoteInterface = useInterfaceDisplayStore((s) => s.addRemoteInterface);

  const openRemoteInterface = (interfaceId: string) => {
    addRemoteInterface(interfaceId, {
      remoteId: remoteConnectionId,
    });
  };

  const state = connectionState.state;
  return (
    <div>
      Connection to {connectionState.definition.code}
      <Button onClick={() => removeConnection(remoteConnectionId)}>X</Button>
      <code>{JSON.stringify(state)}</code>
      {state.state === "connected" && (
        <>
          <ul>
            {Object.entries(state.interfaces).map(([key, iface]) => (
              <li key={key}>
                {iface.name}
                <Button onClick={() => openRemoteInterface(iface.interfaceId)}></Button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
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

  return (
    <div>
      <ul>
        {remoteStore.map((s) => (
          <li key={s.definition.remoteConnectionId}>
            <RemoteConnectionDisplay remoteConnectionId={s.definition.remoteConnectionId}></RemoteConnectionDisplay>
          </li>
        ))}
      </ul>
      <RemoteConnectionForm></RemoteConnectionForm>
    </div>
  );
};
