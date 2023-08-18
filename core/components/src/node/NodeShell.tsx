import clsx from "clsx";
import { CSSProperties, FunctionComponent, ReactNode } from "react";

export type NodeShellProps = {
  children?: ReactNode;
  title: ReactNode;
  color: string;
  style?: CSSProperties;
  headerIcons?: ReactNode;
  errors?: string | undefined;
};

export const NodeShell: FunctionComponent<NodeShellProps> = ({ children, title, style, color, headerIcons, errors }) => {
  return (
    <div className={clsx("flex flex-col text-black w-[200px] rounded-md", { "shadow-error": errors !== undefined })} style={style}>
      <div className={clsx("flex flex-row text-black bg-red-800 rounded-t-md")} style={{ backgroundColor: color }}>
        {/* <h1 className="px-1">{title}</h1> */}
        {title}
        <div className="grow"></div>
        {headerIcons}
      </div>
      <div
        className={clsx("flex-col py-2 text-white rounded-sm bg-primary-900 rounded-b-md", {
          "bg-red-700": errors !== undefined,
        })}
      >
        {children}
      </div>
    </div>
  );
};
