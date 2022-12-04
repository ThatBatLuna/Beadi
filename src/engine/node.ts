import { ComponentType } from "react";
import { addNodeDef } from "../nodes/AddNode";
import { constantValueNodeDef } from "../nodes/ConstantValueNode";
import { displayNodeDef } from "../nodes/Display";
import { waveNodeDef } from "../nodes/WaveNode";

export interface HandleDef {
  id: string;
  label: string;
  type: string;
}

export interface InputHandleDef extends HandleDef {
  terminal?: boolean;
  default: any;
}

export interface OutputHandleDef extends HandleDef {}

export type NodeExecutorProps = {
  committed: Record<string, any>;
  commit: (handle: string, value: any) => void;
};

export type NodeExecutor = (input: any[], props: NodeExecutorProps) => any[];

export type NodeHeaderProps = { id: string; data: any };

export type NodeDef = {
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
  addNodeDef,
];

export const nodeDefs: Record<string, NodeDef> = Object.assign(
  {},
  ...nodeDefList.map((it) => ({ [it.type]: it }))
);
