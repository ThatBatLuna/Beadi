import { FunctionComponent } from "react";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData } from "../engine/store";
import { categories } from "./category";
import { gaussianRandom } from "./TimerNode";

const DelayNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
  const progress = useCommittedData<number>(id, "progress") || 0.0;

  return (
    <div className="h-4 mx-2 overflow-hidden rounded-md bg-primary-1100">
      <div
        className="h-full bg-purple-700"
        style={{ width: `${(progress * 100).toFixed(2)}%` }}
      ></div>
    </div>
  );
};

export const delayNodeDef: NodeDef = {
  label: "Delay",
  category: categories["control"],
  type: "delay",
  header: DelayNode,
  outputs: [
    {
      id: "signal",
      label: "Signal",
      type: "impulse",
    },
    {
      id: "progress",
      label: "Progress",
      type: "number",
    },
    {
      id: "running",
      label: "Running",
      type: "boolean",
    },
  ],
  inputs: [
    {
      id: "delayTime",
      label: "Delay",
      type: "number",
      default: 1.0,
    },
    {
      id: "delayTimeDeviation",
      label: "Delay Dev",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
    {
      id: "signal",
      label: "Signal",
      type: "impulse",
      default: false,
    },
  ],
  executor: ([delayTime, delayTimeDev, signal], { commit, committed }) => {
    const time = new Date().getTime();

    const delayEnd = committed["delayEnd"] || null;
    const delayStart = committed["delayStart"] || null;

    if (signal) {
      //Toggle
      const dev = gaussianRandom(0, delayTimeDev * delayTime);
      commit("delayEnd", time + (delayTime + dev) * 1000);
      commit("delayStart", time);
    }

    let progress = 0;
    let running = delayEnd !== null && delayStart !== null;
    if (running) {
      const elapsed = time - delayStart;
      progress = elapsed / (delayEnd - delayStart);
      running = true;
    }
    commit("progress", progress);

    if (delayEnd !== null && time > delayEnd) {
      commit("delayEnd", null);
      commit("delayStart", null);
      return [true, progress, running];
    } else {
      return [false, progress, running];
    }
  },
};
