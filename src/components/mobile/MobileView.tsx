import { FunctionComponent } from "react";
import { BottomBar } from "./BottomBar";
import { settingsTabs } from "../../registries";
import { Outlet } from "react-router-dom";

export const MobileView: FunctionComponent<{}> = () => {
  // const [tabId, setTabId] = useState(Object.keys(settingsTabs)[0]);

  // const tabDef = settingsTabs[tabId];
  // const Content = tabDef.tab;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="overflow-y-auto grow">
        <Outlet />
      </div>
      <BottomBar tabs={Object.values(settingsTabs)}></BottomBar>
    </div>
  );
};
