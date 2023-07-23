import { FunctionComponent, useCallback } from "react";
import { remoteWidgets } from "../registry";
import _ from "lodash";
import { Button } from "../../components/input/Button";
import { RemoteInterfaceWidget, useInterfaceStore } from "./store";

type WidgetDisplayProps<TSettings> = {
  instance: RemoteInterfaceWidget;
  interfaceId: string;
};
const WidgetDisplay: FunctionComponent<WidgetDisplayProps<any>> = ({ instance, interfaceId }) => {
  const widgetDef = remoteWidgets[instance.type];

  if (widgetDef === undefined) {
    return <p>Unknown widget {instance.type}</p>;
  }

  if (instance.settings === null) {
    const Display = widgetDef.settings;
    return <Display settings={instance.settings} widgetId={instance.widgetId} interfaceId={interfaceId}></Display>;
  } else {
    const Display = widgetDef.display;
    return <Display settings={instance.settings} widgetId={instance.widgetId} interfaceId={interfaceId}></Display>;
  }
};

type RemoteInterfaceBuilderProps = {
  interfaceId: string;
};
export const RemoteInterfaceDisplay: FunctionComponent<RemoteInterfaceBuilderProps> = ({ interfaceId }) => {
  const widgets = useInterfaceStore((s) => s.interfaces[interfaceId].widgets);
  const updateWidgets = useInterfaceStore((s) => {
    const source = s.interfaces[interfaceId].source;
    return source.canUpdateWidgets ? source.updateWidgets : null;
  });
  // const widgets = useRemoteFileStore((s) => s.data.widgets);

  // const addWidget = useRemoteFileStore((s) => s.addWidget);

  const makeWidget =
    updateWidgets === null
      ? null
      : (widgetType: string) => {
          const id = `${widgetType}_${new Date().getTime()}`;
          updateWidgets((draft) => {
            draft.push({
              widgetId: id,
              type: widgetType,
              settings: _.cloneDeep(remoteWidgets[widgetType].defaultSettings),
            });
          });
        };

  return (
    <div>
      <ul>
        {widgets.map((it) => (
          <li key={it.widgetId}>
            <WidgetDisplay instance={it} interfaceId={interfaceId}></WidgetDisplay>
          </li>
        ))}
      </ul>
      {makeWidget && (
        <ul>
          {Object.entries(remoteWidgets).map(([id, def]) => (
            <li key={id}>
              <Button onClick={() => makeWidget(def.id)}>Add {def.id}</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
