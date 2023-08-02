import { ComponentType, FunctionComponent, useState } from "react";
import { BsController, BsFile, BsGear } from "react-icons/bs";
import { BottomBar } from "./BottomBar";
import { FilesTab } from "./FilesTab";
import { ProgramInterface } from "./ProgramInterface";
import { SettingsTab } from "./SettingsTab";
import { MobileWelcome } from "./Welcome";
import { settingsTabs } from "../../registries";

// const TABS = [
//   {
//     label: "Interface",
//     icon: <BsController className="w-full h-full"></BsController>,
//   },
//   {
//     label: "Files",
//     icon: <BsFile className="w-full h-full"></BsFile>,
//   },
//   {
//     label: "Settings",
//     icon: <BsGear className="w-full h-full"></BsGear>,
//   },
// ];

// const InterfaceTab: FunctionComponent<{}> = () => {
//   return (
//     <>
//       <ProgramInterface></ProgramInterface>
//     </>
//   );
// };
// const TAB_COMPONENTS: Record<string, ComponentType<{}>> = {
//   Interface: InterfaceTab,
//   Files: FilesTab,
//   Settings: SettingsTab,
// };

export const MobileView: FunctionComponent<{}> = () => {
  const [tabId, setTabId] = useState(Object.keys(settingsTabs)[0]);

  const tabDef = settingsTabs[tabId];
  const Content = tabDef.tab;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="overflow-y-auto grow">
        <Content></Content>
      </div>
      <BottomBar tabs={Object.values(settingsTabs)} onTabChange={(tab) => setTabId(tab)}></BottomBar>
    </div>
  );
};
