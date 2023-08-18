import produce from "immer";
import _ from "lodash";
import { createStore } from "zustand";

type PreviewStore = {
  outputHandlePreviews: Record<string, Record<string, any>>;
  signalLog: Record<string, Record<string, [Date]>>;

  pushSignals: (signals: Record<string, Record<string, any[]>>) => void;
};
export function makePreviewStore() {
  return createStore<PreviewStore>()((set, get) => ({
    outputHandlePreviews: {},
    signalLog: {},

    pushSignals: (signals) => {
      if (_.isEmpty(signals)) {
        return;
      }
      const oldest = new Date().getTime() - 10.0 * 1000.0;
      set((s) =>
        produce(s, (draft) => {
          const sig = _.mapValues(signals, (nodeSignals) => _.mapValues(nodeSignals, (_signals) => [new Date()]));
          console.log(sig);

          _.mergeWith(draft.signalLog, sig, (objValue, srcValue) => {
            if (_.isArray(objValue)) {
              return objValue.concat(srcValue).filter((it) => it.getTime() > oldest);
            }
          });
        })
      );

      console.log("PushSIgnals", signals);
      console.log(get().signalLog);
    },
  }));
}
