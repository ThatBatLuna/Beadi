import _ from "lodash";
import { ChangeEventHandler, ReactNode, useCallback, useMemo } from "react";

const NULL_TEXT = "unselect";

type SelectProps<T> = {
  readonly options: readonly T[];
  selected: T | null;
  allowUnselect?: boolean;
  renderOption: (value: T) => ReactNode;
  onSelect?: (value: T | null) => void;
};
export function Select<T>({ options, selected, onSelect, renderOption, allowUnselect }: SelectProps<T>) {
  const optionMap = useMemo(() => {
    return _.chain(options)
      .map((it, index) => [index, it])
      .fromPairs()
      .value();
  }, [options]);

  const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      if (e.target.value === NULL_TEXT) {
        onSelect?.(null);
      } else {
        onSelect?.(optionMap[e.target.value]);
      }
    },
    [onSelect, optionMap]
  );

  const isSelected = useCallback(
    (it: T | null) => {
      return _.isEqual(it, selected);
    },
    [selected]
  );

  const selectedKey = useMemo(() => {
    for (const key in optionMap) {
      if (_.isEqual(optionMap[key], selected)) {
        return key;
      }
    }
    return "none";
  }, [optionMap, selected]);

  return (
    <select onChange={onChange} className="h-6 px-4 text-white rounded-md bg-primary-1100 w-full" value={selectedKey ?? NULL_TEXT}>
      {(isSelected(null) || allowUnselect === true) && <option key="none" value={NULL_TEXT}></option>}
      {Object.entries(optionMap).map(([key, value]) => (
        <option key={key} value={key}>
          {renderOption(value)}
        </option>
      ))}
    </select>
  );
}
