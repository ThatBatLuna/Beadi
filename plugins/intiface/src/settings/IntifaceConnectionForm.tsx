import { Button, CollapsibleCard, TextInput } from "@beadi/components";
import { FormEvent, FunctionComponent, useState } from "react";
import { useIntifaceStore } from "../storage";

type IntifaceConnectionFormProps = {};
export const IntifaceConnectionForm: FunctionComponent<IntifaceConnectionFormProps> = ({}) => {
  const [url, setUrl] = useState("");
  const addConnection = useIntifaceStore((s) => s.addConnection);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const smallUrl = url.trim();
    if (smallUrl.length === 0) {
      return;
    }
    addConnection({
      url: smallUrl.startsWith("ws://") || smallUrl.startsWith("wss://") ? smallUrl : `ws://${smallUrl}`,
    });
    setUrl("");
  };
  return (
    <CollapsibleCard>
      <form onSubmit={onSubmit}>
        <TextInput label="Url" id="url" value={url} onChange={setUrl}></TextInput>
        <Button type="submit">Add</Button>
      </form>
    </CollapsibleCard>
  );
};
