import clsx from "clsx";
import {
  ComponentType,
  FunctionComponent,
  ReactNode,
  useMemo,
  useState,
} from "react";
import {
  BsChevronBarRight,
  BsController,
  BsFile,
  BsFillPlugFill,
} from "react-icons/bs";
import { ButtplugSettings } from "./settings/ButtplugSettings";
import { FileSettings } from "./settings/FileSettings";
import { MobileInterfaceTab } from "./settings/MobileInterface";

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
  file: {
    name: "file",
    label: "File",
    icon: <BsFile className="w-full h-full"></BsFile>,
    tab: FileSettings,
  },
  mobile: {
    name: "mobile",
    label: "Mobile Interface",
    icon: <BsController className="w-full h-full"></BsController>,
    tab: MobileInterfaceTab,
  },
};

export const Settings: FunctionComponent<{}> = () => {
  const [tab, setTab] = useState<string | null>("buttplug");

  const Component = useMemo(() => {
    if (tab == null) {
      return null;
    } else {
      return tabs[tab].tab;
    }
  }, [tab]);

  return (
    <div className="flex flex-row shadow-sm bg-primary-1100">
      <ul className="flex flex-col gap-1 text-white">
        {Object.entries(tabs).map(([key, value]) => (
          <li
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              "w-10 h-10 p-2 rounded-l-md cursor-pointer",
              tab === key ? "bg-primary-900" : "bg-primary-1000"
            )}
          >
            {value.icon}
          </li>
        ))}
        <li
          className={clsx(
            "w-10 h-10 p-2 mt-auto cursor-pointer transition-all",
            {
              "opacity-0": tab === null,
            }
          )}
          onClick={() => setTab(null)}
        >
          <BsChevronBarRight className="w-full h-full"></BsChevronBarRight>
        </li>
      </ul>
      <div
        className={clsx("transition-all flex flex-col bg-primary-900", {
          "w-96": Component !== null,
          "w-0": Component === null,
        })}
      >
        <div className="flex flex-col w-96 overflow-y-scroll">
          {Component && <Component></Component>}
        </div>
      </div>
    </div>
  );
};
