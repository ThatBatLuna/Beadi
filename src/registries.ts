import { AnyNodeDef, NodeDef } from "./engine/node";

// import {
//   addNodeDef,
//   divideNodeDef,
//   multiplyNodeDef,
//   subtractNodeDef,
// } from "../nodes/AddNode";
// import { buttonNodeDef } from "../nodes/ButtonNode";
// import { buttplugNodeDef } from "../nodes/ButtplugNode";
// import { constantValueNodeDef } from "../nodes/ConstantValueNode";
// import { displayNodeDef } from "../nodes/Display";
// import { hysteresisNodeDef } from "../nodes/HysteresisNode";
// import { memoryNodeDef } from "../nodes/MemoryNode";
// import { mixNodeDef } from "../nodes/MixNode";
// import { positiveWaveNodeDef } from "../nodes/PositiveWave";
// import { randomNodeDef } from "../nodes/RandomNode";
import { timerNodeDef } from "./nodes/TimerNode";
import { inputAdapterNode } from "./nodes/InputAdapterNode";
// import { clampNodeDef } from "./ClampNode";
// import { commentNodeDef } from "./CommentNode";
// import { curveNodeDef } from "./CurveNode";
// import { delayNodeDef } from "./DelayNode";
// import { edgeDetectorNodeDef } from "./EdgeDetector";
// import { mediaFurryNodeDef } from "./MediaFurry";
// import { sensorNodeDef } from "./SensorNode";
// import { sliderNodeDef } from "./SliderNode";
import { toggleNodeDef } from "./nodes/ToggleNode";
import { AnyInputAdapterDef, AnyOutputAdapterDef, InputAdapterDef } from "./engine/adapter";
import { remoteInputAdapter, testRemoteInputAdapter } from "./remotePlugin/inputAdapter";
import { remoteOutputAdapter, testRemoteOutputAdapter } from "./remotePlugin/outputAdapter";
import { outputAdapterNode } from "./nodes/OutputAdapterNode";

const nodeDefList: AnyNodeDef[] = [
  // displayNodeDef,
  // constantValueNodeDef,
  // positiveWaveNodeDef,
  // addNodeDef,
  // subtractNodeDef,
  // divideNodeDef,
  // multiplyNodeDef,
  // buttplugNodeDef,
  // mixNodeDef,
  // hysteresisNodeDef,
  // memoryNodeDef,
  // randomNodeDef,
  timerNodeDef as any,
  // buttonNodeDef,
  // sliderNodeDef,
  toggleNodeDef as any,
  inputAdapterNode as any,
  outputAdapterNode as any,
  // clampNodeDef,
  // curveNodeDef,
  // delayNodeDef,
  // commentNodeDef,
  // sensorNodeDef,
  // mediaFurryNodeDef,
  // edgeDetectorNodeDef,
];

export const nodeDefs: Record<string, AnyNodeDef> = Object.assign({}, ...nodeDefList.map((it) => ({ [it.type]: it })));

const inputAdapterDefList: AnyInputAdapterDef[] = [remoteInputAdapter, testRemoteInputAdapter];

export const inputAdapterDefs: Record<string, AnyInputAdapterDef> = Object.assign(
  {},
  ...inputAdapterDefList.map((it) => ({ [it.id]: it }))
);

const outputAdapterDefList: AnyOutputAdapterDef[] = [remoteOutputAdapter, testRemoteOutputAdapter];

export const outputAdapterDefs: Record<string, AnyOutputAdapterDef> = Object.assign(
  {},
  ...outputAdapterDefList.map((it) => ({ [it.id]: it }))
);
