import _ from "lodash";
import { FunctionComponent, useCallback, useState } from "react";
import { useFileStore } from "../../storage";
import { Button, TextInput } from "@beadi/components";

const LITTERBOX_URL = "https://litter.catbox.moe/";

export const UploadToLitterbox: FunctionComponent<{}> = () => {
  const exportJson = useFileStore((store) => store.exportJson);

  const [code, setCode] = useState("");
  const [link, setLink] = useState("");

  const exp = useCallback(() => {
    const blob = new Blob([JSON.stringify(exportJson(), undefined, 2)], {
      type: "text/plain;charset=utf-8",
    });
    let formdata = new FormData();
    formdata.append("reqtype", "fileupload");
    formdata.append("fileToUpload", blob);
    formdata.append("time", "1h");
    fetch("https://litterbox.catbox.moe/resources/internals/api.php ", {
      method: "POST",
      body: formdata,
    })
      .then((r) => r.text())
      .then((response) => {
        setLink(response);
        setCode(response.replace(LITTERBOX_URL, ""));
      });
  }, [exportJson]);

  return (
    <>
      <Button onClick={() => exp()}>Generate Link using litterbox.catbox.moe</Button>
      {code && (
        <p>
          Litterbox Code:{" "}
          <a href={link} rel="noreferrer" target="_blank">
            {code}
          </a>
        </p>
      )}
    </>
  );
};

export const ImportFromLitterbox: FunctionComponent<{}> = () => {
  const [text, setText] = useState("");
  const overwriteStoreData = useFileStore((store) => store.importJson);

  const imp = useCallback(() => {
    fetch(`${LITTERBOX_URL}${text}`)
      .then((result) => result.json())
      .then((result) => {
        overwriteStoreData(result);
        setText("");
        //TODO VALIDATE THE RESULT
      });
  }, [text, overwriteStoreData, setText]);

  return (
    <>
      <TextInput id="litterboxUrl" label="Litterbox Code" value={text} onChange={setText}></TextInput>
      <Button onClick={() => imp()} disabled={text.trim() === ""}>
        Import from Litterbox
      </Button>
    </>
  );
};
