import { FunctionComponent, useState } from "react";
import NodeLine from "../components/node/NodeLine";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData } from "../engine/store";
import { categories } from "./category";

const HEIGHT = 100;

const DisplayNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const history = useCommittedData<number[]>(id, "history");
  const index = useCommittedData<number>(id, "index");

  const fixed = useState(true);

  if (history === undefined) {
    return <NodeLine></NodeLine>;
  }

  let min = 0;
  let max = 0;

  const tmpHistory = history.map((it) => {
    const val = it;
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

  // -min/2 + max/2 * (HEIGHT / 2 / (max - offset))

  return (
    <NodeLine>
      <svg
        viewBox={`0 ${-HEIGHT / 2} ${HISTORY_LENGTH} ${HEIGHT + 5}`}
        height="100"
        className="stroke-white fill-none"
      >
        <path
          className="stroke-slate-500"
          d={`M0 ${-maxLine} L${HISTORY_LENGTH} ${-maxLine}`}
        ></path>
        <path
          className="stroke-slate-500"
          d={`M0 ${-minLine} L${HISTORY_LENGTH} ${-minLine}`}
        ></path>
        <path
          className="stroke-slate-500"
          d={`M0 ${-zero} L${HISTORY_LENGTH} ${-zero}`}
        ></path>
        <text x="0" y={-zero} className="text-sm stroke-none fill-white">
          {" "}
          0
        </text>
        <text
          x="0"
          y={-maxLine + 10}
          className="text-sm stroke-none fill-white h-[10px]"
        >
          {max.toFixed(2)}
        </text>
        <text
          x="0"
          y={-minLine - 10}
          className="text-sm stroke-none fill-white h-[10px]"
        >
          {min.toFixed(2)}
        </text>
        <path d={`M0 ${-start} ${parts}`}></path>
      </svg>
    </NodeLine>
  );
};

const HISTORY_LENGTH = 3 * 60;

export const displayNodeDef: NodeDef = {
  label: "Display",
  category: categories["display"],
  type: "display",
  // component: DisplayNode,
  header: DisplayNode,
  outputs: [],
  inputs: [
    {
      terminal: true,
      id: "value",
      label: "Value",
      type: "number",
      default: 0.0,
    },
  ],
  executor: ([v], { commit, committed }) => {
    const history = committed["history"] || new Array(HISTORY_LENGTH);
    const index = committed["index"] || 0;

    history[index] = v;

    commit("history", history);
    commit("index", (index + 1) % HISTORY_LENGTH);

    return [];
  },
};
