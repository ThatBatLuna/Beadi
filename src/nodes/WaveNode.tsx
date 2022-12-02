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
    },
    {
      id: "frequency",
      label: "Frequency",
      type: "number",
    },
  ],
  executor: (i) => {
    return [Math.sin(Date.now() / 1000)];
  },
};
