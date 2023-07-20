import { FunctionComponent } from "react";
import { usePreviewStore } from "../../engine/preview";
import { GraphNodeValuePreview } from "./preview/GraphNodeValuePreview";

export const nodeHandleValuePreviews: Record<string, FunctionComponent<NodeHandleValuePreviewProps>> = {
  number: GraphNodeValuePreview,
};

export type NodeHandleValuePreviewProps = {
  nodeId: string;
  handleId: string;
  type: string;
};
