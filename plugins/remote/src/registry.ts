import { AnyRemoteWidgetDef } from "./interface/widget";
import { buttonWidgetDef } from "./widgets/ButtonWidget";
import { graphWidgetDef } from "./widgets/GraphWidget";
import { sliderWidgetDef } from "./widgets/SliderWidget";
import { switchWidgetDef } from "./widgets/SwitchWidget";
// import { sliderWidgetDef } from "./widgets/SliderWidget";

const remoteWidgetsList: AnyRemoteWidgetDef[] = [sliderWidgetDef, switchWidgetDef, buttonWidgetDef, graphWidgetDef];

export const remoteWidgetDefs: Record<string, AnyRemoteWidgetDef> = Object.assign({}, ...remoteWidgetsList.map((it) => ({ [it.id]: it })));
