import { FunctionComponent } from "react";

const ImpulseHandle: FunctionComponent<{}> = () => {
  return (
    <svg viewBox="0 0 18 12" width="18" height="12" className="pointer-events-none fill-blue-900 stroke-black">
      <path d="M 0.5,0.5 12,0.5 17.5,6 12,11.5 0.5,11.5 Z"></path>
    </svg>
  );
};

const NumberHandle: FunctionComponent<{}> = () => {
  return <div className="w-3 h-3 border border-black rounded-full pointer-events-none bg-primary-500"></div>;
};

const BooleanHandle: FunctionComponent<{}> = () => {
  return <div className="w-3 h-3 bg-red-700 border border-black rounded-full pointer-events-none"></div>;
};

const classNames: Record<string, FunctionComponent<{}>> = {
  impulse: ImpulseHandle,
  number: NumberHandle,
  boolean: BooleanHandle,
};
type NodeHandleDisplayProps = {
  type: string;
};
export const NodeHandleDisplay: FunctionComponent<NodeHandleDisplayProps> = ({ type }) => {
  const HandleDisplay = classNames[type] || NumberHandle;

  return <HandleDisplay></HandleDisplay>;
};
