import { Button, Typo } from "@beadi/components";
import { FunctionComponent, useMemo } from "react";

//TODO Saves should really be in IndexedDB and not in localstorage

type BeadiSaveFile = {
  name: string;
  content: string;
};
type BeadiSaves = {
  items: BeadiSaveFile[];
};

function load(): BeadiSaves {
  const item = localStorage.getItem("beadi_saves");
  if (item == null) {
    return { items: [] };
  }
  const parsed = JSON.parse(item);
  return parsed;
}

export type SaveSelectorProps = {
  onSaveSelected: (fileName: string) => void;
  onCreateNew: () => void;
};
export const SaveSelector: FunctionComponent<SaveSelectorProps> = ({ onSaveSelected, onCreateNew }) => {
  const saves = useMemo(() => load(), []);

  return (
    <div>
      <Typo>Open File</Typo>
      <ul>
        {saves.items.map((it) => (
          <li key={it.name}>
            <Button onClick={() => onSaveSelected(it.name)}>{it.name}</Button>
          </li>
        ))}
      </ul>
      <Button onClick={() => onCreateNew()}>Create New</Button>
    </div>
  );
};
