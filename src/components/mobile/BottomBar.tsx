import clsx from "clsx";
import { FunctionComponent, ReactNode } from "react";

type BottomBarContainerProps = {
  children?: ReactNode;
  active: boolean;
  onClick: () => void;
};
const BottomBarContainer: FunctionComponent<BottomBarContainerProps> = ({ children, onClick, active }) => {
  return (
    <button onClick={onClick} className="grow flex flex-row justify-center">
      <div className={clsx("flex flex-col items-center justify-center rounded-md m-2 p-2 w-24", { "bg-primary-600": active })}>
        {children}
      </div>
    </button>
  );
};

type TabDef = {
  id: string;
  label: string;
  icon: ReactNode;
};
type BottomBarProps = {
  activeTabId: string;
  tabs: TabDef[];
  onTabChange: (id: string) => void;
};
export const BottomBar: FunctionComponent<BottomBarProps> = ({ activeTabId, tabs, onTabChange }) => {
  return (
    <div className="flex flex-row justify-around h-20 bg-primary-700">
      {tabs.map((it, index) => (
        <BottomBarContainer onClick={() => onTabChange(it.id)} key={it.label} active={activeTabId === it.id}>
          <div className={clsx("w-6", { "opacity-75": activeTabId !== it.id })}>{it.icon}</div>
          <div className={clsx("text-center w-fit", { "font-bold": activeTabId === it.id })}>{it.label}</div>
        </BottomBarContainer>
      ))}
    </div>
  );
};
