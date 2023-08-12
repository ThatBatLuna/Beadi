import clsx from "clsx";
import { FunctionComponent, useState } from "react";

type TextInputProps = {
  label?: string;
  value: string;
  name?: string;
  id: string;
  onChange?: (value: string) => void;
};
export const TextInput: FunctionComponent<TextInputProps> = ({ label, value, name, id, onChange }) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-row h-12 px-4 text-white rounded-md md:h-6 bg-primary-600 hover:bg-primary-500 hover:focus-within:bg-primary-1100 focus-within:bg-primary-1100">
      {!editing && label && (
        <label htmlFor={id} className="block my-auto grow">
          {label}
        </label>
      )}
      {!label && <div className="block my-auto"></div>}
      <div
        className={clsx("flex flex-row justify-end w-0 overflow-visible", {
          "grow justify-start": editing || !label,
        })}
      >
        <input
          id={id}
          className={clsx("bg-transparent focus:outline-none w-full", {
            "text-start w-full": editing,
            "text-end": !editing && label,
          })}
          name={name ?? label}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          placeholder={editing ? label : "..."}
          value={value}
        />
      </div>
    </div>
  );
};
