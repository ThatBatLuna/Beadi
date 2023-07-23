import produce, { Draft } from "immer";
import create from "zustand";
import { useIOValueStore } from "../inputOutputStore";
import _ from "lodash";

// ==== INTERFACE SOURCE ====
type RemoteInterfaceSource = {
  destroy: () => void;
  updateValue: (valueId: string, value: any) => void;
} & (
  | {
      canUpdateWidgets: true;
      updateWidgets: (recipe: (draft: Draft<RemoteInterfaceWidget[]>) => void) => void;
      publish: () => void;
    }
  | {
      canUpdateWidgets: false;
    }
);

type RemoteInterfaceSourceFactory = (updateInterface: (recipe: (draft: Draft<RemoteInterface>) => void) => void) => RemoteInterfaceSource;

const interfaceSources: Record<string, RemoteInterfaceSourceFactory> = {
  local: (updateInterface) => {
    useIOValueStore.subscribe((state) => {
      updateInterface((draft) => {
        draft.values = _.mapValues(state.values, (val) => ({
          value: val.value,
          localValue: val.value,
          valueId: val.valueId,
        }));
      });
    });

    return {
      canUpdateWidgets: true,
      updateWidgets: (recipe) => {
        updateInterface((draft) => {
          recipe(draft.widgets);
        });
      },
      updateValue: (valueId, value) => {
        useIOValueStore.getState().updateValue(valueId, value);
      },
      publish: () => {},
      destroy: () => {},
    };
  },
  remote: () => {
    return {
      canUpdateWidgets: false,
      destroy: () => {},
      updateValue: (valueId, value) => {},
    };
  },
};

// ===== INTERFACE STORE ====

type RemoteInterfaceValue<T> = {
  valueId: string;
  value: T;
  localValue: T;
};
export type RemoteInterfaceWidget = {
  widgetId: string;
  type: string;
  settings: any;
};
export interface RemoteInterface {
  id: string;
  //=== VALUES ===
  values: Record<string, RemoteInterfaceValue<any>>;

  // === WIDGETS ===
  widgets: RemoteInterfaceWidget[];

  source: RemoteInterfaceSource;
}

type InterfaceStore = {
  interfaces: Record<string, RemoteInterface>;

  addInterface: (sourceType: string) => string;
};

export const useInterfaceStore = create<InterfaceStore>()((set, get) => ({
  interfaces: {},

  addInterface: (sourceType) => {
    const id = `${new Date().getTime()}`;

    const source = interfaceSources[sourceType]((recipe) => {
      set((s) =>
        produce(s, (draft) => {
          recipe(draft.interfaces[id]);
        })
      );
    });

    set((s) =>
      produce(s, (draft) => {
        draft.interfaces[id] = {
          id,
          values: {},
          widgets: [],
          source,
        };
      })
    );
    return id;
  },
}));
