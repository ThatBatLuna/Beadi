import clsx from "clsx";
import { FunctionComponent, useState } from "react";

type TextInputProps = {
  label: string;
  value: string;
  id: string;
  onChange?: (value: string) => void;
};
export const TextInput: FunctionComponent<TextInputProps> = ({
  label,
  value,
  id,
  onChange,
}) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-row h-6 px-4 text-white rounded-md bg-primary-600 hover:bg-primary-500 hover:focus-within:bg-primary-1100 focus-within:bg-primary-1100">
      {!editing && (
        <label htmlFor={id} className="block grow">
          {label}
        </label>
      )}
      <div
        className={clsx("flex flex-row justify-end w-0 overflow-visible", {
          "grow justify-start": editing,
        })}
      >
        <input
          id={id}
          className={clsx("bg-transparent focus:outline-none", {
            "text-start w-full": editing,
            "text-end": !editing,
          })}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          placeholder="name"
          value={value}
        />
      </div>
    </div>
  );
};
