import { AnyRemoteWidgetDef, RemoteWidgetDef } from "./interface/widget";
import { sliderWidgetDef } from "./widgets/SliderWidget";
import { switchWidgetDef } from "./widgets/SwitchWidget";
// import { sliderWidgetDef } from "./widgets/SliderWidget";

const remoteWidgetsList: AnyRemoteWidgetDef[] = [sliderWidgetDef, switchWidgetDef];

export const remoteWidgetDefs: Record<string, AnyRemoteWidgetDef> = Object.assign({}, ...remoteWidgetsList.map((it) => ({ [it.id]: it })));
