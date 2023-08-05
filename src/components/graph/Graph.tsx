import { FunctionComponent } from "react";

type GraphProps = {
  history: (number | undefined)[];
  index: number;
  fixed: boolean;
  height: number;
  minHeight: number;
};
export const Graph: FunctionComponent<GraphProps> = ({ history, index, fixed, minHeight, height }) => {
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
    if (max - min < minHeight) {
      max = mean + minHeight / 2.0;
      min = mean - minHeight / 2.0;
    }
  }

  const offset = -(min + max) / 2;
  const scale = height / 2 / Math.max(0.001, Math.abs(max + offset));

  const correctedHistory = tmpHistory.map((it) => (it + offset) * scale);

  const parts = new Array(history.length)
    .fill("")
    .map((_, i) => {
      const realIndex = (i + index) % history.length;
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
    <svg viewBox={`0 ${-height / 2} ${history.length} ${height + 5}`} height="100" className="stroke-white fill-none">
      <path className="stroke-slate-500" d={`M0 ${-maxLine} L${history.length} ${-maxLine}`}></path>
      <path className="stroke-slate-500" d={`M0 ${-minLine} L${history.length} ${-minLine}`}></path>
      <path className="stroke-slate-500" d={`M0 ${-zero} L${history.length} ${-zero}`}></path>
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
