import { ComponentType, FunctionComponent, useCallback } from "react";
import { useInterfaceStore } from "./store";

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
export function useWidgetValueHandle<T>(valueId: string, interfaceId: string): WidgetValueHandle<T> {
  const value = useInterfaceStore((s) => s.interfaces[interfaceId]?.values?.[valueId]);
  // const value = useRemoteValueStore((s) => s.sources[valuePath.sourceId]?.values[valuePath.valueId]);

  const updateValue = useInterfaceStore((s) => s.interfaces[interfaceId]?.source?.updateValue);

  const onChange = useCallback(
    (value: any) => {
      updateValue(valueId, value);
    },
    [updateValue, valueId]
  );

  if (value !== undefined) {
    return {
      onChange,
      value: value.value,
      localValue: value.localValue,
    };
  } else {
    return null;
  }
}
