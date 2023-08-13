import { FunctionComponent } from "react";
import { RemoteWidgetDef, RemoteWidgetProps, RemoteWidgetSettingsProps } from "../interface/widget";
import { useIOValueStore } from "../inputOutputStore";
import { useInterfaceFileStore, useWidgetSignalHandle } from "../interface/interfaceStores";
import { Button, Select } from "@beadi/components";

type ButtonWidgetSettings = {
  valueId: string;
};

export const ButtonWidget: FunctionComponent<RemoteWidgetProps<number, ButtonWidgetSettings>> = ({ settings, interfaceHandle }) => {
  const handle = useWidgetSignalHandle(interfaceHandle, settings.valueId);

  return (
    <div className="w-full relative my-2 rounded-md">
      <Button onClick={() => handle.emitSignal(undefined)}>Emit</Button>
      {handle.error !== undefined && <div className="absolute inset-0 bg-red-600 opacity-80 rounded-md">{handle.error}</div>}
    </div>
  );
};

export const ButtonWidgetSettingsEditor: FunctionComponent<RemoteWidgetSettingsProps<ButtonWidgetSettings>> = ({
  settings,
  interfaceId,
  widgetId,
}) => {
  const values = useIOValueStore((store) =>
    Object.entries(store.values)
      .filter(([_, value]) => value.type === "impulse")
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
        } satisfies ButtonWidgetSettings;
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

export const buttonWidgetDef: RemoteWidgetDef<ButtonWidgetSettings> = {
  id: "button",
  display: ButtonWidget,
  settings: ButtonWidgetSettingsEditor,
  defaultSettings: null,
};
