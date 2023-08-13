import produce, { Draft } from "immer";
import { devtools, persist } from "zustand/middleware";
import _ from "lodash";
import { useCallback } from "react";
import { InterfaceHandle } from "./InterfaceList";
import { IOValueState } from "../inputOutputStore";
import { HandleType, TypeOfHandleType } from "@beadi/engine";
import { useDynamicStore } from "@beadi/engine";
import { createStore } from "zustand";

export type Widget = {
  widgetId: string;
  widgetType: string;
  settings: any;
};
export type InterfaceDef = {
  name: string;
  interfaceId: string;
  layout: Widget[];
};
//TODO This has to be merged into the save file
type InterfaceFileStore = {
  interfaces: Record<string, InterfaceDef>;
  addInterface: () => void;
  updateInterface: (interfaceId: string, recipe: (draft: Draft<InterfaceDef>) => void) => void;
  deleteInterface: (interfaceId: string) => void;
};
export function makeInterfaceFileStore() {
  return createStore<InterfaceFileStore>()(
    devtools(
      persist(
        (set) => ({
          interfaces: {},
          addInterface: () => {
            const interfaceId = `${new Date().getTime()}`;
            set((s) =>
              produce(s, (draft) => {
                draft.interfaces[interfaceId] = {
                  interfaceId: interfaceId,
                  layout: [],
                  name: "New Interface",
                };
              })
            );
          },
          updateInterface: (interfaceId, recipe) => {
            set((s) =>
              produce(s, (draft) => {
                recipe(draft.interfaces[interfaceId]);
              })
            );
          },
          deleteInterface: (interfaceId) => {
            set((s) =>
              produce(s, (draft) => {
                delete draft.interfaces[interfaceId];
              })
            );
          },
        }),
        {
          name: "interfaceFile",
          getStorage: () => window.localStorage,
          version: 1,
        }
      ),
      { name: "useInterfaceFileStore" }
    )
  );
}
const NULL_SET_VALUE = (_value: any) => {
  console.log("Tried to setValue on an invalid widget");
};
const NULL_GET_VALUE = () => {
  console.log("Tried to getValue on an invalid widget");
  return null;
};
type WidgetValueHandle<T> =
  | {
      value: IOValueState<T>;
      setValue: (n: T) => void;
      getValue: () => T;
      error: undefined;
    }
  | {
      value: null;
      setValue: (n: T) => void;
      getValue: () => null;
      error: string;
    };
export function useWidgetValueHandle<T extends HandleType>(
  // interfacesStoreHandle: AnyStoreHandleSelecting<Record<string, InterfaceDef>>,
  interfaceHandle: InterfaceHandle<any>,
  valueId: string,
  type: T
): WidgetValueHandle<TypeOfHandleType<T>> {
  const getValues = interfaceHandle.valueStoreHandle.getState;
  const selectValues = interfaceHandle.valueStoreHandle.selectData;
  const getValue = useCallback(() => {
    // const iface = useInterfaceDisplayStateStore.getState().interfaces[interfaceId];
    const values = selectValues(getValues());
    if (values === null) {
      return null;
    }
    const value = values[valueId];
    if (value?.type !== type) {
      return null;
    }
    return value.value;
  }, [getValues, selectValues, valueId, type]);

  const updateValue = interfaceHandle.updateValue;
  const setValue = useCallback(
    (v: TypeOfHandleType<T>) => {
      updateValue(valueId, v);
    },
    [valueId, updateValue]
  );

  const values = useDynamicStore(interfaceHandle.valueStoreHandle, (s) => s);
  if (values === null) {
    return {
      value: null,
      setValue: () => NULL_SET_VALUE,
      getValue: NULL_GET_VALUE,
      error: `Invalid store for interface ${interfaceHandle.interfaceDef.interfaceId}`,
    };
  }
  if (values[valueId] === undefined) {
    return {
      value: null,
      setValue: () => NULL_SET_VALUE,
      getValue: NULL_GET_VALUE,
      error: `Value ${valueId} does not exist in Interface ${interfaceHandle.interfaceDef.interfaceId}`,
    };
  }

  const value = values[valueId];
  if (value.type !== type) {
    return {
      value: null,
      setValue: () => NULL_SET_VALUE,
      getValue: NULL_GET_VALUE,
      error: `Value ${valueId} in Interface ${interfaceHandle.interfaceDef.interfaceId} has wrong type: ${value.type} (${type} was expected)`,
    };
  }

  return {
    value: value,
    getValue,
    setValue,
    error: undefined,
  };
}

type WidgetSignalHandle<T> =
  | {
      emitSignal: (data: T) => void;
      error: undefined;
    }
  | {
      emitSignal: (n: T) => void;
      error: string;
    };
export function useWidgetSignalHandle<T>(interfaceHandle: InterfaceHandle<any>, valueId: string): WidgetSignalHandle<T> {
  // const iface = useInterfaceDisplayStateStore((s) => s.interfaces[interfaceId]);

  const ifaceEmitSignal = interfaceHandle.emitSignal;
  const emitSignal = useCallback(
    (v: T) => {
      ifaceEmitSignal(valueId, v);
    },
    [valueId, ifaceEmitSignal]
  );

  const values = useDynamicStore(interfaceHandle.valueStoreHandle, (s) => s);
  if (values === null) {
    return {
      emitSignal: () => NULL_SET_VALUE,
      error: `Invalid store for interface ${interfaceHandle.interfaceDef.interfaceId}`,
    };
  }
  if (values[valueId] === undefined) {
    return {
      emitSignal: () => NULL_SET_VALUE,
      error: `Value ${valueId} does not exist in Interface ${interfaceHandle.interfaceDef.interfaceId}`,
    };
  }

  const value = values[valueId];
  if (value.type !== "impulse") {
    return {
      emitSignal: () => NULL_SET_VALUE,
      error: `Value ${valueId} in Interface ${interfaceHandle.interfaceDef.interfaceId} has wrong type: ${value.type} ('impulse' was expected)`,
    };
  }

  return {
    emitSignal,
    error: undefined,
  };
}
