import { FunctionComponent } from "react";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { usePreviewStore } from "..";

export function gaussianRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random(); //Converting [0,1) to (0,1)
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

const TimerNode: FunctionComponent<NodeHeaderProps<{}, {}, any, any>> = ({ id }) => {
  const progress = usePreviewStore((s) => s.outputHandlePreviews[id]?.["progress"] ?? 0.0);

  return (
    <div className="h-4 mx-2 overflow-hidden rounded-md bg-primary-1100">
      <div className="h-full bg-purple-700" style={{ width: `${(progress * 100).toFixed(2)}%` }}></div>
    </div>
  );
};

export const timerNodeDef = nodeDef()({
  label: "Random Timer Node",
  category: categories["generators"],
  type: "timer",
  header: TimerNode,
  outputs: {
    value: {
      label: "Value",
      type: "boolean",
    },
    progress: {
      label: "Progress",
      type: "number",
    },
  },
  inputs: {
    onTime: {
      label: "On Time",
      type: "number",
      default: 1.0,
    },
    onTimeDeviation: {
      label: "On Time Dev",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
    offTime: {
      label: "Off Time",
      type: "number",
      default: 1.0,
    },
    offTimeDeviation: {
      label: "Off Time Dev",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
  },
  executor: {
    initialPersistence: {
      toggleTime: new Date(),
      lastTime: new Date(),
      last: false,
      progress: 0,
    },

    executor: ({ onTime, onTimeDeviation, offTime, offTimeDeviation }, persistent) => {
      if (new Date().getTime() >= persistent.toggleTime.getTime()) {
        //Toggle

        if (persistent.last === false) {
          const dev = gaussianRandom(0, onTimeDeviation * onTime);
          persistent.lastTime = persistent.toggleTime;
          persistent.toggleTime = new Date(new Date().getTime() + (onTime + dev) * 1000);
          persistent.last = true;
        } else {
          const dev = gaussianRandom(0, offTimeDeviation * offTime);
          persistent.lastTime = persistent.toggleTime;
          persistent.toggleTime = new Date(new Date().getTime() + (offTime + dev) * 1000);
          persistent.last = false;
        }
      }

      const duration = persistent.toggleTime.getTime() - persistent.lastTime.getTime();
      const elapsed = new Date().getTime() - persistent.lastTime.getTime();
      const progress = elapsed / duration;

      persistent.progress = progress;

      return {
        outputs: {
          value: persistent.last,
          progress: progress,
        },
        driverOutputs: {},
        persistentData: persistent,
      };
    },
  },
});
