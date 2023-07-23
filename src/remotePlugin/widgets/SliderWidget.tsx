import { ChangeEventHandler, FunctionComponent, useCallback, useState } from "react";
import { RemoteWidgetDef, RemoteWidgetProps, RemoteWidgetSettingsProps, useWidgetValueHandle } from "../builder/widget";
import { ValuePath, useRemoteValueStore } from "../remoteValueStore";
import { useRemoteFileStore } from "../builder/store";
import { Select } from "../../components/input/Select";

type SliderWidgetSettings = {
  valuePath: ValuePath;
};

export const SliderWidget: FunctionComponent<RemoteWidgetProps<number, SliderWidgetSettings>> = ({ settings }) => {
  const { onChange, value, localValue } = useWidgetValueHandle<number>(settings.valuePath);

  const [interactiveValue, setInteractiveValue] = useState<number>(localValue);
  const [focused, setFocused] = useState(false);

  const setValue = useCallback(
    (e: number) => {
      onChange(e);
      setInteractiveValue(e);
    },
    [onChange]
  );

  const displayValue = focused ? interactiveValue : localValue;

  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={displayValue}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setValue(parseFloat(e.target.value))}
      />
      <input type="range" min="0" max="1" step="0.01" value={value} disabled={true} />
    </div>
  );
};

export const SliderWidgetSettingsEditor: FunctionComponent<RemoteWidgetSettingsProps<SliderWidgetSettings>> = ({ settings, widgetId }) => {
  const values = useRemoteValueStore((it) =>
    Object.entries(it.sources).flatMap(([sourceId, source]) =>
      Object.keys(source.values).map((valueId) => ({
        sourceId,
        valueId,
      }))
    )
  );
  const save = useRemoteFileStore((it) => it.updateWidget);

  const onChange = useCallback(
    (e: ValuePath | null) => {
      if (e !== null) {
        save(widgetId, (widget) => {
          widget.settings = {
            valuePath: e,
          };
        });
      }
    },
    [save, widgetId]
  );

  return (
    <div>
      <Select
        options={values}
        selected={settings?.valuePath ?? null}
        renderOption={(valuePath) => (
          <>
            {valuePath?.sourceId} - {valuePath?.valueId}
          </>
        )}
        allowUnselect={true}
        onSelect={onChange}
      ></Select>
    </div>
  );
};

export const sliderWidgetDef: RemoteWidgetDef<SliderWidgetSettings> = {
  id: "slider",
  display: SliderWidget,
  settings: SliderWidgetSettingsEditor,
  defaultSettings: null,
};
