import { BsController } from "react-icons/bs";
import { Tab } from "../components/Settings";
import { MdSettingsRemote } from "react-icons/md";
import { FunctionComponent } from "react";
import { Typo } from "../components/Typo";
import { RemoteInterfaceBuilder } from "./builder";
import { useInterfaceStore } from "./interface";
import { Button } from "../components/input/Button";

const RemoteSettingsTab: FunctionComponent<{}> = () => {
  const interfaceIds = useInterfaceStore((s) => Object.keys(s.interfaces));
  const addInterface = useInterfaceStore((s) => s.addInterface);

  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <ul>
        {interfaceIds.map((it) => (
          <li key={it}>
            <Typo>Interface {it}</Typo>
            <RemoteInterfaceBuilder interfaceId={it}></RemoteInterfaceBuilder>
          </li>
        ))}
      </ul>
      <Button onClick={() => addInterface("local")}>Add Local Interface</Button>
      <Button onClick={() => addInterface("remote")}>Add Remote Interface</Button>
    </div>
  );
};

export const remoteSettingsTab: Tab = {
  id: "remote",
  icon: <MdSettingsRemote className="w-full h-full"></MdSettingsRemote>,
  label: "Remote",
  tab: RemoteSettingsTab,
};
