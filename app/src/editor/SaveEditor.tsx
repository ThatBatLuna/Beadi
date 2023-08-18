import { useBeadi, BeadiInstance, BeadiEditor } from "@beadi/engine";
import { FunctionComponent, useMemo } from "react";

function loadSaveFile(name: string): Record<string, unknown> {
  const item = localStorage.getItem("beadi_saves");
  if (item == null) {
    return {};
  }
  const parsed = JSON.parse(item);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return parsed?.items?.find((it: any) => it.name === name)?.content ?? {};
}

//TODO Ok yea this is really stupid, we are reading and reencoding ALL existing files ...
//And this method is called on EVERY CHANGE which is OFTEN
function writeSaveFile(name: string, data: Record<string, unknown>) {
  const item = localStorage.getItem("beadi_saves") ?? `{"items": []}`;
  const parsed = JSON.parse(item);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const file = parsed.items.find((it: any) => it.name === name);
  if (file != null) {
    file.content = data;
  } else {
    parsed.items.push({
      name: name,
      content: data,
    });
  }

  // console.log("Saving all: ", parsed);

  localStorage.setItem("beadi_saves", JSON.stringify(parsed));
}

type SaveEditorProps = {
  saveFile: string;
};
export const SaveEditor: FunctionComponent<SaveEditorProps> = ({ saveFile }) => {
  const beadiContext = useBeadi();
  const instance = useMemo(() => {
    const file = loadSaveFile(saveFile);
    if (file === null) {
      return null;
    }
    return new BeadiInstance({
      beadiContext,
      initialData: file,
      writePersistentData: (data) => {
        writeSaveFile(saveFile, data);
      },
    });
  }, [beadiContext, saveFile]);

  if (instance !== null) {
    return <BeadiEditor instance={instance}></BeadiEditor>;
  }
  return <p>TODO Error when loading file</p>;
};
