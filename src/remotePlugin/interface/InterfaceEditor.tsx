import { FunctionComponent } from "react";
import { useInterfaceFileStore } from "./stores";
import { Button } from "../../components/input/Button";
import { SliderWidget, SliderWidgetSettingsEditor } from "../widgets/SliderWidget";
import { MdRemove } from "react-icons/md";

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

  const removeWidget = (widgetId: string) => {
    updateInterface(interfaceId, (draft) => {
      const index = draft.layout.findIndex((it) => it.widgetId === widgetId);
      draft.layout.splice(index, 1);
    });
  };

  return (
    <div>
      <ul className="flex flex-col my-2">
        {iface.layout.map((it) => (
          <li key={it.widgetId} className="block bg-primary-800 p-2 mt-2 rounded-md">
            <Button icon={<MdRemove />} onClick={() => removeWidget(it.widgetId)}></Button>
            <SliderWidgetSettingsEditor
              settings={it.settings}
              interfaceId={interfaceId}
              widgetId={it.widgetId}
            ></SliderWidgetSettingsEditor>
          </li>
        ))}
      </ul>
      <Button onClick={addSlider}>Add slider</Button>
    </div>
  );
};
