import { ComponentType, FunctionComponent, useCallback } from "react";

export type RemoteWidgetProps<T, TSettings> = {
  settings: TSettings;
  interfaceId: string;
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

type WidgetValueHandle<T> = null | {
  value: T;
  localValue: T;
  onChange: (value: T) => void;
};