import clsx from "clsx";
import { FunctionComponent, ReactNode } from "react";
import { NavLink, useMatch } from "react-router-dom";

type BottomBarContainerProps = {
  tab: TabDef;
};
const BottomBarContainer: FunctionComponent<BottomBarContainerProps> = ({ tab }) => {
  const active = useMatch(tab.id);
  return (
    <NavLink to={tab.id} className="grow flex flex-row justify-center">
      <div className={clsx("flex flex-col items-center justify-center rounded-md m-2 p-2 w-24", { "bg-primary-600": active })}>
        <div className={clsx("w-6", { "opacity-75": active })}>{tab.icon}</div>
        <div className={clsx("text-center w-fit", { "font-bold": active })}>{tab.label}</div>
      </div>
    </NavLink>
  );
};

type TabDef = {
  id: string;
  label: string;
  icon: ReactNode;
};
type BottomBarProps = {
  tabs: TabDef[];
};
export const BottomBar: FunctionComponent<BottomBarProps> = ({ tabs }) => {
  return (
    <div className="flex flex-row justify-around h-20 bg-primary-700">
      {tabs.map((it) => (
        <BottomBarContainer tab={it} key={it.id}></BottomBarContainer>
      ))}
    </div>
  );
};
