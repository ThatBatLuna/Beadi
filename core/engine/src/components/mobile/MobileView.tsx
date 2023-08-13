import { FunctionComponent } from "react";
import { BottomBar } from "./BottomBar";
import { Outlet } from "react-router-dom";
import { useBeadi } from "../../context";

export const MobileView: FunctionComponent<{}> = () => {
  // const [tabId, setTabId] = useState(Object.keys(settingsTabs)[0]);

  // const tabDef = settingsTabs[tabId];
  // const Content = tabDef.tab;
  const beadi = useBeadi();

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="overflow-y-auto grow">
        <Outlet />
      </div>
      <BottomBar tabs={Object.values(beadi.settingsTabs)}></BottomBar>
    </div>
  );
};
