import { FunctionComponent, ReactNode } from "react";

type BottomBarContainerProps = {
  children?: ReactNode;
  onClick: () => void;
};
const BottomBarContainer: FunctionComponent<BottomBarContainerProps> = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="flex flex-col items-center p-4 grow">
      {children}
    </button>
  );
};

type TabDef = {
  id: string;
  label: string;
  icon: ReactNode;
};
type BottomBarProps = {
  tabs: TabDef[];
  onTabChange: (id: string) => void;
};
export const BottomBar: FunctionComponent<BottomBarProps> = ({ tabs, onTabChange }) => {
  return (
    <div className="flex flex-row h-20 bg-primary-700">
      {tabs.map((it, index) => (
        <BottomBarContainer onClick={() => onTabChange(it.id)} key={it.label}>
          {it.icon}
          <div className="text-center w-fit">{it.label}</div>
        </BottomBarContainer>
      ))}
    </div>
  );
};
