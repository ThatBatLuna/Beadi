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
    let offset = committed["offset"] || 0;
    const phase = seconds * 2 * Math.PI;

    if (committedFreq !== frequency) {
      const oldFreq = committedFreq || frequency;

      let newOffset =
        Math.asin(Math.sin(phase * oldFreq + offset)) - frequency * phase;

      const oldDir = Math.sign(oldFreq * Math.cos(phase * oldFreq + offset));
      const newDir = Math.sign(
        frequency * Math.cos(phase * frequency + newOffset)
      );
      if (oldDir !== newDir) {
        newOffset = Math.PI - 2 * frequency * phase - newOffset;
      }

      commit("offset", newOffset);
      commit("frequency", frequency);
      offset = newOffset;
    }

    return [Math.sin(phase * frequency + offset) * amplitude];
  },
};
