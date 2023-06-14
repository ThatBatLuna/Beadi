import FileSaver from "file-saver";
import _ from "lodash";
import { FunctionComponent, useCallback, useState } from "react";
import { useDisplayStore } from "../../engine/store";
import { Button } from "../input/Button";
import { TextInput } from "../input/TextInput";

const LITTERBOX_URL = "https://litter.catbox.moe/";

export const UploadToLitterbox: FunctionComponent<{}> = () => {
  const data = useDisplayStore((store) => ({
    nodes: store.nodes.map((node) =>
      _.pick(node, ["data", "id", "position", "type", "width", "height"])
    ),
    edges: store.edges,
    handles: store.handles,
  }));

  const [code, setCode] = useState("");
  const [link, setLink] = useState("");

  const exp = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, undefined, 2)], {
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
        console.log(response);
        setLink(response);
        setCode(response.replace(LITTERBOX_URL, ""));
      });
  }, [data]);

  return (
    <>
      <Button onClick={() => exp()}>
        Generate Link using litterbox.catbox.moe
      </Button>
      {code &&
      <p>
        Litterbox Code:{" "}
        <a href={link} rel="noreferrer" target="_blank">
          {code}
        </a>
      </p>
      }
    </>
  );
};

export const ImportFromLitterbox: FunctionComponent<{}> = () => {
  const [text, setText] = useState("");
  const overwriteStoreData = useDisplayStore((store) => store.overwrite);

  const imp = useCallback(() => {
    fetch(`${LITTERBOX_URL}${text}`)
      .then((result) => result.json())
      .then((result) => {
        console.log(result);
        overwriteStoreData(result.nodes, result.edges, result.handles);
        setText("")
        //TODO VALIDATE THE RESULT
      });
  }, [text, overwriteStoreData, setText]);

  return (
    <>
      <TextInput
        id="litterboxUrl"
        label="Litterbox Code"
        value={text}
        onChange={setText}
      ></TextInput>
      <Button onClick={() => imp()} disabled={text.trim() === ""}>
        Import from Litterbox
      </Button>
    </>
  );
};
