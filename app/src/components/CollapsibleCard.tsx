import { FunctionComponent, ReactNode, useState } from "react";
import { Button } from "./input/Button";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import clsx from "clsx";

type CollapsibleCardProps = {
  header?: ReactNode | FunctionComponent<{}>;
  children?: ReactNode | FunctionComponent<{}>;
  forceExpanded?: boolean | undefined;
  startExpanded?: boolean;
};
export const CollapsibleCard: FunctionComponent<CollapsibleCardProps> = ({
  header: Header,
  children: Children,
  startExpanded,
  forceExpanded,
}) => {
  const [expanded, setExpanded] = useState(startExpanded ?? true);

  const actuallyExpanded = expanded || forceExpanded;

  return (
    <div className="bg-primary-800 rounded-md">
      <div className={clsx("h-12 flex flex-row p-2 items-center bg-primary-700 rounded-t-md", { "rounded-b-md": !expanded })}>
        {typeof Header === "function" ? <Header /> : Header}

        {!expanded && forceExpanded === undefined && <Button onClick={() => setExpanded(true)} icon={<MdExpandMore />}></Button>}
        {expanded && forceExpanded === undefined && <Button onClick={() => setExpanded(false)} icon={<MdExpandLess />}></Button>}
      </div>
      {actuallyExpanded && (
        <div className="border-t border-t-primary-400 p-2">{typeof Children === "function" ? <Children /> : Children}</div>
      )}
    </div>
  );
};
