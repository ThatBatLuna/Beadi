import clsx from "clsx";
import { ComponentType, FunctionComponent, ReactNode, useMemo, useState } from "react";
import { BsChevronBarRight, BsFile } from "react-icons/bs";
import { FileSettings } from "./settings/FileSettings";
import { settingsTabs } from "../registries";
import { MdInsertDriveFile } from "react-icons/md";
import { NavLink, Outlet, useLocation, useMatch } from "react-router-dom";

export type Tab = {
  id: string;
  label: string;
  icon: ReactNode;
  tab: ReactNode;
};

export const fileTab: Tab = {
  id: "file",
  label: "File",
  icon: <MdInsertDriveFile className="w-full h-full"></MdInsertDriveFile>,
  tab: <FileSettings />,
};

export const Settings: FunctionComponent<{}> = () => {
  // const [tab, setTab] = useState<string | null>(Object.keys(settingsTabs)[0]);

  // const Component = useMemo(() => {
  //   if (tab == null) {
  //     return null;
  //   } else {
  //     return settingsTabs[tab].tab;
  //   }
  // }, [tab]);
  const isRoot = useLocation();
  const expanded = isRoot.pathname !== "/";

  return (
    <div className="flex flex-row shadow-sm bg-primary-1100">
      <ul className="flex flex-col gap-1 text-white">
        {Object.entries(settingsTabs).map(([key, value]) => (
          <NavLink
            key={key}
            to={value.id}
            className={({ isActive }) => clsx("w-10 h-10 p-2 rounded-l-md cursor-pointer", isActive ? "bg-primary-900" : "bg-primary-1000")}
          >
            {value.icon}
          </NavLink>
        ))}
        <NavLink
          className={({ isActive }) =>
            clsx("w-10 h-10 p-2 mt-auto cursor-pointer transition-all", {
              "opacity-0": isActive,
            })
          }
          to="/"
        >
          <BsChevronBarRight className="w-full h-full"></BsChevronBarRight>
        </NavLink>
      </ul>
      <div
        className={clsx("transition-all flex flex-col bg-primary-900", {
          "w-96": expanded,
          "w-0": !expanded,
        })}
      >
        <div className="flex flex-col overflow-y-scroll w-96">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
