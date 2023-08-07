import { FunctionComponent, useState } from "react";
import { RemoteWidgetDef, RemoteWidgetProps, RemoteWidgetSettingsProps } from "../interface/widget";
import { Select } from "../../components/input/Select";
import { useIOValueStore } from "../inputOutputStore";
import { useInterfaceFileStore, useWidgetValueHandle } from "../interface/interfaceStores";

type SliderWidgetSettings = {
  valueId: string;
};

export const SliderWidget: FunctionComponent<RemoteWidgetProps<number, SliderWidgetSettings>> = ({ settings, interfaceHandle }) => {
  const handle = useWidgetValueHandle(interfaceHandle, settings.valueId, "number");
  const [interactiveValue, setInteractiveValue] = useState<number>(handle.value?.value ?? 0.0);
  const [focused, setFocused] = useState(false);

  const setValue = (e: number) => {
    handle.setValue(e);
    setInteractiveValue(e);
  };

  const displayValue = focused ? interactiveValue : handle.value?.value ?? 0.0;

  return (
    <div className="w-full relative my-2 rounded-md">
      <div>{handle.value?.name}</div>
      <div className="w-full relative">
        <input
          className="w-full"
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={displayValue}
          onFocus={() => {
            setFocused(true);
            setInteractiveValue(handle.value?.value ?? 0.0);
          }}
          onBlur={() => setFocused(false)}
          onChange={(e) => setValue(parseFloat(e.target.value))}
        />
        <input
          className="w-full absolute top-2 left-0 pointer-events-none"
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={handle.value?.value ?? 0.0}
          disabled={true}
        />
      </div>
      {handle.error !== undefined && <div className="absolute inset-0 bg-red-600 opacity-80 rounded-md">{handle.error}</div>}
    </div>
  );
};

export const SliderWidgetSettingsEditor: FunctionComponent<RemoteWidgetSettingsProps<SliderWidgetSettings>> = ({
  settings,
  interfaceId,
  widgetId,
}) => {
  const values = useIOValueStore((store) =>
    Object.entries(store.values)
      .filter(([_, value]) => value.type === "number")
      .map(([key, _]) => key)
  );
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
