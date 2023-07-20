import { ComponentType } from "react";
import { NodeProps } from "reactflow";
import { ImpulseEmissions } from "./signal";
import { BeadiNodeData } from "./store";

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

export type NodeHeaderProps<TDisplaySettings, TSettings, THandles extends Record<string, any>> = {
  id: string;
  data: BeadiNodeData<TDisplaySettings, TSettings, THandles>;
};
export type MobileViewProps = { id: string; data: any };

export type NodeContext<TSettings> = {
  id: string;
  settings: TSettings;
};

export type DriverProps = {
  nodePersistence: Record<string, any>;
};
export type InputDriver<TDriverInputs, TSettings> = (context: NodeContext<TSettings>) => TDriverInputs;
export type OutputDriver<TDriverOutputs, TSettings> = (outputs: TDriverOutputs, context: NodeContext<TSettings>) => void;

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

export type AnyNodeExecutorDef = NodeExecutorDef<
  InputHandleDefs,
  Record<string, unknown>,
  OutputHandleDefs,
  Record<string, unknown>,
  any,
  any
>;
type NodeExecutorDef<
  TInputHandleDefs extends InputHandleDefs,
  TDriverInputs extends Record<string, any>,
  TOutputHandleDefs extends OutputHandleDefs,
  TDriverOutputs extends Record<string, any>,
  TPersistence,
  TSettings
> = {
  initialPersistence: TPersistence;
  executor: NodeExecutor<InputTypesOf<TInputHandleDefs>, TDriverInputs, OutputTypesOf<TOutputHandleDefs>, TDriverOutputs, TPersistence>;
  inputDriver?: InputDriver<TDriverInputs, TSettings>;
  outputDriver?: OutputDriver<TDriverOutputs, TSettings>;
};

export function nodeDef<TSettings>() {
  return <
    TInputHandleDefs extends InputHandleDefs,
    TDriverInputs extends Record<string, any>,
    TOutputHandleDefs extends OutputHandleDefs,
    TDriverOutputs extends Record<string, any>,
    TPersistence,
    THeaderProps extends NodeHeaderProps<any, TSettings, InputTypesOf<TInputHandleDefs>>
  >(
    n: NodeDef<TInputHandleDefs, TDriverInputs, TOutputHandleDefs, TDriverOutputs, TPersistence, TSettings, THeaderProps>
  ) => {
    return n;
  };
}

export type AnyNodeDef = NodeDef<InputHandleDefs, Record<string, unknown>, OutputHandleDefs, Record<string, unknown>, any, any, any>;
export type NodeDef<
  TInputHandleDefs extends InputHandleDefs,
  TDriverInputs extends Record<string, any>,
  TOutputHandleDefs extends OutputHandleDefs,
  TDriverOutputs extends Record<string, any>,
  TPersistence,
  TSettings,
  THeaderProps extends NodeHeaderProps<any, TSettings, InputTypesOf<TInputHandleDefs>>
> = {
  label: string;
  publishable?: boolean;
  category: Category;
  type: string;
  /** Specifies what should be rendered above the handles */
  header?: ComponentType<THeaderProps>;
  /** Overrides the how the entire node is rendered. Default to the node-shell */
  nodeComponent?: ComponentType<NodeProps>;
  inputs: TInputHandleDefs;
  outputs: TOutputHandleDefs;
  executor: NodeExecutorDef<TInputHandleDefs, TDriverInputs, TOutputHandleDefs, TDriverOutputs, TPersistence, TSettings>;
};
