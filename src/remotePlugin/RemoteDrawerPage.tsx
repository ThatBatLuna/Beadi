import { Tab } from "../components/Settings";
import { MdSettingsRemote } from "react-icons/md";
import { FunctionComponent } from "react";
import { Button } from "../components/input/Button";
import { InterfaceList } from "./interface/InterfaceList";
import { useInterfaceFileStore } from "./interface/stores";
import { ConnectionManager } from "./remote/ConnectionManager";
import { PublishManager } from "./publish/PublishManager";
import { Typo } from "../components/Typo";

const RemoteSettingsTab: FunctionComponent<{}> = () => {
  const addLocalInterface = useInterfaceFileStore((s) => s.addInterface);

  return (
    <>
      <div className="flex flex-col w-full gap-2 p-2">
        <Typo>Publish</Typo>
        <PublishManager></PublishManager>
      </div>
      <div className="flex flex-col w-full gap-2 p-2">
        <Typo>Control</Typo>
        <InterfaceList></InterfaceList>
        <Button onClick={() => addLocalInterface()}>Add Local Interface</Button>
      </div>
      <div className="flex flex-col w-full gap-2 p-2">
        <Typo>Remote Connections</Typo>
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
