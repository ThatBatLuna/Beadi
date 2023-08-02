import { FunctionComponent, ReactNode, useState } from "react";
import { Button } from "./input/Button";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import clsx from "clsx";

type CollapsibleCardProps = {
  header?: ReactNode;
  children?: ReactNode;
  startExpanded?: boolean;
};
export const CollapsibleCard: FunctionComponent<CollapsibleCardProps> = ({ header, children, startExpanded }) => {
  const [expanded, setExpanded] = useState(startExpanded ?? true);
  return (
    <div className="bg-primary-900 rounded-md">
      <div className={clsx("h-12 flex flex-row p-2 items-center bg-primary-700 rounded-t-md", { "rounded-b-md": !expanded })}>
        {header}

        {!expanded && <Button onClick={() => setExpanded(true)} icon={<MdExpandMore />}></Button>}
        {expanded && <Button onClick={() => setExpanded(false)} icon={<MdExpandLess />}></Button>}
      </div>
      {expanded && <div className="border-t border-t-primary-400 p-2">{children}</div>}
    </div>
  );
};
