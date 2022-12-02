import { sign } from "crypto";
import { ComponentType } from "react";
import { NodeProps } from "reactflow";
import AddNode from "../nodes/AddNode";
import ConstantValueNode from "../nodes/ConstantValueNode";
import DisplayNode from "../nodes/Display";
import ShowCaseNode from "../nodes/ShowcaseNode";
import WaveNode from "../nodes/WaveNode";

export interface HandleDef {
  id: string;
  label: string;
  type: string;
}

export interface InputHandleDef extends HandleDef {
  terminal?: boolean;
}

export interface OutputHandleDef extends HandleDef {}

export type NodeExecutor = (
  input: any[],
  commit: (handle: string, value: any) => void
) => any[];

export type NodeDef = {
  type: string;
  component: ComponentType<NodeProps<any>>;
  inputs: InputHandleDef[];
  outputs: OutputHandleDef[];
  executor: NodeExecutor;
};

const nodeDefList: NodeDef[] = [
  {
    type: "constantValue",
    component: ConstantValueNode,
    outputs: [
      {
        id: "value",
        label: "Value",
        type: "number",
      },
    ],
    inputs: [
      {
        id: "value",
        label: "Value",
        type: "number",
      },
    ],
    executor: (i) => {
      return i;
    },
  },
  {
    type: "wave",
    component: WaveNode,
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
        label: "Value",
        type: "number",
      },
    ],
    executor: (i) => {
      return [Math.sin(Date.now() / 1000)];
    },
  },
  {
    type: "add",
    component: AddNode,
    outputs: [
      {
        id: "sum",
        label: "Sum",
        type: "number",
      },
    ],
    inputs: [
      {
        id: "a",
        label: "Value",
        type: "number",
      },
      {
        id: "b",
        label: "Value",
        type: "number",
      },
    ],
    executor: ([a, b]) => {
      return [a + b];
    },
  },
  {
    type: "display",
    component: DisplayNode,
    outputs: [],
    inputs: [
      {
        terminal: true,
        id: "value",
        label: "Value",
        type: "number",
      },
    ],
    executor: ([v], commit) => {
      commit("display", v);
      return [];
    },
  },
  {
    type: "showCase",
    component: ShowCaseNode,
    outputs: [],
    inputs: [],
    executor: () => [],
  },
];

export const nodeDefs: Record<string, NodeDef> = Object.assign(
  {},
  ...nodeDefList.map((it) => ({ [it.type]: it }))
);
