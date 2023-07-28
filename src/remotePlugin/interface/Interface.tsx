import { FunctionComponent } from "react";
import { useInterfaceDisplayStateStore } from "./stores";
import { SliderWidget } from "../widgets/SliderWidget";

type InterfaceProps = {
  interfaceId: string;
};
export const Interface: FunctionComponent<InterfaceProps> = ({ interfaceId }) => {
  const interfaceState = useInterfaceDisplayStateStore((s) => s.interfaces[interfaceId]);

  return (
    <div>
      <ul>
        {interfaceState.layout.map((it) => (
          <li key={it.widgetId}>
            <SliderWidget settings={it.settings} interfaceId={interfaceId} widgetId={it.widgetId}></SliderWidget>
          </li>
        ))}
      </ul>
    </div>
  );
};
