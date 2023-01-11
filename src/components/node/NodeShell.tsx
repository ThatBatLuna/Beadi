import { CSSProperties, FunctionComponent, ReactNode } from "react";

type NodeShellProps = {
  children?: ReactNode;
  title: string;
  color: string;
  style?: CSSProperties;
};

const NodeShell: FunctionComponent<NodeShellProps> = ({
  children,
  title,
  style,
  color,
}) => {
  return (
    <div className="flex flex-col text-black w-[200px]" style={style}>
      <div
        className="px-2 text-black bg-red-800 rounded-t-md"
        style={{ backgroundColor: color }}
      >
        <h1 className="px-1">{title}</h1>
      </div>
      <div className="flex-col py-2 text-white rounded-sm bg-primary-900 rounded-b-md">
        {children}
      </div>
    </div>
  );
};
export default NodeShell;
