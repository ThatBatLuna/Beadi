import { AnyRemoteWidgetDef, RemoteWidgetDef } from "./builder/widget";
import { sliderWidgetDef } from "./widgets/SliderWidget";

const remoteWidgetsList: AnyRemoteWidgetDef[] = [sliderWidgetDef];

export const remoteWidgets: Record<string, AnyRemoteWidgetDef> = Object.assign({}, ...remoteWidgetsList.map((it) => ({ [it.id]: it })));
