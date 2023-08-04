import { FunctionComponent, useEffect, useState } from "react";
import { usePreviewStore } from "../../../engine/preview";
import { NodeHandleValuePreviewProps } from "../NodeHandleValuePreview";
import { timerNodeDef } from "../../../nodes/TimerNode";
import produce from "immer";

export const ImpuulseHandleValuePreview: FunctionComponent<NodeHandleValuePreviewProps> = (props) => {
  const value = usePreviewStore((s) => s.outputHandlePreviews[props.nodeId]?.[props.handleId]);

  // useEffect(() => {
  //   let timeout = setInterval(() => {
  //     const value = usePreviewStore.getState().outputHandlePreviews[props.nodeId]?.[props.handleId];
  //     setPreview((s) =>
  //       produce(s, (draft) => {
  //         draft.history[draft.index] = value ?? null;
  //         draft.index = (draft.index + 1) % HISTORY_LENGTH;
  //       })
  //     );
  //   }, 1000 / SAMPLE_RATE);
  //   return () => {
  //     clearInterval(timeout);
  //   };
  // }, [props.nodeId, props.handleId]);
  return <div>{JSON.stringify(value)}</div>;
};
