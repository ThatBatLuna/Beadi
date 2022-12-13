import _ from "lodash";
import { useRef } from "react";

export function useDeepDebounced<T>(value: T) {
  const data = useRef(value);

  if (!_.isEqual(data.current, value)) {
    data.current = value;
  }

  return data.current;
}
