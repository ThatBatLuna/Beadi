import { FunctionComponent, ReactNode } from "react";

type BottomBarContainerProps = {
  children?: ReactNode;
  onClick: () => void;
};
const BottomBarContainer: FunctionComponent<BottomBarContainerProps> = ({
  children,
  onClick,
}) => {
  return (
    <button onClick={onClick} className="flex flex-col grow">
      {children}
    </button>
  );
};

type TabDef = {
  label: string;
};
type BottomBarProps = {
  tabs: TabDef[];
  onTabChange: (tab: TabDef) => void;
};
export const BottomBar: FunctionComponent<BottomBarProps> = ({
  tabs,
  onTabChange,
}) => {
  return (
    <div className="flex flex-row h-20 bg-primary-700">
      {tabs.map((it) => (
        <BottomBarContainer onClick={() => onTabChange(it)} key={it.label}>
          {it.label}
        </BottomBarContainer>
      ))}
    </div>
  );
};
