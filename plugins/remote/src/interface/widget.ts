import { ComponentType } from "react";
import { InterfaceHandle } from "./InterfaceList";

export type RemoteWidgetProps<_T, TSettings> = {
  settings: TSettings;
  interfaceHandle: InterfaceHandle<any>;
  widgetId: string;
};
export type RemoteWidgetSettingsProps<TSettings> = {
  settings: TSettings | null;
  widgetId: string;
  interfaceId: string;
  // onSave: (settings: TSettings) => void;
};

export type AnyRemoteWidgetDef = RemoteWidgetDef<any>;
export type RemoteWidgetDef<TSettings> = {
  id: string;
  defaultSettings: TSettings | null;
  display: ComponentType<RemoteWidgetProps<any, TSettings>>;
  settings: ComponentType<RemoteWidgetSettingsProps<TSettings>>;
};
