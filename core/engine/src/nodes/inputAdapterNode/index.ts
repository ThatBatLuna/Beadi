import { OutputHandleDefs, nodeDef } from "../../engine/node";
import { categories } from "../category";
import _ from "lodash";
import { InputAdapterNodeHeader } from "./InputAdapterNodeHeader";

export type InputAdapterNodeSettings = {
  adapterId: string | null;
  /** adapterSettings stores settings per adapterId, so that if the adapter is changed the settings are kept */
  adapterSettings: Record<string, any>;
};

export const INPUT_ADAPTER_NODE_ID = "inputAdapter";
export const inputAdapterNode = nodeDef<InputAdapterNodeSettings>()({
  label: "Input",
  category: categories["inout"],
  type: INPUT_ADAPTER_NODE_ID,
  header: InputAdapterNodeHeader,
  outputs: (s, beadi) => {
    if (s.adapterId === null) {
      return {} as OutputHandleDefs;
    }
    const inputAdatperDef = beadi.inputAdapterDefs[s.adapterId];
    if (inputAdatperDef === undefined) {
      return {} as OutputHandleDefs;
    }
    const outputs = inputAdatperDef.getTypes(s.adapterSettings?.[s.adapterId], beadi);
    if (outputs === undefined) {
      return {} as OutputHandleDefs;
    }
    return outputs;
  },
  inputs: {},
  executor: {
    inputDriver: (context, beadi) => {
      if (context.settings.adapterId === null) {
        return {};
      }
      const adapter = beadi.inputAdapterDefs[context.settings.adapterId];
      if (context.settings.adapterId === undefined) {
        return {};
      }
      const settings = context.settings.adapterSettings?.[context.settings.adapterId];
      return { handleValues: adapter.getData(context.id, settings, beadi) };
    },
    outputDriver: () => {},
    initialPersistence: undefined,
    executor: (_a, _b, data) => {
      return {
        outputs: data.handleValues as any,
        driverOutputs: {},
        persistentData: undefined,
      };
    },
  },
});
