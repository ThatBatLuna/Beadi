import produce, { Draft } from "immer";
import create from "zustand";
import { useFileStore } from "../engine/store";
import { InputAdapterNodeSettings } from "../nodes/InputAdapterNode";
import { OutputAdapterNodeSettings } from "../nodes/OutputAdapterNode";
import _ from "lodash";

export type ValuePath = {
  sourceId: string;
  valueId: string;
};
type RemoteValueState<T> = {
  valueId: string;
  source: string;
  value: T;
  localValue: T;
};
type RemoteValueSourceData = {
  values: Record<string, RemoteValueSourceValueDef & RemoteValueState<any>>;
  close: () => void;
  updateValue: (valueId: string, value: any) => void;
};

type RemoteValueSourceValueDef = {
  valueId: string;
  type: string;
};

type RemoteValueSourceDef = {
  sourceId: string;
  /** Subscribe to changes, and return an unsubscriber */
  subscribe: (
    updateState: (recipe: (draft: Record<string, Draft<RemoteValueSourceValueDef & RemoteValueState<any>>>) => void) => void
  ) => () => void;
  updateValue: (valueId: string, value: any) => void;
  //   close: () => void;
};

type RemoteValueStore = {
  //   values: Record<string, RemoteValueState<any>>;
  sources: Record<string, RemoteValueSourceData>;

  /** Send value update request */
  updateValue: (valueId: ValuePath, value: any) => void;
  addRemoteValueSource: (source: RemoteValueSourceDef) => void;
};

export const useRemoteValueStore = create<RemoteValueStore>()((set, get) => ({
  values: {},
  sources: {},
  updateValue: (id, value) => {
    set((it) =>
      produce(it, (draft) => {
        draft.sources[id.sourceId].values[id.valueId].localValue = value;
      })
    );
    console.log("Updating: ", id, " to ", value);

    get().sources[id.sourceId].updateValue(id.valueId, value);
  },
  addRemoteValueSource: (source) => {
    if (source.sourceId in get().sources) {
      console.error("Tried to double-register source ", source);
    }
    const unsubscriber = source.subscribe((recipe) => {
      set((it) =>
        produce(it, (draft) => {
          recipe(draft.sources[source.sourceId].values);
        })
      );
    });
    set((it) =>
      produce(it, (draft) => {
        draft.sources[source.sourceId] = {
          close: unsubscriber,
          updateValue: source.updateValue,
          values: {},
        };
      })
    );
  },
}));

export function addLocalSource() {
  useRemoteValueStore.getState().addRemoteValueSource({
    sourceId: "local",
    subscribe: (update) => {
      const unsubscriber = useFileStore.subscribe((state) => {
        const inputAdapterNodes = Object.values(state.data.nodes).filter((it) => {
          if (it.type === "inputAdapter") {
            const settings = it.data.settings as InputAdapterNodeSettings;
            return settings.adapterId === "remoteInput";
            // }else if(it.type === "outputAdapter") {
            //     const settings = it.data.settings as OutputAdapterNodeSettings;
            //     return settings.adapterId === "remoteOutput";
          }
          return false;
        });

        update((valuesDraft) => {
          const localValues = Object.values(valuesDraft).filter((it) => it.source === "local");

          const missingValues = _.differenceWith(inputAdapterNodes, localValues, (node, value) => node.id === value.valueId);
          const extraValues = _.differenceWith(localValues, inputAdapterNodes, (value, node) => node.id === value.valueId);

          return produce(state, (draft) => {
            for (const extra of extraValues) {
              delete valuesDraft[extra.valueId];
            }
            for (const missing of missingValues) {
              valuesDraft[missing.id] = {
                localValue: 0,
                type: "number", //TODO Real type here
                source: "local",
                value: 0,
                valueId: missing.id,
              };
            }
          });
        });
      });
      return unsubscriber;
    },
    updateValue: (id, value) => {
      setTimeout(() => {
        useRemoteValueStore.setState((it) =>
          produce(it, (draft) => {
            draft.sources["local"].values[id].value = value;
            draft.sources["local"].values[id].localValue = value;
          })
        );
      }, 80);
    },
  });
}

export function tempStartLocalSourceWatcher() {
  useFileStore.subscribe((state) => {});
}
