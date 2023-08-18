import { FunctionComponent, useCallback } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Button, NodeShell } from "@beadi/components";
import { BeadiFileData, UnknownBeadiNodeProps, useFileStore } from "@beadi/engine";

// import SimpleWaveExample from "EXAMPLES/SimpleNodes.json";

// const examples = [
//   {
//     name: "Simple Wave",
//     data: SimpleWaveExample,
//   },
//   {
//     name: "Button Control",
//     data: "",
//   },
// ];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const examples: Record<string, any> = {};

//TODO Fix examples
// function importAll(r: any) {
//   r.keys().forEach((key: any) => (examples[key] = r(key)));
// }
// importAll((require as any).context("../../../examples", false, /\.json$/));

export const ExampleList: FunctionComponent = () => {
  const overwriteStore = useFileStore((it) => it.overwrite);
  const loadExample = useCallback(
    (data: BeadiFileData) => {
      overwriteStore(data);
    },
    [overwriteStore]
  );

  return (
    <ul className="flex flex-row flex-wrap gap-2">
      {Object.entries(examples).map(([key, value]) => (
        <li key={key}>
          <Button onClick={() => loadExample(value)} className="text-purple-400 underline">
            {value.name || key}
          </Button>
        </li>
      ))}
    </ul>
  );
};

export const WelcomeNodeContent: FunctionComponent = () => {
  //TODO Reintroduce Changelog
  // const changelog = BEADI_CHANGELOG;
  const changelog = "TODO CHANGELOG";

  return (
    <div className="flex flex-col gap-1 p-2">
      <div className="p-2 overflow-y-scroll rounded-md shadow-inner max-h-52 bg-primary-1000 markdown">
        <ReactMarkdown children={changelog}></ReactMarkdown>
      </div>
    </div>
  );
};

export const WelcomeNode: FunctionComponent<UnknownBeadiNodeProps> = () => {
  return (
    <NodeShell title="Welcome to Beadi" color="#ffffff" style={{ width: 600 }}>
      <WelcomeNodeContent></WelcomeNodeContent>
    </NodeShell>
  );
};
