import { BsController } from "react-icons/bs";
import { Tab } from "../components/Settings";
import { MdSettingsRemote } from "react-icons/md";
import { FunctionComponent } from "react";
import { Typo } from "../components/Typo";
import { Button } from "../components/input/Button";
import { InterfaceList } from "./interface/InterfaceList";
import { useInterfaceDisplayStore, useInterfaceFileStore } from "./interface/stores";
import { ConnectionManager } from "./remote/ConnectionManager";
import { PublishManager } from "./publish/PublishManager";

const RemoteSettingsTab: FunctionComponent<{}> = () => {
  const addRemoteInterface = useInterfaceDisplayStore((s) => s.addRemoteInterface);
  const addLocalInterface = useInterfaceFileStore((s) => s.addInterface);

  return (
    <>
      <div>
        <PublishManager></PublishManager>
      </div>
      <div className="flex flex-col w-full gap-2 p-2">
        <InterfaceList></InterfaceList>
        <Button onClick={() => addLocalInterface()}>Add Local Interface</Button>
        <Button onClick={() => addRemoteInterface({ code: "debug-session-id" })}>Add Remote Interface</Button>
      </div>
      <div>
        <ConnectionManager></ConnectionManager>
      </div>
    </>
  );
};

export const remoteSettingsTab: Tab = {
  id: "remote",
  icon: <MdSettingsRemote className="w-full h-full"></MdSettingsRemote>,
  label: "Remote",
  tab: RemoteSettingsTab,
};
