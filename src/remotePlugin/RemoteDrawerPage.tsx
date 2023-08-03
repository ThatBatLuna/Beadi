import { Tab } from "../components/Settings";
import { MdSettingsRemote } from "react-icons/md";
import { FunctionComponent } from "react";
import { Button } from "../components/input/Button";
import { InterfaceList } from "./interface/InterfaceList";
import { useInterfaceFileStore } from "./interface/stores";
import { ConnectionManager } from "./remote/ConnectionManager";
import { PublishManager } from "./publish/PublishManager";
import { Typo } from "../components/Typo";
import { useRemoteStateStore } from "./remote/store";
import _ from "lodash";
import { usePublishStateStore } from "./publish/store";
import clsx from "clsx";

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
      <MdSettingsRemote className="w-full h-full"></MdSettingsRemote>
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
