import { FunctionComponent, useEffect, useState } from "react";
import { usePreviewStore } from "../../../engine/preview";
import { NodeHandleValuePreviewProps } from "../NodeHandleValuePreview";
import { timerNodeDef } from "../../../nodes/TimerNode";
import produce from "immer";

const HISTORY_LENGTH = 3 * 60;
const HEIGHT = 100;
const MIN_HEIGHT = 1.0;

type GraphProps = {
  history: (number | undefined)[];
  index: number;
  fixed: boolean;
};
const Graph: FunctionComponent<GraphProps> = ({ history, index, fixed }) => {
  let min = 0;
  let max = 0;

  const tmpHistory = history.map((it) => {
    const val = it || 0.0;
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
    return val;
  });

  if (fixed) {
    min = 0.0;
    max = 1.0;
  } else {
    const mean = (max + min) / 2;
    if (max - min < MIN_HEIGHT) {
      max = mean + MIN_HEIGHT / 2.0;
      min = mean - MIN_HEIGHT / 2.0;
    }
  }

  const offset = -(min + max) / 2;
  const scale = HEIGHT / 2 / Math.max(0.001, Math.abs(max + offset));

  const correctedHistory = tmpHistory.map((it) => (it + offset) * scale);

  const parts = new Array(HISTORY_LENGTH)
    .fill("")
    .map((_, i) => {
      const realIndex = (i + index) % HISTORY_LENGTH;
      const point = correctedHistory[realIndex] || 0;

      const coords = -point;
      return `L${i} ${coords.toFixed(4)}`;
    })
    .join(" ");

  const start = correctedHistory[index];

  const zero = (0 + offset) * scale;
  const maxLine = (max + offset) * scale;
  const minLine = (min + offset) * scale;

  return (
    <svg viewBox={`0 ${-HEIGHT / 2} ${HISTORY_LENGTH} ${HEIGHT + 5}`} height="100" className="stroke-white fill-none">
      <path className="stroke-slate-500" d={`M0 ${-maxLine} L${HISTORY_LENGTH} ${-maxLine}`}></path>
      <path className="stroke-slate-500" d={`M0 ${-minLine} L${HISTORY_LENGTH} ${-minLine}`}></path>
      <path className="stroke-slate-500" d={`M0 ${-zero} L${HISTORY_LENGTH} ${-zero}`}></path>
      <text x="0" y={-zero} className="text-sm stroke-none fill-white">
        {" "}
        0
      </text>
      <text x="0" y={-maxLine + 10} className="text-sm stroke-none fill-white h-[10px]">
        {max.toFixed(2)}
      </text>
      <text x="0" y={-minLine - 10} className="text-sm stroke-none fill-white h-[10px]">
        {min.toFixed(2)}
      </text>
      <path d={`M0 ${-start} ${parts}`}></path>
    </svg>
  );
};

const SAMPLE_RATE = 60;
export const GraphNodeValuePreview: FunctionComponent<NodeHandleValuePreviewProps> = (props) => {
  const [preview, setPreview] = useState({ index: 0, history: new Array(HISTORY_LENGTH).fill(0) });

  useEffect(() => {
    let timeout = setInterval(() => {
      const value = usePreviewStore.getState().outputHandlePreviews[props.nodeId]?.[props.handleId];
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
  }, [props.nodeId, props.handleId]);
  return (
    <div>
      <Graph history={preview.history} index={preview.index} fixed={false} />
    </div>
  );
};
