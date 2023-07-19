import { AnyNodeDef, NodeDef } from "./engine/node";

// import {
//   addNodeDef,
//   divideNodeDef,
//   multiplyNodeDef,
//   subtractNodeDef,
// } from "../nodes/AddNode";
import { buttonNodeDef } from "./nodes/ButtonNode";
import { timerNodeDef } from "./nodes/TimerNode";
import { inputAdapterNode } from "./nodes/InputAdapterNode";
import { toggleNodeDef } from "./nodes/ToggleNode";
import { AnyInputAdapterDef, AnyOutputAdapterDef, InputAdapterDef } from "./engine/adapter";
import { remoteInputAdapter, testRemoteInputAdapter } from "./remotePlugin/inputAdapter";
import { remoteOutputAdapter, testRemoteOutputAdapter } from "./remotePlugin/outputAdapter";
import { outputAdapterNode } from "./nodes/OutputAdapterNode";
import { randomNodeDef } from "./nodes/RandomNode";
import { memoryNodeDef } from "./nodes/MemoryNode";

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
  memoryNodeDef as any,
  randomNodeDef as any,
  timerNodeDef as any,
  buttonNodeDef as any,
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