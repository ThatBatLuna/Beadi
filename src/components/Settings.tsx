import { FunctionComponent } from "react";
import { ButtplugSettings } from "./settings/ButtplugSettings";

export const Settings: FunctionComponent<{}> = ({}) => {
  return (
    <div className="bg-slate-800 w-80">
      <ButtplugSettings></ButtplugSettings>
    </div>
  );
};
