import { FunctionComponent, useEffect, useState } from "react";
import { NodeHandleValuePreviewProps } from "../NodeHandleValuePreview";
import produce from "immer";
import { Graph } from "@beadi/components";
import { usePreviewStore } from "../../../storage";
import { useBeadiInstance } from "../../..";

const HISTORY_LENGTH = 3 * 60;
const HEIGHT = 100;
const MIN_HEIGHT = 1.0;
const SAMPLE_RATE = 60;
export const GraphNodeValuePreview: FunctionComponent<NodeHandleValuePreviewProps> = (props) => {
  const [preview, setPreview] = useState({ index: 0, history: new Array(HISTORY_LENGTH).fill(0) });
  const beadi = useBeadiInstance();

  useEffect(() => {
    let timeout = setInterval(() => {
      const value = usePreviewStore.getStateWith(beadi).outputHandlePreviews[props.nodeId]?.[props.handleId];
      setPreview((s) =>
        produce(s, (draft) => {
          draft.history[draft.index] = value ?? null;
          draft.index = (draft.index + 1) % HISTORY_LENGTH;
        })
      );
    }, 1000 / SAMPLE_RATE);
    return () => {
      clearInterval(timeout);
    };
  }, [props.nodeId, props.handleId, beadi]);
  return (
    <div className="flex flex-row justify-center bg-primary-1000">
      <Graph history={preview.history} index={preview.index} fixed={false} height={HEIGHT} minHeight={MIN_HEIGHT} />
    </div>
  );
};
