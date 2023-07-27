import { ChangeEventHandler, FunctionComponent, useCallback, useState } from "react";
import { RemoteWidgetDef, RemoteWidgetProps, RemoteWidgetSettingsProps } from "../interface/widget";
import { Select } from "../../components/input/Select";
import { useIOValueStore } from "../inputOutputStore";
import { useInterfaceFileStore, useWidgetValueHandle } from "../interface/stores";

type SliderWidgetSettings = {
  valueId: string;
};

export const SliderWidget: FunctionComponent<RemoteWidgetProps<number, SliderWidgetSettings>> = ({ settings, interfaceId }) => {
  const handle = useWidgetValueHandle<number>(settings.valueId, interfaceId);
  const [interactiveValue, setInteractiveValue] = useState<number>(handle.value ?? 0.0);
  const [focused, setFocused] = useState(false);

  const setValue = (e: number) => {
    handle.setValue(e);
    setInteractiveValue(e);
  };

  const displayValue = focused ? interactiveValue : handle.value ?? 0.0;

  if (handle.error !== undefined) {
    return <p>Invalid widget: {handle.error}</p>;
  }
  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={displayValue}
        onFocus={() => {
          setFocused(true);
          setInteractiveValue(handle.value);
        }}
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
  const values = useIOValueStore((store) => Object.keys(store.values));
  // const values = useInterfaceStore((it) => Object.keys(it.interfaces[interfaceId].values).map((valueId) => valueId));
  const save = useInterfaceFileStore((it) => it.updateInterface);

  const onChange = (e: string | null) => {
    if (e !== null) {
      save(interfaceId, (draft) => {
        const index = draft.layout.findIndex((it) => it.widgetId === widgetId);
        draft.layout[index].settings = {
          valueId: e,
        } satisfies SliderWidgetSettings;
      });
    }
  };

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
