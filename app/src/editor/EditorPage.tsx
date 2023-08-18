import { FunctionComponent, useState } from "react";
import { SaveSelector } from "./SaveSelector";
import { SaveEditor } from "./SaveEditor";

export const EditorPage: FunctionComponent = () => {
  const [saveFile, setSaveFile] = useState<string | null>(sessionStorage.getItem("open_file"));

  const openSave = (save: string) => {
    sessionStorage.setItem("open_file", save);
    setSaveFile(save);
  };

  if (saveFile === null) {
    return <SaveSelector onSaveSelected={(s) => setSaveFile(s)} onCreateNew={() => openSave(`TODO_NEW_FILENAME${new Date().getTime()}`)} />;
  } else {
    return <SaveEditor saveFile={saveFile}></SaveEditor>;
  }
};
