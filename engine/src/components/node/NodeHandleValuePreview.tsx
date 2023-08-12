import { FunctionComponent } from "react";
import { usePreviewStore } from "../../engine/preview";
import { GraphNodeValuePreview } from "./preview/GraphNodeValuePreview";
import { HandleType } from "../../engine/node";
import { BooleanSnakeHandleValuePreview } from "./preview/BooleanSnake";
import { ImpuulseHandleValuePreview } from "./preview/ImpulseNodeValuePreview";

export const nodeHandleValuePreviews: Record<HandleType, FunctionComponent<NodeHandleValuePreviewProps>> = {
  number: GraphNodeValuePreview,
  boolean: BooleanSnakeHandleValuePreview,
  impulse: ImpuulseHandleValuePreview,
};

export type NodeHandleValuePreviewProps = {
  nodeId: string;
  handleId: string;
  type: string;
};
