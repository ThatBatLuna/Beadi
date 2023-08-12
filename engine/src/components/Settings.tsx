import clsx from "clsx";
import { FunctionComponent, ReactNode } from "react";
import { FileSettings } from "./settings/FileSettings";
import { MdChevronRight, MdInsertDriveFile } from "react-icons/md";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useBeadi } from "../context";

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
  const beadi = useBeadi();
  const isRoot = useLocation();
  const expanded = isRoot.pathname !== "/";

  return (
    <div className="flex flex-row shadow-sm bg-primary-1100">
      <ul className="flex flex-col gap-1 text-white">
        {Object.entries(beadi.settingsTabs).map(([key, value]) => (
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
          <MdChevronRight className="w-full h-full"></MdChevronRight>
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
