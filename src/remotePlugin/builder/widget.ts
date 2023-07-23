import { ComponentType, FunctionComponent, useCallback } from "react";
import { ValuePath, useRemoteValueStore } from "../remoteValueStore";

export type RemoteWidgetProps<T, TSettings> = {
  settings: TSettings;
  widgetId: string;
};
export type RemoteWidgetSettingsProps<TSettings> = {
  settings: TSettings | null;
  widgetId: string;
  // onSave: (settings: TSettings) => void;
};

export type AnyRemoteWidgetDef = RemoteWidgetDef<any>;
export type RemoteWidgetDef<TSettings> = {
  id: string;
  defaultSettings: TSettings | null;
  display: ComponentType<RemoteWidgetProps<any, TSettings>>;
  settings: ComponentType<RemoteWidgetSettingsProps<TSettings>>;
};

type WidgetValueHandle<T> = {
  value: T;
  localValue: T;
  onChange: (value: T) => void;
};
export function useWidgetValueHandle<T>(valuePath: ValuePath): WidgetValueHandle<T> {
  const value = useRemoteValueStore((s) => s.sources[valuePath.sourceId]?.values[valuePath.valueId]);

  const updateValue = useRemoteValueStore((s) => s.updateValue);

  const onChange = useCallback(
    (value: any) => {
      updateValue(valuePath, value);
    },
    [updateValue, valuePath]
  );

  return {
    onChange,
    value: value.value,
    localValue: value.localValue,
  };
}
