import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
// import { ButtplugInstance } from "../../adapters/store";
import { ButtplugClientConfig, useButtplugStore } from "../../adapters/store";
import { Button } from "../input/Button";
import { TextInput } from "../input/TextInput";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import clsx from "clsx";
import { Typo } from "../Typo";
import { BsFillTrashFill } from "react-icons/bs";

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

const ButtplugSettingsInner: FunctionComponent<{}> = () => {
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
  console.log("NAVI", bluetooth, (navigator as any).bluetooth);

  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <Typo className="text-lg font-bold text-white">Servers</Typo>
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
              <Button
                className="mx-2"
                onClick={() => deleteClient(it.config.id)}
                icon={<BsFillTrashFill></BsFillTrashFill>}
              ></Button>
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
            {it.state.error && (
              <p className="text-sm text-red-400">{it.state.error}</p>
            )}
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

      <Typo className="text-lg font-bold text-white">Add Server</Typo>

      <AddButtplugClientForm onAdd={addClient}></AddButtplugClientForm>
      <Button onClick={connectEmbedded} disabled={!bluetooth}>
        Start embedded server
      </Button>
      {!bluetooth && (
        <span className="text-slate-500">
          Embedded Servers / Direction Connection is currently unavailable, due
          to upstream API changes in{" "}
          <a
            className="underline"
            href="https://github.com/buttplugio/buttplug-js"
            target="_blank"
          >
            buttplug-js
          </a>
           - it may or may not return.
        </span>
      )}
      <Typo>How to connect</Typo>
      <span>
        To connect you need a running{" "}
        <a className="underline" href="https://intiface.com/central/">
          Intiface Central
        </a>{" "}
        server. It can run on your PC or Smartphone and will take care of the
        Bluetooth connection to your toy. Depending on your exact circumstances,
        you might need to enable "Device WebSocket Server" in its settings. Note
        that Intiface is a third-party application, so please file support
        tickets with them.
      </span>
    </div>
  );
};

export const ButtplugSettings: FunctionComponent<{}> = () => {
  // const instance = useButtplugStore((it) => it.instance);
  // if (instance == null) {
  //   return <p>Buttplug is loading...</p>;
  // } else {
  //   return <ButtplugSettingsInner instance={instance}></ButtplugSettingsInner>;
  // }
  return <ButtplugSettingsInner></ButtplugSettingsInner>;
};
