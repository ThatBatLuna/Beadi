import clsx from "clsx";
import { FunctionComponent, useState } from "react";

type TextInputProps = {
  label: string;
  value: string;
  id: string;
  onChange: (value: string) => void;
};
export const TextInput: FunctionComponent<TextInputProps> = ({
  label,
  value,
  id,
  onChange,
}) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-slate-800 flex flex-row rounded-md px-4 text-white focus-within:bg-black h-6">
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
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          placeholder="name"
          value={value}
        />
      </div>
    </div>
  );
};
