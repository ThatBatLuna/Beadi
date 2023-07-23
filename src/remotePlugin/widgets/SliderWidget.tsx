import { ChangeEventHandler, FunctionComponent, useCallback, useState } from "react";
import { RemoteWidgetDef, RemoteWidgetProps, RemoteWidgetSettingsProps, useWidgetValueHandle } from "../interface/widget";
import { Select } from "../../components/input/Select";
import { useInterfaceStore } from "../interface/store";

type SliderWidgetSettings = {
  valueId: string;
};

export const SliderWidget: FunctionComponent<RemoteWidgetProps<number, SliderWidgetSettings>> = ({ settings, interfaceId }) => {
  const handle = useWidgetValueHandle<number>(settings.valueId, interfaceId);
  const [interactiveValue, setInteractiveValue] = useState<number>(handle?.localValue ?? 0.0);
  const [focused, setFocused] = useState(false);

  const setValue = (e: number) => {
    handle?.onChange(e);
    setInteractiveValue(e);
  };

  const displayValue = focused ? interactiveValue : handle?.localValue ?? 0.0;

  if (handle === null) {
    return <p>Invalid widget</p>;
  }
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
      <input type="range" min="0" max="1" step="0.01" value={handle.value} disabled={true} />
    </div>
  );
};

export const SliderWidgetSettingsEditor: FunctionComponent<RemoteWidgetSettingsProps<SliderWidgetSettings>> = ({
  settings,
  interfaceId,
  widgetId,
}) => {
  const values = useInterfaceStore((it) => Object.keys(it.interfaces[interfaceId].values).map((valueId) => valueId));
  const save = useInterfaceStore((it) => {
    const source = it.interfaces[interfaceId].source;
    return source.type === "local" ? source.updateWidgets : null;
  });

  const onChange =
    save === null
      ? null
      : (e: string | null) => {
          if (e !== null) {
            save((draft) => {
              const index = draft.findIndex((it) => it.widgetId === widgetId);
              draft[index].settings = {
                valueId: e,
              } satisfies SliderWidgetSettings;
            });
          }
        };

  if (onChange === null) {
    return <div>Invalid Widget</div>;
  }
  return (
    <div>
      <Select
        options={values}
        selected={settings?.valueId ?? null}
        renderOption={(valueId) => <>{valueId}</>}
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
