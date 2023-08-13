import { FunctionComponent, useCallback, useRef } from "react";
import { useFileStore } from "../../engine/store";
import { Button } from "@beadi/components";

export type ImportFromJsonProps = {};
export const ImportFromJson: FunctionComponent<ImportFromJsonProps> = () => {
  const importJson = useFileStore((store) => store.importJson);
  const pickerRef = useRef<HTMLInputElement>(null);

  const onFileChanged: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      console.log("On File Changed: ", e.target.files);
      if (e.target.files?.length == 1) {
        const file = e.target.files.item(0);
        file
          ?.text()
          .then((text) => JSON.parse(text))
          .then((result) => {
            importJson(result);
            if (pickerRef.current) {
              pickerRef.current.value = "";
            }
          });
      }
    },
    [importJson]
  );

  return (
    <>
      <Button Element={"label" as any}>
        <div>Import from File</div>
        <input ref={pickerRef} type="file" onChange={onFileChanged} className="hidden"></input>
      </Button>
    </>
  );
};
