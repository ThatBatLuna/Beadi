import { ComponentType } from "react";
import { NodeProps } from "reactflow";
import { ImpulseEmissions } from "./signal";

export type Category = {
  label: string;
  color: string;
};
export type HandleType = "number" | "boolean" | "impulse";
export interface HandleDef {
  // id: string;
  label: string;
  type: HandleType;
}

export interface InputHandleDef extends HandleDef {
  terminal?: boolean;
  default: any;
  hidden?: boolean;
  min?: number;
  max?: number;
}

export interface OutputHandleDef extends HandleDef {}

export type AnyNodeExecutor = NodeExecutor<InputHandleDefs, Record<string, unknown>, OutputHandleDefs, Record<string, unknown>, any>;
export type NodeExecutor<TInputs, TDriverInputs, TOutputs, TDriverOutputs, TPersistence> = (
  input: TInputs,
  persistentData: TPersistence,
  driverInputs: TDriverInputs
) => {
  outputs: TOutputs;
  persistentData: TPersistence;
  driverOutputs: TDriverOutputs;
};

export type InputHandleDefs = Record<string, InputHandleDef>;
export type OutputHandleDefs = Record<string, OutputHandleDef>;

export type NodeHeaderProps = { id: string; data: any };
export type MobileViewProps = { id: string; data: any };

export type DriverProps = {
  nodePersistence: Record<string, any>;
};
export type InputDriver<TDriverInputs> = () => TDriverInputs;
export type OutputDriver<TDriverOutputs> = (outputs: TDriverOutputs) => void;

export type InputTypeOf<THandleDef extends HandleDef> = THandleDef extends { type: "number" }
  ? number
  : THandleDef extends { type: "boolean" }
  ? boolean
  : THandleDef extends { type: "impulse" }
  ? ImpulseEmissions
  : unknown;

export type OutputTypeOf<THandleDef extends HandleDef> = THandleDef extends { type: "impulse" } ? number : InputTypeOf<THandleDef>;

export type InputTypesOf<THandleDefs extends Record<string, InputHandleDef>> = {
  [Key in keyof THandleDefs]: InputTypeOf<THandleDefs[Key]>;
};
export type OutputTypesOf<THandleDefs extends Record<string, OutputHandleDef>> = {
  [Key in keyof THandleDefs]: OutputTypeOf<THandleDefs[Key]>;
};

export type AnyNodeExecutorDef = NodeExecutorDef<InputHandleDefs, Record<string, unknown>, OutputHandleDefs, Record<string, unknown>, any>;
type NodeExecutorDef<
  TInputHandleDefs extends InputHandleDefs,
  TDriverInputs extends Record<string, any>,
  TOutputHandleDefs extends OutputHandleDefs,
  TDriverOutputs extends Record<string, any>,
  TPersistence
> = {
  initialPersistence: TPersistence;
  executor: NodeExecutor<InputTypesOf<TInputHandleDefs>, TDriverInputs, OutputTypesOf<TOutputHandleDefs>, TDriverOutputs, TPersistence>;
  inputDriver?: InputDriver<TDriverInputs>;
  outputDriver?: OutputDriver<TDriverOutputs>;
};

export function nodeDef<
  TInputHandleDefs extends InputHandleDefs,
  TDriverInputs extends Record<string, any>,
  TOutputHandleDefs extends OutputHandleDefs,
  TDriverOutputs extends Record<string, any>,
  TPersistence
>(n: NodeDef<TInputHandleDefs, TDriverInputs, TOutputHandleDefs, TDriverOutputs, TPersistence>) {
  return n;
}

export type AnyNodeDef = NodeDef<InputHandleDefs, Record<string, unknown>, OutputHandleDefs, Record<string, unknown>, any>;
export type NodeDef<
  TInputHandleDefs extends InputHandleDefs,
  TDriverInputs extends Record<string, any>,
  TOutputHandleDefs extends OutputHandleDefs,
  TDriverOutputs extends Record<string, any>,
  TPersistence
> = {
  label: string;
  publishable?: boolean;
  category: Category;
  type: string;
  /** Specifies what should be rendered above the handles */
  header?: ComponentType<NodeHeaderProps>;
  /** Overrides the how the entire node is rendered. Default to the node-shell */
  nodeComponent?: ComponentType<NodeProps>;
  inputs: TInputHandleDefs;
  outputs: TOutputHandleDefs;
  executor: NodeExecutorDef<TInputHandleDefs, TDriverInputs, TOutputHandleDefs, TDriverOutputs, TPersistence>;
};
