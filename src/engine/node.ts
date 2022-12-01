import { ComponentType } from "react";
import { NodeProps } from "reactflow";
import AddNode from "../nodes/AddNode";
import ConstantValueNode from "../nodes/ConstantValueNode";
import DisplayNode from "../nodes/Display";
import ShowCaseNode from "../nodes/ShowcaseNode";

export interface HandleDef {
  id: string;
  label: string;
  type: string;
}

export interface InputHandleDef extends HandleDef {
  terminal?: boolean;
}

export interface OutputHandleDef extends HandleDef {}

export type NodeDef = {
  type: string;
  component: ComponentType<NodeProps<any>>;
  inputs: InputHandleDef[];
  outputs: OutputHandleDef[];
  executor: (input: any[]) => any[];
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
    inputs: [],
    executor: (i) => {
      return i;
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
    executor: ([v]) => {
      return v;
    },
  },
  {
    type: "showCase",
    component: ShowCaseNode,
    outputs: [],
    inputs: [],
    executor: () => {},
  },
];

export const nodeDefs: Record<string, NodeDef> = Object.assign(
  {},
  ...nodeDefList.map((it) => ({ [it.type]: it }))
);
