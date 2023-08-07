import { FunctionComponent, useState } from "react";
import { MdDriveFileRenameOutline } from "react-icons/md";

type EditableNodeTitleProps = {
  title: string | undefined;
  emptyLabel: string;
  onChange: (s: string) => void;
};
export const EditableNodeTitle: FunctionComponent<EditableNodeTitleProps> = ({ title, emptyLabel, onChange }) => {
  const [edit, setEdit] = useState(false);
  return (
    <h1
      className="flex flex-row w-full group"
      onDoubleClick={() => setEdit(true)}
      onBlur={() => setEdit(false)}
      onMouseDownCapture={(e) => edit && e.stopPropagation()}
    >
      {edit ? (
        <input
          className="px-4 w-full bg-black/75 text-white rounded-t-md z-10"
          type="text"
          onChange={(e) => onChange(e.target.value)}
          value={title}
          autoFocus={true}
          placeholder="Node Name"
        />
      ) : (
        <div className="px-4 flex flex-row items-center">
          <span>{title ?? emptyLabel}</span>
          <MdDriveFileRenameOutline className="opacity-0 group-hover:opacity-100 cursor-text" />
        </div>
      )}
    </h1>
  );
};
