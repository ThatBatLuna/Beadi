import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { ButtplugInstance } from "../../adapters/store";
import { ButtplugClientConfig, useButtplugStore } from "../../adapters/store";
import { Button } from "../input/Button";
import { TextInput } from "../input/TextInput";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import clsx from "clsx";

type AddButtplugClientFormProps = {
  onAdd: (config: ButtplugClientConfig) => void;
};
const AddButtplugClientForm: FunctionComponent<AddButtplugClientFormProps> = ({
  onAdd,
}) => {
  const [name, setName] = useState("Localhost");
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
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <TextInput
        id="name"
        onChange={(e) => setName(e)}
        label="Name"
        value={name}
      />
      <TextInput
        id="connection"
        onChange={(e) => setConnection(e)}
        label="Connection"
        value={connection}
      />
      <Button type="submit">Add Remote Intiface Server</Button>
    </form>
  );
};

const ButtplugSettingsInner: FunctionComponent<{
  instance: ButtplugInstance;
}> = ({ instance }) => {
  const clients = useButtplugStore((it) => it.clients);
  const addClient = useButtplugStore((it) => it.addClient);
  const deleteClient = useButtplugStore((it) => it.deleteClient);

  const connectEmbedded = useCallback(() => {
    addClient({
      connection: "embedded",
      id: "embedded",
      name: "Embedded",
    });
  }, [addClient]);

  const bluetooth = useMemo(() => {
    return (navigator as any).bluetooth !== undefined;
  }, []);

  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <h1 className="text-lg font-bold text-white">Servers</h1>
      <ul className="w-full my-2 overflow-hidden overflow-x-hidden rounded-md">
        {Object.values(clients).map((it) => (
          <li
            key={it.config.id}
            className="flex flex-col items-stretch w-full gap-2 p-2 text-white bg-primary-700"
          >
            <div className="flex flex-row items-center">
              <div className="grow">
                <h2 className="mb-0 font-bold">{it.config.name}</h2>
                <div>{it.config.connection}</div>
              </div>
              {it.state.connected ? (
                <HiStatusOnline className="w-6 h-6"></HiStatusOnline>
              ) : (
                <HiStatusOffline className="w-6 h-6"></HiStatusOffline>
              )}
              <Button onClick={() => deleteClient(it.config.id)}>Del</Button>
            </div>
            <ul
              className={clsx("bg-primary-900 rounded-md p-2", {
                "animate-pulse": it.state.scanning,
              })}
            >
              {it.state.devices.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
            {it.state.connected ? (
              <Button onClick={it.actions.disconnect}>Disconnect</Button>
            ) : (
              <Button onClick={it.actions.connect}>Connect</Button>
            )}
            {it.state.scanning ? (
              <Button onClick={it.actions.stopScan}>Stop Scan</Button>
            ) : (
              <Button onClick={it.actions.scan}>Scan</Button>
            )}
          </li>
        ))}
      </ul>

      <h1 className="text-lg font-bold text-white">Add Server</h1>

      <AddButtplugClientForm onAdd={addClient}></AddButtplugClientForm>
      <Button onClick={connectEmbedded} disabled={!bluetooth}>
        Start embedded server
      </Button>
      {!bluetooth && (
        <span className="text-slate-500">
          Embedded Servers / Direction Connection requires the Bluetooth browser
          api (available in Chrome). You can still connect to remote servers
          (e.g{" "}
          <a className="underline" href="https://intiface.com/central/">
            Intiface
          </a>
          )
        </span>
      )}
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
