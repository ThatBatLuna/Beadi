import { useCallback } from "react";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DataStore {
  handles: Record<string, any>;
  setHandle: (nodeId: string, handleId: string, data: any) => void;
  commitData: (data: Record<string, any>) => void;
}

export const useDataStore = create<DataStore>()(
  devtools(
    persist(
      (set) => ({
        handles: {},
        setHandle: (nodeId, handleId, data) =>
          set((state) => ({
            handles: {
              ...state.handles,
              [`${nodeId}__${handleId}`]: data,
            },
          })),
        commitData: (data) => {
          set((state) => ({
            handles: {
              ...state.handles,
              ...data,
            },
          }));
        },
      }),
      {
        name: "data-storage",
      }
    )
  )
);

export type HandleData<T> = [T, (value: T) => void];
export function useHandleData<T>(
  handleType: string,
  nodeId: string,
  handleId: string
): HandleData<T> {
  const value = useDataStore(
    (state) => state.handles[`${nodeId}__input__${handleId}`]
  );
  const setHandle = useDataStore((state) => state.setHandle);
  const setValue = useCallback(
    (value: T) => {
      setHandle(nodeId, `${handleType}__${handleId}`, value);
    },
    [setHandle, nodeId, handleId, handleType]
  );

  return [value as T, setValue];
}

export function useInputHandleData<T>(
  nodeId: string,
  handleId: string
): HandleData<T> {
  return useHandleData("input", nodeId, handleId);
}
export function useCommittedData<T>(nodeId: string, handleId: string): T {
  const value = useDataStore(
    (state) => state.handles[`${nodeId}__commit__${handleId}`]
  );
  return value as T;
}
