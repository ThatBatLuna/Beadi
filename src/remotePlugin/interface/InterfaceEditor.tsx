import { FunctionComponent } from "react";
import { Widget, useInterfaceFileStore } from "./stores";
import { Button } from "../../components/input/Button";
import { SliderWidget, SliderWidgetSettingsEditor } from "../widgets/SliderWidget";
import { MdRemove } from "react-icons/md";
import { remoteWidgetDefs } from "../registry";

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
  interfaceId: string;
};

export const InterfaceEditor: FunctionComponent<InterfaceEditorProps> = ({ interfaceId }) => {
  const iface = useInterfaceFileStore((s) => s.interfaces[interfaceId]);
  const updateInterface = useInterfaceFileStore((s) => s.updateInterface);

  const addSlider = () => {
    const id = `${new Date().getTime()}`;
    updateInterface(interfaceId, (draft) => {
      draft.layout.push({
        settings: {},
        widgetId: id,
        widgetType: "slider",
      });
    });
  };
  const addSwitch = () => {
    const id = `${new Date().getTime()}`;
    updateInterface(interfaceId, (draft) => {
      draft.layout.push({
        settings: {},
        widgetId: id,
        widgetType: "switch",
      });
    });
  };
  const addButton = () => {
    const id = `${new Date().getTime()}`;
    updateInterface(interfaceId, (draft) => {
      draft.layout.push({
        settings: {},
        widgetId: id,
        widgetType: "button",
      });
    });
  };

  return (
    <div>
      <ul className="flex flex-col my-2">
        {iface.layout.map((it) => (
          <li key={it.widgetId} className="block bg-primary-800 p-2 mt-2 rounded-md">
            <InterfaceEditorEntry widget={it} interfaceId={interfaceId}></InterfaceEditorEntry>
          </li>
        ))}
      </ul>
      <Button onClick={addSlider}>Add slider</Button>
      <Button onClick={addSwitch}>Add switch</Button>
      <Button onClick={addButton}>Add button</Button>
    </div>
  );
};
