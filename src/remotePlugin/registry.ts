import { AnyRemoteWidgetDef, RemoteWidgetDef } from "./interface/widget";
import { buttonWidgetDef } from "./widgets/ButtonWidget";
import { sliderWidgetDef } from "./widgets/SliderWidget";
import { switchWidgetDef } from "./widgets/SwitchWidget";
// import { sliderWidgetDef } from "./widgets/SliderWidget";

const remoteWidgetsList: AnyRemoteWidgetDef[] = [sliderWidgetDef, switchWidgetDef, buttonWidgetDef];

export const remoteWidgetDefs: Record<string, AnyRemoteWidgetDef> = Object.assign({}, ...remoteWidgetsList.map((it) => ({ [it.id]: it })));
