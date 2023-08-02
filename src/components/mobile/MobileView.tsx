import { FunctionComponent, useState } from "react";
import { BottomBar } from "./BottomBar";
import { settingsTabs } from "../../registries";

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
