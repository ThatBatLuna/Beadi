import { FunctionComponent } from "react";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { useFileStore } from "../engine/store";
import { categories } from "./category";
import _ from "lodash";

type PositiveWaveNodeSettings = {
  positiveOnly: boolean;
};

const PositiveWaveNode: FunctionComponent<NodeHeaderProps<{}, PositiveWaveNodeSettings, any>> = ({ id, data }) => {
  // const [positive, setPositive] = useInputHandleData<boolean>(id, "positive");
  const updateNode = useFileStore((s) => s.updateNode);

  const setPositive = (p: boolean) => {
    updateNode(id, (r) => {
      (r.data.settings as PositiveWaveNodeSettings).positiveOnly = p;
    });
  };

  return (
    <div className="px-2">
      <label>
        <input type="checkbox" checked={data.settings.positiveOnly ?? true} onChange={(e) => setPositive(e.target.checked)} />
        <span className="pl-2">Positive Only</span>
      </label>
    </div>
  );
};

export const positiveWaveNodeDef = nodeDef<PositiveWaveNodeSettings>()({
  label: "Wave Generator",
  category: categories["generators"],
  type: "wave",
  header: PositiveWaveNode,
  // component: WaveNode,
  outputs: {
    value: {
      label: "Value",
      type: "number",
    },
  },
  inputs: {
    amplitude: {
      id: "amplitude",
      label: "Height",
      type: "number",
      default: 1.0,
      min: 0.0,
    },

    frequency: {
      id: "frequency",
      label: "Frequency",
      type: "number",
      default: 1.0,
      min: 0.0,
    },
    phase: {
      id: "phase",
      label: "Phase Shift",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: Math.PI * 2,
    },
  },
  executor: {
    initialPersistence: {
      frequency: 0.0,
      offset: 0.0,
    },
    inputDriver: (context) => {
      return {
        positive: context.settings.positiveOnly ?? true,
      };
    },
    executor: ({ amplitude, frequency, phase: phaseShift }, persistent, { positive }) => {
      const seconds = Date.now() / 1000;
      const committedFreq = persistent.frequency;
      let offset = persistent.offset;
      const phase = seconds * 2 * Math.PI;

      if (committedFreq !== frequency) {
        const oldFreq = committedFreq || frequency;

        let newOffset = Math.asin(Math.sin(phase * oldFreq + offset)) - frequency * phase;

        const oldDir = Math.sign(oldFreq * Math.cos(phase * oldFreq + offset));
        const newDir = Math.sign(frequency * Math.cos(phase * frequency + newOffset));
        if (oldDir !== newDir) {
          newOffset = Math.PI - 2 * frequency * phase - newOffset;
        }

        persistent.offset = newOffset;
        persistent.frequency = frequency;
        offset = newOffset;
      }

      const sine = Math.sin(phase * frequency + offset + phaseShift) * amplitude;

      if (positive) {
        return {
          outputs: {
            value: sine / 2.0 + amplitude / 2.0,
          },
          driverOutputs: {},
          persistentData: persistent,
        };
      } else {
        return {
          outputs: {
            value: sine,
          },
          driverOutputs: {},
          persistentData: persistent,
        };
      }
    },
  },
});
