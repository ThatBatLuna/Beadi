import { FunctionComponent, ReactNode, useMemo } from "react";
import shallow from "zustand/shallow";
import { useDisplayStore, usePushEphermalData } from "../../engine/store";
import { BUTTON_NODE_TYPE } from "../../nodes/ButtonNode";
import { Node } from "reactflow";
import { MobileWelcome } from "./Welcome";
import { nodeDefs } from "../../nodes/nodes";

type MobileNodeRendererProps = {
  node: Node;
};
const MobileNodeRenderer: FunctionComponent<MobileNodeRendererProps> = ({
  node,
}) => {
  const View = nodeDefs[node.type!!].mobileView;
  if (View === undefined) {
    return <p>Cannot display node of type {node.type} in mobile.</p>;
  } else {
    return (
      <InterfaceWrapper>
        <View id={node.id} data={node.data}></View>
      </InterfaceWrapper>
    );
  }
};

type InterfaceWrapperProps = {
  children?: ReactNode;
};
export const InterfaceWrapper: FunctionComponent<InterfaceWrapperProps> = ({
  children,
}) => {
  return <div className="p-2 m-2 bg-primary-700">{children}</div>;
};

const MOBILE_NODE_TYPES = new Set(
  Object.entries(nodeDefs)
    .filter(([_, def]) => {
      return def.mobileView !== undefined;
    })
    .map(([key, _]) => key)
);

export const ProgramInterface: FunctionComponent<{}> = () => {
  const nodes = useDisplayStore((store) => store.nodes, shallow);

  const mobileNodes = useMemo(() => {
    return nodes.filter(
      (it) =>
        it.type !== undefined &&
        MOBILE_NODE_TYPES.has(it.type) &&
        it.data.mobileVisible !== false //TODO Make ui for mobileVisible
    );
  }, [nodes]);

  // const buttons = useMemo(() => {
  //   return nodes.filter((it) => it.type === BUTTON_NODE_TYPE);
  // }, [nodes]);
  // const outputs = useMemo(() => {
  //   return nodes.filter((it) => it.type === BUTTPLUG_NODE_TYPE);
  // }, [nodes]);

  const empty = mobileNodes.length === 0;

  if (empty) {
    return (
      <>
        <MobileWelcome></MobileWelcome>
      </>
    );
  }

  return (
    <ul>
      {mobileNodes.map((it, index) => (
        <MobileNodeRenderer key={index} node={it}></MobileNodeRenderer>
      ))}
    </ul>
  );
};
