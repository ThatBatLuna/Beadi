import { FunctionComponent } from "react";
import { HandleType } from "./node";

export type AnyInputAdapterDef = InputAdapterDef<any, any>;
export type InputAdapterDef<TData, TSettings> = {
  id: string;
  label: string;
  getType: (settings: TSettings) => HandleType;
  getData: (nodeId: string, settings: TSettings) => TData;
  settingsEditor?: FunctionComponent<{ nodeId: string; settings: TSettings; updateSettings: (s: TSettings) => void }>;
};

export type AnyOutputAdapterDef = OutputAdapterDef<any, any>;
export type OutputAdapterDef<TData, TSettings> = {
  id: string;
  label: string;
  getType: (settings: TSettings) => HandleType;
  pushData: (nodeId: string, data: TData) => void;
  settingsEditor?: FunctionComponent<{}>;
};
