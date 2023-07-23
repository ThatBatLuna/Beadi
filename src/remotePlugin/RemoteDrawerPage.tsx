import { BsController } from "react-icons/bs";
import { Tab } from "../components/Settings";
import { MdSettingsRemote } from "react-icons/md";
import { FunctionComponent } from "react";
import { Typo } from "../components/Typo";
import { RemoteInterfaceBuilder } from "./builder";

const Builder: FunctionComponent<{}> = () => {
  return <RemoteInterfaceBuilder></RemoteInterfaceBuilder>;
};

const RemoteSettingsTab: FunctionComponent<{}> = () => {
  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <Typo>Interface</Typo>
      <Builder></Builder>
    </div>
  );
};

export const remoteSettingsTab: Tab = {
  id: "remote",
  icon: <MdSettingsRemote className="w-full h-full"></MdSettingsRemote>,
  label: "Remote",
  tab: RemoteSettingsTab,
};
