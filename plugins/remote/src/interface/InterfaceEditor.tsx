import { FunctionComponent } from "react";
import { InterfaceDef, Widget, useInterfaceFileStore } from "./interfaceStores";
import { MdRemove } from "react-icons/md";
import { remoteWidgetDefs } from "../registry";
import { Button } from "@beadi/components";

type InterfaceEditorEntryProps = {
  widget: Widget;
  interfaceId: string;
};
export const InterfaceEditorEntry: FunctionComponent<InterfaceEditorEntryProps> = ({ widget, interfaceId }) => {
  const updateInterface = useInterfaceFileStore((s) => s.updateInterface);
  const removeWidget = (widgetId: string) => {
    updateInterface(interfaceId, (draft) => {
      const index = draft.layout.findIndex((it) => it.widgetId === widgetId);
      draft.layout.splice(index, 1);
    });
  };
  const WidgetComponent = remoteWidgetDefs[widget.widgetType].settings;
  if (WidgetComponent === undefined) {
    return <p>Invalid widget {widget.widgetType}</p>;
  }

  return (
    <>
      <Button icon={<MdRemove />} onClick={() => removeWidget(widget.widgetId)}></Button>
      <WidgetComponent settings={widget.settings} interfaceId={interfaceId} widgetId={widget.widgetId}></WidgetComponent>
    </>
  );
};

type InterfaceEditorProps = {
  interfaceDef: InterfaceDef;
};

export const InterfaceEditor: FunctionComponent<InterfaceEditorProps> = ({ interfaceDef }) => {
  const iface = useInterfaceFileStore((s) => s.interfaces[interfaceDef.interfaceId]);
  const updateInterface = useInterfaceFileStore((s) => s.updateInterface);

  const addWidget = (type: string) => {
    const id = `${new Date().getTime()}`;
    updateInterface(interfaceDef.interfaceId, (draft) => {
      draft.layout.push({
        settings: {},
        widgetId: id,
        widgetType: type,
      });
    });
  };

  return (
    <div>
      <ul className="flex flex-col my-2">
        {iface.layout.map((it) => (
          <li key={it.widgetId} className="block bg-primary-800 p-2 mt-2 rounded-md">
            <InterfaceEditorEntry widget={it} interfaceId={interfaceDef.interfaceId}></InterfaceEditorEntry>
          </li>
        ))}
      </ul>
      {Object.values(remoteWidgetDefs).map((value, index) => (
        <Button onClick={() => addWidget(value.id)} key={value.id}>
          Add {value.id}
        </Button>
      ))}
    </div>
  );
};
