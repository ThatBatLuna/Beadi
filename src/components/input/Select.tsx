import _ from "lodash";
import {
  ChangeEventHandler,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

type SelectProps<T> = {
  options: T[];
  selected: T | null;
  allowUnselect?: boolean;
  renderOption: (value: T) => ReactNode;
  onSelect?: (value: T | null) => void;
};
export function Select<T>({
  options,
  selected,
  onSelect,
  renderOption,
  allowUnselect,
}: SelectProps<T>) {
  const optionMap = useMemo(() => {
    return _.chain(options)
      .map((it, index) => [index, it])
      .fromPairs()
      .value();
  }, [options]);

  const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      onSelect?.(optionMap[e.target.value]);
    },
    [onSelect, optionMap]
  );

  const isSelected = useCallback(
    (it: T | null) => {
      return _.isEqual(it, selected);
    },
    [selected]
  );

  return (
    <select
      onChange={onChange}
      className="bg-slate-800 text-white rounded-md h-6 px-4"
    >
      {(isSelected(null) || allowUnselect === true) && (
        <option key="none" selected={isSelected(null)}></option>
      )}
      {Object.entries(optionMap).map(([key, value]) => (
        <option key={key} value={key} selected={isSelected(value)}>
          {renderOption(value)}
        </option>
      ))}
    </select>
  );
}
