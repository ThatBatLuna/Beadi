import { FunctionComponent } from "react";
import { HandleType } from "./node";

export type AnyInputAdapterDef = InputAdapterDef<any, any>;
export type InputAdapterDef<TData, TSettings> = {
  id: string;
  label: string;
  getType: (settings: TSettings | undefined) => HandleType | undefined;
  getData: (nodeId: string, settings: TSettings | undefined) => TData;
  settingsEditor?: FunctionComponent<InputAdapterSettingsEditorProps<TSettings>>;
};
export type InputAdapterSettingsEditorProps<TSettings> = {
  nodeId: string;
  settings: TSettings | undefined;
  updateSettings: (s: TSettings) => void;
};

export type AnyOutputAdapterDef = OutputAdapterDef<any, any>;
export type OutputAdapterDef<TData, TSettings> = {
  id: string;
  label: string;
  getType: (settings: TSettings | undefined) => HandleType | undefined;
  pushData: (nodeId: string, data: TData, settings: TSettings | undefined) => void;
  settingsEditor?: FunctionComponent<OutputAdapterSettingsEditorProps<TSettings>>;
};

export type OutputAdapterSettingsEditorProps<TSettings> = {
  nodeId: string;
  settings: TSettings | undefined;
  updateSettings: (s: TSettings) => void;
};
