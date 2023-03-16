import { FunctionComponent } from "react";
import { useGlobalSettings } from "../../App";
import { Button } from "../input/Button";
import { ProgramInterface } from "../mobile/ProgramInterface";
import { Typo } from "../Typo";

export const MobileInterfaceTab: FunctionComponent<{}> = () => {
  const open = useGlobalSettings((s) => s.setMobileView);
  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <Typo>Mobile Interface</Typo>
      <Button onClick={() => open(true)}>Open</Button>
      <p className="text-slate-500">
        If you open this Beadi file on your mobile phone - this is the interface
        that you will get.
      </p>
      <ProgramInterface></ProgramInterface>
    </div>
  );
};
