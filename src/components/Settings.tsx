import clsx from "clsx";
import {
  ComponentType,
  FunctionComponent,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { BsFillPlugFill } from "react-icons/bs";
import { ButtplugSettings } from "./settings/ButtplugSettings";

type Tab = {
  name: string;
  label: string;
  icon: ReactNode;
  tab: ComponentType<{}>;
};

const tabs: Record<string, Tab> = {
  buttplug: {
    name: "buttplug",
    label: "Buttplug",
    icon: <BsFillPlugFill className="w-full h-full"></BsFillPlugFill>,
    tab: ButtplugSettings,
  },
};

export const Settings: FunctionComponent<{}> = ({}) => {
  const [tab, setTab] = useState<string | null>(null);

  const Component = useMemo(() => {
    if (tab == null) {
      return null;
    } else {
      return tabs[tab].tab;
    }
  }, [tab]);

  return (
    <div className="flex flex-row shadow-sm bg-primary-1100">
      <ul className="flex flex-col text-white">
        {Object.entries(tabs).map(([key, value]) => (
          <li key={key} onClick={() => setTab(key)} className="w-6 h-6">
            {value.icon}
          </li>
        ))}
      </ul>
      <div
        className={clsx("transition-all flex flex-col bg-primary-900", {
          "w-96": Component !== null,
          "w-0": Component === null,
        })}
      >
        <div className="flex flex-col w-96">
          {Component && <Component></Component>}
        </div>
      </div>
    </div>
  );
};
