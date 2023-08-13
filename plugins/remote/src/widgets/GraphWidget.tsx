import { FunctionComponent, useEffect, useState } from "react";
import { RemoteWidgetDef, RemoteWidgetProps, RemoteWidgetSettingsProps } from "../interface/widget";
import { useIOValueStore } from "../inputOutputStore";
import { useInterfaceFileStore, useWidgetValueHandle } from "../interface/interfaceStores";
import produce from "immer";
import { Graph, Select } from "@beadi/components";

type GraphWidgetSettings = {
  valueId: string;
};

const HISTORY_LENGTH = 3 * 60;
const HEIGHT = 100;
const MIN_HEIGHT = 1.0;
const SAMPLE_RATE = 60;
export const GraphWidget: FunctionComponent<RemoteWidgetProps<number, GraphWidgetSettings>> = ({ settings, interfaceHandle }) => {
  const handle = useWidgetValueHandle(interfaceHandle, settings.valueId, "number");

  const [preview, setPreview] = useState({ index: 0, history: new Array(HISTORY_LENGTH).fill(0) });

  const getValue = handle.getValue;
  useEffect(() => {
    let timeout = setInterval(() => {
      const value = getValue();
      setPreview((s) =>
        produce(s, (draft) => {
          draft.history[draft.index] = value ?? null;
          draft.index = (draft.index + 1) % HISTORY_LENGTH;
        })
      );
    }, 1000 / SAMPLE_RATE);
    return () => {
      clearInterval(timeout);
    };
  }, [getValue]);

  return (
    <div className="w-full relative my-2 rounded-md">
      <Graph history={preview.history} index={preview.index} fixed={false} height={HEIGHT} minHeight={MIN_HEIGHT} />
    </div>
  );
};

export const GraphWidgetSettingsEditor: FunctionComponent<RemoteWidgetSettingsProps<GraphWidgetSettings>> = ({
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
        } satisfies GraphWidgetSettings;
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

export const graphWidgetDef: RemoteWidgetDef<GraphWidgetSettings> = {
  id: "graph",
  display: GraphWidget,
  settings: GraphWidgetSettingsEditor,
  defaultSettings: null,
};
