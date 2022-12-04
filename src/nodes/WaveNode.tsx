import { NodeDef } from "../engine/node";

export const waveNodeDef: NodeDef = {
  type: "wave",
  // component: WaveNode,
  outputs: [
    {
      id: "value",
      label: "Value",
      type: "number",
    },
  ],
  inputs: [
    {
      id: "amplitude",
      label: "Amplitude",
      type: "number",
      default: 1.0,
      min: 0.0,
    },
    {
      id: "frequency",
      label: "Frequency",
      type: "number",
      default: 1.0,
      min: 0.0,
    },
  ],
  executor: ([amplitude, frequency]) => {
    const seconds = Date.now() / 1000;
    return [Math.sin(seconds * 2 * Math.PI * frequency) * amplitude];
  },
};
