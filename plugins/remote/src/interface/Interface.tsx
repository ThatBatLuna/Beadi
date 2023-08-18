import { FunctionComponent } from "react";
import { Widget } from "./interfaceStores";
import { remoteWidgetDefs } from "../registry";
import _ from "lodash";
import { InterfaceHandle } from "./InterfaceList";

type InterfaceEntryProps = {
  widget: Widget;
  interfaceHandle: InterfaceHandle<any>;
};
export const InterfaceEntry: FunctionComponent<InterfaceEntryProps> = ({ widget, interfaceHandle }) => {
  const WidgetComponent = remoteWidgetDefs[widget.widgetType].display;
  if (WidgetComponent === undefined) {
    return <p>Invalid widget {widget.widgetType}</p>;
  }
  return <WidgetComponent settings={widget.settings} interfaceHandle={interfaceHandle} widgetId={widget.widgetId}></WidgetComponent>;
};

type InterfaceProps = {
  interfaceHandle: InterfaceHandle<any>;
};
export const Interface: FunctionComponent<InterfaceProps> = ({ interfaceHandle }) => {
  return (
    <div>
      <ul>
        {interfaceHandle.interfaceDef.layout.map((it) => (
          <li key={it.widgetId}>
            <InterfaceEntry widget={it} interfaceHandle={interfaceHandle}></InterfaceEntry>
          </li>
        ))}
      </ul>
    </div>
  );
};
