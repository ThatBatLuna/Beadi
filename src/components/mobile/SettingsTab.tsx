import { FunctionComponent } from "react";
import { Button } from "../input/Button";
import { ButtplugSettings } from "../settings/ButtplugSettings";
import { Typo } from "../Typo";

export const SettingsTab: FunctionComponent<{}> = () => {
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
        <Button>Open Desktop View</Button>
      </div>
    </div>
  );
};
