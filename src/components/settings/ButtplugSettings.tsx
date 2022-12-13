import { FormEvent, FunctionComponent, useCallback, useState } from "react";
import { ButtplugInstance } from "../../adapters/store";
import { ButtplugClientConfig, useButtplugStore } from "../../adapters/store";

type AddButtplugClientFormProps = {
  onAdd: (config: ButtplugClientConfig) => void;
};
const AddButtplugClientForm: FunctionComponent<AddButtplugClientFormProps> = ({
  onAdd,
}) => {
  const [name, setName] = useState("L");
  const [connection, setConnection] = useState("localhost:12345");

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onAdd({
        connection: connection,
        name: name,
        id: connection,
      });
      setName("");
      setConnection("");
    },
    [name, connection, onAdd]
  );

  return (
    <form onSubmit={onSubmit}>
      <input
        onChange={(e) => setName(e.target.value)}
        placeholder="name"
        value={name}
      />
      <input
        onChange={(e) => setConnection(e.target.value)}
        placeholder="connection"
        value={connection}
      />
      <button type="submit">Add Remote Server</button>
    </form>
  );
};

const ButtplugSettingsInner: FunctionComponent<{
  instance: ButtplugInstance;
}> = ({ instance }) => {
  const clients = useButtplugStore((it) => it.clients);
  const addClient = useButtplugStore((it) => it.addClient);

  const connectEmbedded = useCallback(() => {
    addClient({
      connection: "embedded",
      id: "embedded",
      name: "Embedded",
    });
  }, [addClient]);

  return (
    <div className="w-full">
      <ul className="w-full overflow-x-hidden">
        {Object.values(clients).map((it) => (
          <li key={it.config.id} className="flex flex-col w-full">
            <div>{JSON.stringify(it.config)}</div>
            <div>{JSON.stringify(it.state)}</div>
            <div>
              {it.state.connected ? (
                <button onClick={it.actions.disconnect}>Disconnect</button>
              ) : (
                <button onClick={it.actions.connect}>Connect</button>
              )}
              {it.state.scanning ? (
                <button onClick={it.actions.stopScan}>Stop Scan</button>
              ) : (
                <button onClick={it.actions.scan}>Scan</button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <button onClick={connectEmbedded}>Start embedded server</button>
      <AddButtplugClientForm onAdd={addClient}></AddButtplugClientForm>
    </div>
  );
};

export const ButtplugSettings: FunctionComponent<{}> = ({}) => {
  const instance = useButtplugStore((it) => it.instance);
  if (instance == null) {
    return <p>Buttplug is loading...</p>;
  } else {
    return <ButtplugSettingsInner instance={instance}></ButtplugSettingsInner>;
  }
};
