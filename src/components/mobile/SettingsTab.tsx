import { FunctionComponent } from "react";
import { useGlobalSettings } from "../../App";
import { Button } from "../input/Button";
import { ButtplugSettings } from "../settings/ButtplugSettings";
import { Typo } from "../Typo";

export const SettingsTab: FunctionComponent<{}> = () => {
  const open = useGlobalSettings((s) => s.setMobileView);
  return (
    <div className="flex flex-col py-2">
      <Typo variant="h0" className="text-center">
        Connection Settings
      </Typo>
      <ButtplugSettings></ButtplugSettings>
      <Typo variant="h0" className="text-center">
        Desktop Mode
      </Typo>
      <div className="flex flex-col p-2">
        <Button onClick={() => open(false)}>Open Desktop View</Button>
      </div>
    </div>
  );
};
