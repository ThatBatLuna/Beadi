import { FunctionComponent, useState } from "react";
import { RemoteWidgetDef, RemoteWidgetProps, RemoteWidgetSettingsProps } from "../interface/widget";
import { Select } from "../../components/input/Select";
import { useIOValueStore } from "../inputOutputStore";
import { useInterfaceFileStore, useWidgetValueHandle } from "../interface/interfaceStores";

type SwitchWidgetSettings = {
  valueId: string;
};

export const SwitchWidget: FunctionComponent<RemoteWidgetProps<number, SwitchWidgetSettings>> = ({ settings, interfaceHandle }) => {
  const handle = useWidgetValueHandle(interfaceHandle, settings.valueId, "boolean");
  const [interactiveValue, setInteractiveValue] = useState<boolean>(handle.value ?? false);
  const [focused, setFocused] = useState(false);

  const setValue = (e: boolean) => {
    handle.setValue(e);
    setInteractiveValue(e);
  };

  const displayValue = focused ? interactiveValue : handle.value ?? false;

  return (
    <div className="w-full relative my-2 rounded-md">
      <input
        className="w-full"
        type="checkbox"
        checked={displayValue}
        onFocus={() => {
          setFocused(true);
          setInteractiveValue(handle.value ?? false);
        }}
        onBlur={() => setFocused(false)}
        onChange={(e) => setValue(e.target.checked)}
      />
      <input className="w-full absolute top-2 left-0 pointer-events-none" type="checkbox" checked={handle.value ?? false} disabled={true} />
      {handle.error !== undefined && <div className="absolute inset-0 bg-red-600 opacity-80 rounded-md">{handle.error}</div>}
    </div>
  );
};

export const SwitchWidgetSettingsEditor: FunctionComponent<RemoteWidgetSettingsProps<SwitchWidgetSettings>> = ({
  settings,
  interfaceId,
  widgetId,
}) => {
  const values = useIOValueStore((store) =>
    Object.entries(store.values)
      .filter(([_, value]) => value.type === "boolean")
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
        } satisfies SwitchWidgetSettings;
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

export const switchWidgetDef: RemoteWidgetDef<SwitchWidgetSettings> = {
  id: "switch",
  display: SwitchWidget,
  settings: SwitchWidgetSettingsEditor,
  defaultSettings: null,
};
