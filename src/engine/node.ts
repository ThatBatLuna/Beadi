import { ComponentType } from "react";
import { NodeProps } from "reactflow";

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
  hidden?: boolean;
  min?: number;
  max?: number;
}

export interface OutputHandleDef extends HandleDef {}

export type NodeExecutorProps = {
  committed: Record<string, any>;
  ephermal: Record<string, any>;
  commit: (handle: string, value: any) => void;
};

export type NodeExecutor = (input: any[], props: NodeExecutorProps) => any[];

export type NodeHeaderProps = { id: string; data: any };
export type MobileViewProps = { id: string; data: any };

export type NodeDef = {
  nodeComponent?: ComponentType<NodeProps>;
  label: string;
  publishable?: boolean;
  category: Category;
  type: string;
  header?: ComponentType<NodeHeaderProps>;
  mobileView?: ComponentType<MobileViewProps>;
  inputs: InputHandleDef[];
  outputs: OutputHandleDef[];
  executor: NodeExecutor;
};
