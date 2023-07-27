import { FunctionComponent } from "react";
import { useInterfaceFileStore } from "./stores";
import { Button } from "../../components/input/Button";
import { SliderWidget, SliderWidgetSettingsEditor } from "../widgets/SliderWidget";

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

  return (
    <div>
      <div>Editor for "{iface.name}"</div>;
      <ul>
        {iface.layout.map((it) => (
          <li key={it.widgetId}>
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
