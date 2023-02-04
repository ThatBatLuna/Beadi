import { ComponentType, FunctionComponent, useState } from "react";
import { BsController, BsFile, BsGear } from "react-icons/bs";
import { BottomBar } from "./BottomBar";
import { FilesTab } from "./FilesTab";
import { ProgramInterface } from "./ProgramInterface";
import { SettingsTab } from "./SettingsTab";
import { MobileWelcome } from "./Welcome";

const TABS = [
  {
    label: "Interface",
    icon: <BsController className="w-full h-full"></BsController>,
  },
  {
    label: "Files",
    icon: <BsFile className="w-full h-full"></BsFile>,
  },
  {
    label: "Settings",
    icon: <BsGear className="w-full h-full"></BsGear>,
  },
];

const InterfaceTab: FunctionComponent<{}> = () => {
  return (
    <>
      <ProgramInterface></ProgramInterface>
    </>
  );
};
const TAB_COMPONENTS: Record<string, ComponentType<{}>> = {
  Interface: InterfaceTab,
  Files: FilesTab,
  Settings: SettingsTab,
};

export const MobileView: FunctionComponent<{}> = () => {
  const [tab, setTab] = useState(TABS[0]);

  const Content = TAB_COMPONENTS[tab.label];

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="overflow-y-auto grow">
        <Content></Content>
      </div>
      <BottomBar
        tabs={TABS}
        onTabChange={(tab) => setTab(TABS[tab])}
      ></BottomBar>
    </div>
  );
};
