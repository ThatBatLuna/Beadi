import produce, { Draft } from "immer";
import create from "zustand";
import { LocalRemoteInterfaceSource, localSourceFactory } from "./localSource";
import { remoteSourceFactory } from "./remoteSource";

// ==== INTERFACE SOURCE ====
export type CommonRemoteInterfaceSource<TType extends string> = {
  destroy: () => void;
  updateValue: (valueId: string, value: any) => void;
  type: TType;
};

export type RemoteInterfaceSourceFactory<TProps, T extends CommonRemoteInterfaceSource<string>> = (
  props: TProps,
  updateInterface: (recipe: (draft: Draft<RemoteInterface<T>>) => void) => void,
  getInterface: () => RemoteInterface<T>
) => T;

const interfaceSources = {
  local: localSourceFactory,
  remote: remoteSourceFactory,
} as const;
type AnyRemoteInterfaceSource = ReturnType<(typeof interfaceSources)[keyof typeof interfaceSources]>;

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
export interface RemoteInterface<TSource extends CommonRemoteInterfaceSource<string>> {
  id: string;
  //=== VALUES ===
  values: Record<string, RemoteInterfaceValue<any>>;

  // === WIDGETS ===
  widgets: RemoteInterfaceWidget[];

  source: TSource;
}

type InterfaceStore = {
  interfaces: Record<string, RemoteInterface<AnyRemoteInterfaceSource>>;

  addInterface: <TSourceType extends keyof typeof interfaceSources>(
    sourceType: TSourceType,
    props: Parameters<(typeof interfaceSources)[TSourceType]>[0]
  ) => string;
};

export const useInterfaceStore = create<InterfaceStore>()((set, get) => ({
  interfaces: {},

  addInterface: (sourceType, props) => {
    const id = `${new Date().getTime()}`;

    const source = interfaceSources[sourceType](
      //Any case because this is ensured through the generics of this function
      props as any,
      (recipe) => {
        set((s) =>
          produce(s, (draft) => {
            //Any cast because we know that draft.interfaces[id] has the right type because we are just setting it down below
            recipe(draft.interfaces[id] as any);
          })
        );
      },
      //Any cast because we know that draft.interfaces[id] has the right type because we are just setting it down below
      () => get().interfaces[id] as any
    );

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
