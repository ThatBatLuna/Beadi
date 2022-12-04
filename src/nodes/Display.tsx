import { FunctionComponent, useRef } from "react";
import NodeLine from "../components/node/NodeLine";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData } from "../engine/store";

const HEIGHT = 100;

const DisplayNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const history = useCommittedData<number[]>(id, "history");
  const index = useCommittedData<number>(id, "index");

  if (history === undefined) {
    return <NodeLine></NodeLine>;
  }

  let min = 0;
  let max = 0;

  const tmpHistory = history.map((it) => {
    const val = -it;
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
    return val;
  });

  const offset = -(min + max) / 2;
  const scale = HEIGHT / 2 / Math.max(0.1, Math.abs(max - offset));

  const correctedHistory = tmpHistory.map((it) => (it + offset) * scale);

  const parts = new Array(HISTORY_LENGTH)
    .fill("")
    .map((_, i) => {
      const realIndex = (i + index) % HISTORY_LENGTH;
      const point = correctedHistory[realIndex];
      if (point < min) {
        min = point;
      }
      if (point > max) {
        max = point;
      }
      return `L${i} ${point}`;
    })
    .join(" ");

  const start = correctedHistory[index];

  return (
    <NodeLine>
      <svg
        viewBox={`0 ${-HEIGHT / 2} ${HISTORY_LENGTH} ${HEIGHT + 5}`}
        height="100"
        className="stroke-white fill-none"
      >
        <path
          className="stroke-slate-500"
          d={`M0 ${(0 + offset) * scale} L${HISTORY_LENGTH} ${
            (0 + offset) * scale
          }`}
        ></path>
        <path d={`M0 ${start} ${parts}`}></path>
      </svg>
    </NodeLine>
  );
};

const HISTORY_LENGTH = 3 * 60;

export const displayNodeDef: NodeDef = {
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
