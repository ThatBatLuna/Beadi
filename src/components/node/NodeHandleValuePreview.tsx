import { FunctionComponent } from "react";
import { usePreviewStore } from "../../engine/preview";

const NumberPreview: FunctionComponent<NodeHandleValuePreviewProps> = (props) => {
  const value = usePreviewStore((s) => s.outputHandlePreviews[props.nodeId]?.[props.handleId]);
  return <div>V: {value}</div>;
};

export const nodeHandleValuePreviews: Record<string, FunctionComponent<NodeHandleValuePreviewProps>> = {
  number: NumberPreview,
};

type NodeHandleValuePreviewProps = {
  nodeId: string;
  handleId: string;
  type: string;
};
