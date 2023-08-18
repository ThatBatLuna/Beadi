import { MdConnectWithoutContact } from "react-icons/md";
import { FunctionComponent } from "react";
import { InterfaceList } from "./interface/InterfaceList";
import { ConnectionManager } from "./remote/ConnectionManager";
import { PublishManager } from "./publish/PublishManager";
import _ from "lodash";
import clsx from "clsx";
import { Typo, Button } from "@beadi/components";
import { Tab } from "@beadi/engine";
import { useInterfaceFileStore, usePublishStateStore, useRemoteStateStore } from "./storage";

const RemoteSettingsTab: FunctionComponent<{}> = () => {
  const addLocalInterface = useInterfaceFileStore((s) => s.addInterface);

  return (
    <>
      <div className="flex flex-col w-full gap-2 p-2">
        <Typo>Control</Typo>
        <InterfaceList></InterfaceList>
        <Button onClick={() => addLocalInterface()}>Add Local Interface</Button>
      </div>
      <div className="flex flex-col w-full gap-2 p-2">
        <Typo>Remote Connections</Typo>
        <ConnectionManager></ConnectionManager>
      </div>
      <div className="flex flex-col w-full gap-2 p-2">
        <Typo>Open to Controllers</Typo>
        <PublishManager></PublishManager>
      </div>
    </>
  );
};

type RemoteSettingsIconProps = {};
export const RemoteSettingsIcon: FunctionComponent<RemoteSettingsIconProps> = () => {
  const publishState = usePublishStateStore((s) => s.state.state);
  const remotes = useRemoteStateStore((s) => _.values(s.remotes).filter((s) => s.state.state === "connected").length);

  return (
    <div className="w-full h-full relative">
      {/* <MdSettingsRemote className="w-full h-full"></MdSettingsRemote> */}
      <MdConnectWithoutContact className="w-full h-full"></MdConnectWithoutContact>
      {publishState !== "disconnected" && (
        <div
          className={clsx("rounded-full bg-red-500 absolute top-0 left-0 w-2 h-2", { "animate-pulse": publishState === "connecting" })}
        ></div>
      )}
      {remotes > 0 && (
        <div className="rounded-full bg-green-500 absolute top-[-8px] right-[-5px] text-xs w-4 h-4 text-center align-baseline">
          {remotes}
        </div>
      )}
    </div>
  );
};

export const remoteSettingsTab: Tab = {
  id: "remote",
  icon: <RemoteSettingsIcon></RemoteSettingsIcon>,
  label: "Remote",
  tab: <RemoteSettingsTab />,
};
