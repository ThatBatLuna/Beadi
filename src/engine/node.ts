import { ComponentType } from "react";
import {
  addNodeDef,
  divideNodeDef,
  multiplyNodeDef,
  subtractNodeDef,
} from "../nodes/AddNode";
import { buttplugNodeDef } from "../nodes/ButtplugNode";
import { constantValueNodeDef } from "../nodes/ConstantValueNode";
import { displayNodeDef } from "../nodes/Display";
import { hysteresisNodeDef } from "../nodes/HysteresisNode";
import { memoryNodeDef } from "../nodes/MemoryNode";
import { mixNodeDef } from "../nodes/MixNode";
import { positiveWaveNodeDef } from "../nodes/PositiveWave";
import { randomNodeDef } from "../nodes/RandomNode";
import { waveNodeDef } from "../nodes/WaveNode";

export type Category = {
  label: string;
  color: string;
};
export interface HandleDef {
  id: string;
  label: string;
  type: string;
}

export interface InputHandleDef extends HandleDef {
  terminal?: boolean;
  default: any;
  min?: number;
  max?: number;
}

export interface OutputHandleDef extends HandleDef {}

export type NodeExecutorProps = {
  committed: Record<string, any>;
  commit: (handle: string, value: any) => void;
};

export type NodeExecutor = (input: any[], props: NodeExecutorProps) => any[];

export type NodeHeaderProps = { id: string; data: any };

export type NodeDef = {
  label: string;
  category: Category;
  type: string;
  header?: ComponentType<NodeHeaderProps>;
  inputs: InputHandleDef[];
  outputs: OutputHandleDef[];
  executor: NodeExecutor;
};

const nodeDefList: NodeDef[] = [
  displayNodeDef,
  constantValueNodeDef,
  waveNodeDef,
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
];

export const nodeDefs: Record<string, NodeDef> = Object.assign(
  {},
  ...nodeDefList.map((it) => ({ [it.type]: it }))
);
