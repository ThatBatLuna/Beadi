import { NodeDef } from "../engine/node";
import { categories } from "./category";

export const waveNodeDef: NodeDef = {
  label: "Wave Generator",
  category: categories["generators"],
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
  executor: ([amplitude, frequency], { commit, committed }) => {
    const seconds = Date.now() / 1000;
    const committedFreq = committed["frequency"];
    const oldSecs = committed["oldTime"];
    let offset = committed["offset"] || 0;

    if (committedFreq !== frequency) {
      //sin((p1+o0)*f0) = sin((p1+o1) * f1)
      //asin(sin((p1+o0)*f0)) = (p1 + o1) * f1
      //asin(sin((p1+o0)*f0)) / f1 - p1 = o1

      const o0 = offset;
      const f0 = committedFreq || frequency;
      const p1 = seconds * 2 * Math.PI;
      const f1 = frequency;

      let o1 = Math.asin(Math.sin(p1 * f0 + o0)) - f1 * p1;

      const oldDir = Math.sign(f0 * Math.cos(p1 * f0 + o0));
      const newDir = Math.sign(f1 * Math.cos(p1 * f1 + o1));
      if (oldDir !== newDir) {
        //sin(p1 * f1 + o1 * f1) = sin(p1 * f1 + Z - (o1 * f1)) = sin(p1 * f1 + o2 * f1)
        //Z - o1 * f1 = o2 * f1
        //Z/f1 - o1 = o2
        //
        //sin(Z - any) = sin(any)
        //cos(Z - any) = -cos(any)
        const o2 = Math.PI - 2 * f1 * p1 - o1;

        o1 = o2;
      }

      commit("offset", o1);
      commit("frequency", frequency);
      offset = o1;
    }

    commit("oldTime", seconds);
    const phase = seconds * 2 * Math.PI;
    return [Math.sin(phase * frequency + offset) * amplitude];
  },
};
