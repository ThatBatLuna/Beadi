import { AnyNodeDef } from "./engine/node";

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
import { AnyInputAdapterDef, AnyOutputAdapterDef } from "./engine/adapter";
import { remoteInputAdapter, remoteInputFromOutputAdapter } from "./remotePlugin/inputAdapter";
import { remoteOutputAdapter, remoteOutputToInputAdapter } from "./remotePlugin/outputAdapter";
import { outputAdapterNode } from "./nodes/OutputAdapterNode";
import { randomNodeDef } from "./nodes/RandomNode";
import { memoryNodeDef } from "./nodes/MemoryNode";
import { Tab, fileTab as fileTabDef } from "./components/Settings";
import { remoteSettingsTab as remoteSettingsTabDef } from "./remotePlugin/RemoteDrawerPage";
import { switchNodeDef } from "./nodes/SwitchNode";
import { positiveWaveNodeDef } from "./nodes/WaveNode";
import { delayNodeDef } from "./nodes/DelayNode";
import { mathNodeDef } from "./nodes/MathNode";
import { constantValueNodeDef } from "./nodes/ConstantValueNode";
import { curveNodeDef } from "./nodes/CurveNode";

const nodeDefList: AnyNodeDef[] = [
  // displayNodeDef,
  constantValueNodeDef as any,
  mathNodeDef as any,
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
  switchNodeDef as any,
  positiveWaveNodeDef as any,
  curveNodeDef as any,
  delayNodeDef as any,
  // commentNodeDef,
  // sensorNodeDef,
  // mediaFurryNodeDef,
  // edgeDetectorNodeDef,
];

export const nodeDefs: Record<string, AnyNodeDef> = Object.assign({}, ...nodeDefList.map((it) => ({ [it.type]: it })));

const inputAdapterDefList: AnyInputAdapterDef[] = [remoteInputAdapter, remoteInputFromOutputAdapter];

export const inputAdapterDefs: Record<string, AnyInputAdapterDef> = Object.assign(
  {},
  ...inputAdapterDefList.map((it) => ({ [it.id]: it }))
);

const outputAdapterDefList: AnyOutputAdapterDef[] = [remoteOutputAdapter, remoteOutputToInputAdapter];

export const outputAdapterDefs: Record<string, AnyOutputAdapterDef> = Object.assign(
  {},
  ...outputAdapterDefList.map((it) => ({ [it.id]: it }))
);

const settingsTabsList: Tab[] = [fileTabDef, remoteSettingsTabDef];

export const settingsTabs: Record<string, Tab> = Object.assign({}, ...settingsTabsList.map((it) => ({ [it.id]: it })));
