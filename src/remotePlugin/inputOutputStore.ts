import create from "zustand";
import { BeadiNode, FileStore, useFileStore } from "../engine/store";
import produce from "immer";
import _ from "lodash";
import { InputAdapterNodeSettings } from "../nodes/InputAdapterNode";
import { REMOTE_INPUT_ADAPTER_ID, RemoteInputAdapterSettings } from "./inputAdapter";
import { devtools } from "zustand/middleware";
import { diffByKeys } from "../utils/diffBy";

type IOValueState<T> = {
  valueId: string;
  value: T;
  type: string;
  name: string;
  //And additional metadata
};

type IOValueStore = {
  //   values: Record<string, RemoteValueState<any>>;
  values: Record<string, IOValueState<any>>;

  /** Send value update request */
  setValue: (valueId: string, value: any) => void;
};

/** Used by all input-/outputAdapters to push/pull their values from/to */
export const useIOValueStore = create(
  devtools<IOValueStore>(
    (set, get) => ({
      values: {},
      setValue: (id, value) => {
        set((s) =>
          produce(s, (draft) => {
            draft.values[id].value = value;
          })
        );
      },
    }),
    { name: "useIOValueStore" }
  )
);

export function tempSyncIOValueStore() {
  const func = (state: FileStore) => {
    const inputAdapterNodes = _.mapValues(
      _.pickBy(state.data.nodes, (it) => {
        if (it.type === "inputAdapter") {
          const settings = it.data.settings as InputAdapterNodeSettings | undefined;
          if (settings?.adapterId === REMOTE_INPUT_ADAPTER_ID) {
            const adapterSettings = settings.adapterSettings?.[REMOTE_INPUT_ADAPTER_ID] as RemoteInputAdapterSettings | undefined;
            return adapterSettings != null;
          }
          // }else if(it.type === "outputAdapter") {
          //     const settings = it.data.settings as OutputAdapterNodeSettings;
          //     return settings.adapterId === "remoteOutput";
        }
        return false;
      }),
      (node) => {
        const adapterSettings = (node.data.settings as InputAdapterNodeSettings).adapterSettings[
          REMOTE_INPUT_ADAPTER_ID
        ] as RemoteInputAdapterSettings;
        return {
          type: adapterSettings.type,
          valueId: node.id,
          name: node.data.name ?? node.id,
        };
      }
    );
    console.log("inputAdapterNodes: ", inputAdapterNodes);

    useIOValueStore.setState((state) => {
      const localValues = Object.values(state.values);

      // const missingValues = _.differenceWith(inputAdapterNodes, localValues, (node, value) => node.id === value.valueId);
      // const extraValues = _.differenceWith(localValues, inputAdapterNodes, (value, node) => node.id === value.valueId);

      const { extra, missing, changed } = diffByKeys(state.values, inputAdapterNodes, (a, b) => a.type === b.type && a.name === b.name);
      console.log("useIOValueStore setState: ", localValues, "+", missing, " -", extra);

      return produce(state, (draft) => {
        for (const extraKey in extra) {
          delete draft.values[extraKey];
        }
        for (const missingKey in missing) {
          draft.values[missingKey] = {
            type: missing[missingKey].type,
            value: 0.0,
            valueId: missingKey,
            name: missing[missingKey].name,
          };
        }
        console.log("CCC: ", changed);
        for (const changedKey in changed) {
          draft.values[changedKey] = {
            type: changed[changedKey][1].type,
            name: changed[changedKey][1].name,
            value: 0.0,
            valueId: changedKey,
          };
        }
      });
    });
  };

  useFileStore.subscribe(func);

  func(useFileStore.getState());
}
