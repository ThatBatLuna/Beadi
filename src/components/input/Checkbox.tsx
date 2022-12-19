import { FunctionComponent } from "react";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
};
export const Checkbox: FunctionComponent<CheckboxProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          onChange={(e) => onChange?.(e.target.checked)}
          checked={checked}
        ></input>
        <span className="px-2">{label}</span>
      </label>
    </div>
  );
};
