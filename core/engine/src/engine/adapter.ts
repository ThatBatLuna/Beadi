import { FunctionComponent } from "react";
import { BeadiInstance, InputHandleDefs, InputTypesOf, OutputHandleDefs, OutputTypesOf } from "..";

export type AnyInputAdapterDef = InputAdapterDef<any, any>;
export type InputAdapterDef<THandles extends OutputHandleDefs, TSettings> = {
  id: string;
  label: string;
  getTypes: (settings: TSettings | undefined, beadi: BeadiInstance) => THandles | undefined;
  getData: (nodeId: string, settings: TSettings | undefined, beadi: BeadiInstance) => OutputTypesOf<THandles>;
  settingsEditor?: FunctionComponent<InputAdapterSettingsEditorProps<TSettings>>;
};
export type InputAdapterSettingsEditorProps<TSettings> = {
  nodeId: string;
  settings: TSettings | undefined;
  updateSettings: (s: TSettings) => void;
};

export type AnyOutputAdapterDef = OutputAdapterDef<any, any>;
export type OutputAdapterDef<THandles extends InputHandleDefs, TSettings> = {
  id: string;
  label: string;
  getTypes: (settings: TSettings | undefined, beadi: BeadiInstance) => THandles | undefined;
  pushData: (nodeId: string, data: InputTypesOf<THandles>, settings: TSettings | undefined, beadi: BeadiInstance) => void;
  settingsEditor?: FunctionComponent<OutputAdapterSettingsEditorProps<TSettings>>;
};

export type OutputAdapterSettingsEditorProps<TSettings> = {
  nodeId: string;
  settings: TSettings | undefined;
  updateSettings: (s: TSettings) => void;
};

export function outputAdapterDef<THandles extends InputHandleDefs, TSettings>(t: OutputAdapterDef<THandles, TSettings>) {
  return t;
}
export function inputAdapterDef<THandles extends OutputHandleDefs, TSettings>(t: InputAdapterDef<THandles, TSettings>) {
  return t;
}
