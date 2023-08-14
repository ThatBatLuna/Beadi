import { Typo } from "@beadi/components";
import { Tab } from "@beadi/engine";
import { FunctionComponent } from "react";
import { MdSettingsRemote } from "react-icons/md";
import { IntifaceConnectionList } from "./IntifaceConnectionList";
import { IntifaceConnectionForm } from "./IntifaceConnectionForm";

type IntifaceTabProps = {};
export const IntifaceTab: FunctionComponent<IntifaceTabProps> = ({}) => {
  return (
    <div className="p-2 flex flex-col gap-2">
      <Typo>Intiface Connections</Typo>
      <IntifaceConnectionList></IntifaceConnectionList>
      <div className="mt-4">
        <IntifaceConnectionForm></IntifaceConnectionForm>
      </div>
    </div>
  );
};

export const intifaceTab: Tab = {
  icon: <MdSettingsRemote className="w-full h-full"></MdSettingsRemote>,
  id: "intiface",
  label: "Intiface",
  tab: <IntifaceTab></IntifaceTab>,
};
