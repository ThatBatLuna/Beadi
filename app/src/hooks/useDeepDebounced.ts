import _ from "lodash";
import { useRef } from "react";

export function useDeepDebounced<T>(value: T) {
  const data = useRef(value);

  if (!_.isEqual(data.current, value)) {
    data.current = value;
  }

  return data.current;
}

export function useDebouncedWith<T>(value: T, isEqual: (a: T, b: T) => boolean) {
  const data = useRef(value);

  if (!isEqual(data.current, value)) {
    data.current = value;
  }

  return data.current;
}
