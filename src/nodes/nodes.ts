import { NodeDef } from "../engine/node";

import {
  addNodeDef,
  divideNodeDef,
  multiplyNodeDef,
  subtractNodeDef,
} from "../nodes/AddNode";
import { buttonNodeDef } from "../nodes/ButtonNode";
import { buttplugNodeDef } from "../nodes/ButtplugNode";
import { constantValueNodeDef } from "../nodes/ConstantValueNode";
import { displayNodeDef } from "../nodes/Display";
import { hysteresisNodeDef } from "../nodes/HysteresisNode";
import { memoryNodeDef } from "../nodes/MemoryNode";
import { mixNodeDef } from "../nodes/MixNode";
import { positiveWaveNodeDef } from "../nodes/PositiveWave";
import { randomNodeDef } from "../nodes/RandomNode";
import { timerNodeDef } from "../nodes/TimerNode";
import { clampNodeDef } from "./ClampNode";
import { curveNodeDef } from "./CurveNode";
import { toggleNodeDef } from "./ToggleNode";

const nodeDefList: NodeDef[] = [
  displayNodeDef,
  constantValueNodeDef,
  positiveWaveNodeDef,
  addNodeDef,
  subtractNodeDef,
  divideNodeDef,
  multiplyNodeDef,
  buttplugNodeDef,
  mixNodeDef,
  hysteresisNodeDef,
  memoryNodeDef,
  randomNodeDef,
  timerNodeDef,
  buttonNodeDef,
  toggleNodeDef,
  clampNodeDef,
  curveNodeDef,
];

export const nodeDefs: Record<string, NodeDef> = Object.assign(
  {},
  ...nodeDefList.map((it) => ({ [it.type]: it }))
);
