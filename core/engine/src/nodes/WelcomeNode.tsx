import { FunctionComponent, useCallback } from "react";
import { NodeProps } from "reactflow";
import NodeShell from "../components/node/NodeShell";
import { BeadiFileData, useFileStore } from "../engine/store";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Button, Typo } from "@beadi/components";

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

const examples: Record<string, any> = {};

//TODO Fix examples
// function importAll(r: any) {
//   r.keys().forEach((key: any) => (examples[key] = r(key)));
// }
// importAll((require as any).context("../../../examples", false, /\.json$/));

export const ExampleList: FunctionComponent<{}> = () => {
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

export const WelcomeNodeContent: FunctionComponent<{}> = () => {
  //TODO Reintroduce Changelog
  // const changelog = BEADI_CHANGELOG;
  const changelog = "TODO CHANGELOG";

  return (
    <div className="flex flex-col gap-1 p-2">
      <Typo variant="h1">Hello!</Typo>
      <p>
        I am Luna the bat, and this is Beadi, a platform for visual, node-based, programming for{" "}
        <a href="https://buttplug.io/" className="text-purple-400 underline" target="_blank" rel="noreferrer">
          Buttplug.io
        </a>{" "}
        compatible Sextoys.
      </p>
      <Typo variant="h2">Getting Started</Typo>
      <p>
        You can get started by taking a look at some of the examples below or just dragging in some nodes from the drawer on the left, but
        don't forget to connect your toys or a server in the server tab on the right. You can delete this message, by selecting the node and
        pressing <code>Backspace</code>, and if you want to view it again, go to the File tab on the right, and discard your current File.
      </p>
      <Typo variant="h2">Examples</Typo>
      <ExampleList></ExampleList>
      <Typo variant="h2">Project</Typo>
      <p>
        This project is open-source, the development happens at{" "}
        <a href="https://github.com/ThatBatLuna/Beadi" className="text-purple-400 underline" target="_blank" rel="noreferrer">
          the github repository.
        </a>{" "}
        If you have problems or ideas i would be very happy to hear from you, either via{" "}
        <a href="https://github.com/ThatBatLuna/Beadi/issues/new" className="text-purple-400 underline" target="_blank" rel="noreferrer">
          Issues
        </a>{" "}
        or on{" "}
        <a href="https://thicc.horse/web/@thatbatluna" className="text-purple-400 underline" target="_blank" rel="noreferrer">
          Social Media
        </a>
      </p>
      <Typo variant="h2">
        <a href="https://github.com/ThatBatLuna/Beadi/blob/main/CHANGELOG.md" className="underline" target="_blank" rel="noreferrer">
          Changelog
        </a>
      </Typo>
      <div className="p-2 overflow-y-scroll rounded-md shadow-inner max-h-52 bg-primary-1000 markdown">
        <ReactMarkdown children={changelog}></ReactMarkdown>
      </div>
    </div>
  );
};

export const WelcomeNode: FunctionComponent<NodeProps> = () => {
  return (
    <NodeShell title="Welcome to Beadi" color="#ffffff" style={{ width: 600 }}>
      <WelcomeNodeContent></WelcomeNodeContent>
    </NodeShell>
  );
};
