import { FunctionComponent, ReactNode, useMemo } from "react";
import shallow from "zustand/shallow";
import { useDisplayStore, usePushEphermalData } from "../../engine/store";
import { BUTTON_NODE_TYPE } from "../../nodes/ButtonNode";
import { Node } from "reactflow";
import { Button } from "../input/Button";
import {
  ButtplugNodeInterface,
  BUTTPLUG_NODE_TYPE,
} from "../../nodes/ButtplugNode";

type ButtonInterfaceProps = {
  node: Node<any>;
};
export const ButtonInterface: FunctionComponent<ButtonInterfaceProps> = ({
  node,
}) => {
  const push = usePushEphermalData(node.id, "signal");
  return <Button onClick={() => push(true)}>{node.id}</Button>;
};

type OutputInterfaceProps = {
  node: Node<any>;
};
export const OutputInterface: FunctionComponent<OutputInterfaceProps> = ({
  node,
}) => {
  const push = usePushEphermalData(node.id, "signal");
  return <Button onClick={() => push(true)}>{node.id}</Button>;
};

type InterfaceWrapperProps = {
  children?: ReactNode;
};
export const InterfaceWrapper: FunctionComponent<InterfaceWrapperProps> = ({
  children,
}) => {
  return <div className="p-2 m-2 bg-primary-700">{children}</div>;
};

export const ProgramInterface: FunctionComponent<{}> = () => {
  const nodes = useDisplayStore((store) => store.nodes, shallow);

  const buttons = useMemo(() => {
    return nodes.filter((it) => it.type === BUTTON_NODE_TYPE);
  }, [nodes]);
  const outputs = useMemo(() => {
    return nodes.filter((it) => it.type === BUTTPLUG_NODE_TYPE);
  }, [nodes]);

  return (
    <ul>
      {buttons.map((it) => (
        <ButtonInterface key={it.id} node={it}></ButtonInterface>
      ))}
      {outputs.map((it) => (
        <InterfaceWrapper key={it.id}>
          <ButtplugNodeInterface id={it.id} data={{}}></ButtplugNodeInterface>
        </InterfaceWrapper>
      ))}
    </ul>
  );
};
