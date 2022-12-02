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
    },
    {
      id: "frequency",
      label: "Frequency",
      type: "number",
      default: 1.0,
    },
  ],
  executor: (i) => {
    return [Math.sin(Date.now() / 1000)];
  },
};
