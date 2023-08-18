import { FunctionComponent } from "react";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { gaussianRandom } from "./TimerNode";
import { emitImpulse } from "../engine/signal";
import { usePreviewStore } from "../storage";

const DelayNode: FunctionComponent<NodeHeaderProps<{}, {}, any, any>> = ({ id }) => {
  const progress = usePreviewStore((s) => s.outputHandlePreviews[id]?.["progress"] ?? 0.0);

  return (
    <div className="h-4 mx-2 overflow-hidden rounded-md bg-primary-1100">
      <div className="h-full bg-purple-700" style={{ width: `${(progress * 100).toFixed(2)}%` }}></div>
    </div>
  );
};

export const delayNodeDef = nodeDef()({
  label: "Delay",
  category: categories["control"],
  type: "delay",
  header: DelayNode,
  outputs: {
    elapsed: {
      id: "elapsed",
      label: "Elapsed",
      type: "impulse",
    },
    progress: {
      id: "progress",
      label: "Progress",
      type: "number",
    },
    running: {
      id: "running",
      label: "Running",
      type: "boolean",
    },
  },
  inputs: {
    delayTime: {
      id: "delayTime",
      label: "Delay",
      type: "number",
      default: 1.0,
    },
    delayTimeDeviation: {
      id: "delayTimeDeviation",
      label: "Delay Dev",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: 1.0,
    },
    signal: {
      id: "signal",
      label: "Signal",
      type: "impulse",
      default: false,
    },
  },
  executor: {
    initialPersistence: {
      delay: null as null | { start: number; end: number },
    },
    executor: ({ delayTime, delayTimeDeviation, signal }, persistent) => {
      const time = new Date().getTime();

      let delay = persistent.delay;

      if (signal.length > 0) {
        const dev = gaussianRandom(0, delayTimeDeviation * delayTime);

        delay = {
          end: time + (delayTime + dev) * 1000,
          start: time,
        };
      }

      let progress = 0;
      let running = false;
      if (delay != null) {
        if (time > delay.end) {
          return {
            outputs: {
              progress: 1.0,
              running: true,
              elapsed: emitImpulse(1),
            },
            persistentData: {
              delay: null,
            },
            driverOutputs: {},
          };
        } else {
          const elapsed = time - delay.start;
          progress = elapsed / (delay.end - delay.start);
          running = true;
          return {
            outputs: {
              progress,
              running,
              elapsed: emitImpulse(0),
            },
            persistentData: {
              delay,
            },
            driverOutputs: {},
          };
        }
      } else {
        return {
          outputs: {
            progress: 0.0,
            running: false,
            elapsed: emitImpulse(0),
          },
          persistentData: {
            delay,
          },
          driverOutputs: {},
        };
      }
    },
  },
});
