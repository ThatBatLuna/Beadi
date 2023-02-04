import { FunctionComponent } from "react";
import { ProgramInterface } from "../mobile/ProgramInterface";
import { Typo } from "../Typo";

export const MobileInterfaceTab: FunctionComponent<{}> = () => {
  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <Typo>Mobile Interface</Typo>
      <p className="text-slate-500">
        If you open this Beadi file on your mobile phone - this is the interface
        that you will get.
      </p>
      <ProgramInterface></ProgramInterface>
    </div>
  );
};
