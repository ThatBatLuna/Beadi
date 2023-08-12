import { FunctionComponent, ReactNode } from "react";

type NodeLineProps = {
  children?: ReactNode;
};

const NodeLine: FunctionComponent<NodeLineProps> = ({ children }) => {
  return <div className="flex flex-row items-center mx-3 mt-2">{children}</div>;
};

export default NodeLine;
