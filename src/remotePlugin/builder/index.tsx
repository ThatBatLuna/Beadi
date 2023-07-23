import { FunctionComponent, useCallback } from "react";
import { WidgetInstance, useRemoteFileStore } from "./store";
import { remoteWidgets } from "../registry";
import { useRemoteValueStore } from "../remoteValueStore";
import _ from "lodash";
import { Button } from "../../components/input/Button";

type WidgetDisplayProps<TSettings> = {
  instance: WidgetInstance<TSettings>;
};
const WidgetDisplay: FunctionComponent<WidgetDisplayProps<any>> = ({ instance }) => {
  const widgetDef = remoteWidgets[instance.type];

  if (widgetDef === undefined) {
    return <p>Unknown widget {instance.type}</p>;
  }

  if (instance.settings === null) {
    const Display = widgetDef.settings;
    return <Display settings={instance.settings} widgetId={instance.id}></Display>;
  } else {
    const Display = widgetDef.display;
    return <Display settings={instance.settings} widgetId={instance.id}></Display>;
  }
};

export const RemoteInterfaceBuilder: FunctionComponent<{}> = () => {
  const widgets = useRemoteFileStore((s) => s.data.widgets);

  const addWidget = useRemoteFileStore((s) => s.addWidget);

  const makeWidget = useCallback(
    (id: string) => {
      const widgetId = new Date().getTime();
      addWidget({
        id: `${id}_${widgetId}`,
        type: id,
        settings: _.cloneDeep(remoteWidgets[id].defaultSettings),
      });
    },
    [addWidget]
  );

  return (
    <div>
      <ul>
        {widgets.map((it) => (
          <li key={it.id}>
            <WidgetDisplay instance={it}></WidgetDisplay>
          </li>
        ))}
      </ul>
      <ul>
        {Object.entries(remoteWidgets).map(([id, def]) => (
          <li key={id}>
            <Button onClick={() => makeWidget(def.id)}>Add {def.id}</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
