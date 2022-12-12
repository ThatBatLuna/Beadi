import { FunctionComponent, ReactNode } from "react";

type NodeShellProps = {
  children?: ReactNode;
  title: string;
  color: string;
};

const NodeShell: FunctionComponent<NodeShellProps> = ({
  children,
  title,
  color,
}) => {
  return (
    <div className="flex flex-col text-black w-[200px]">
      <div
        className="px-2 text-black bg-red-800 rounded-t-md"
        style={{ backgroundColor: color }}
      >
        <h1 className="px-1">{title}</h1>
      </div>
      <div className="flex-col py-2 text-white rounded-sm bg-slate-900 rounded-b-md">
        {children}
      </div>
    </div>
  );
};
export default NodeShell;
