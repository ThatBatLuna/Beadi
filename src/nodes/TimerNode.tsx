import { DateTime } from "luxon";
import { FunctionComponent, useEffect, useState } from "react";
import { NodeDef, NodeHeaderProps } from "../engine/node";
import { useCommittedData, useInputHandleData } from "../engine/store";
import { categories } from "./category";

function gaussianRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random(); //Converting [0,1) to (0,1)
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

const TimerNode: FunctionComponent<NodeHeaderProps> = ({ id }) => {
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

export const timerNodeDef: NodeDef = {
  label: "Timer Node",
  category: categories["generators"],
  type: "timer",
  header: TimerNode,
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
    {
      id: "progress",
      label: "Progress",
      type: "progress",
    },
  ],
  inputs: [
    {
      id: "onTime",
      label: "On Time",
      type: "number",
      default: 1.0,
    },
    {
      id: "onTimeDeviation",
      label: "On Time Dev",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
    {
      id: "offTime",
      label: "Off Time",
      type: "number",
      default: 1.0,
    },
    {
      id: "offTimeDeviation",
      label: "Off Time Dev",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
  ],
  executor: (
    [onTime, onTimeDev, offTime, offTimeDev],
    { commit, committed }
  ) => {
    const last = committed["last"] || 0.0;
    const toggle = committed["toggleTime"] || new Date().getTime();
    const lastTime = committed["lastTime"] || new Date().getTime();

    if (new Date().getTime() >= toggle) {
      //Toggle

      if (last === 0.0) {
        const dev = gaussianRandom(0, onTimeDev * onTime);
        commit("toggleTime", new Date().getTime() + (onTime + dev) * 1000);
        commit("lastTime", toggle);
        commit("last", 1.0);
      } else {
        const dev = gaussianRandom(0, offTimeDev * offTime);
        commit("toggleTime", new Date().getTime() + (offTime + dev) * 1000);
        commit("lastTime", toggle);
        commit("last", 0.0);
      }
    }

    const duration = toggle - lastTime;
    const elapsed = new Date().getTime() - lastTime;
    const progress = elapsed / duration;

    commit("progress", progress);

    return [last, progress];
  },
};
