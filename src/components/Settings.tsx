import { FunctionComponent } from "react";
import { ButtplugSettings } from "./settings/ButtplugSettings";

export const Settings: FunctionComponent<{}> = ({}) => {
  return (
    <div className="bg-slate-900 w-96 shadow-sm flex flex-col overflow-x-hidden">
      <ButtplugSettings></ButtplugSettings>
    </div>
  );
};
