import {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useButtplugStore } from "./store";

export type ButtplugInstance = any;

export function setButtplugInstance(instance: ButtplugInstance) {
  unstable_batchedUpdates(() => {
    useButtplugStore.getState().setInstance(instance);
  });
}
