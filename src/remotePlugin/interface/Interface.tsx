import { FunctionComponent } from "react";
import { Widget, useInterfaceDisplayStateStore } from "./interfaceStores";
import { SliderWidget } from "../widgets/SliderWidget";
import { remoteWidgetDefs } from "../registry";

type InterfaceEntryProps = {
  widget: Widget;
  interfaceId: string;
};
export const InterfaceEntry: FunctionComponent<InterfaceEntryProps> = ({ widget, interfaceId }) => {
  const WidgetComponent = remoteWidgetDefs[widget.widgetType].display;
  if (WidgetComponent === undefined) {
    return <p>Invalid widget {widget.widgetType}</p>;
  }
  return <WidgetComponent settings={widget.settings} interfaceId={interfaceId} widgetId={widget.widgetId}></WidgetComponent>;
};

type InterfaceProps = {
  interfaceId: string;
};
export const Interface: FunctionComponent<InterfaceProps> = ({ interfaceId }) => {
  const interfaceState = useInterfaceDisplayStateStore((s) => s.interfaces[interfaceId]);

  return (
    <div>
      <ul>
        {interfaceState.def.layout.map((it) => (
          <li key={it.widgetId}>
            <InterfaceEntry widget={it} interfaceId={interfaceId}></InterfaceEntry>
          </li>
        ))}
      </ul>
    </div>
  );
};
