import { Typo, TypoLink } from "@beadi/components";
import { FunctionComponent } from "react";
import { ExampleList } from "../beadiAppPlugin/WelcomeNode";
import { EDITOR_ROOT_URL } from "../App";

export const GuidePage: FunctionComponent = () => {
  return (
    <article>
      <Typo variant="h1" page>
        Getting Started
      </Typo>
      <p>
        You can get started by taking a look at some of the examples below or just opening the{" "}
        <TypoLink to={EDITOR_ROOT_URL}>Editor</TypoLink> and dragging in some nodes from the left. If you want to connect to the outside
        world, click on one of the icons on the right to either add an Intiface connection or enable Remote Control.
      </p>
      <p>
        Drag in <code>Input</code> nodes to access sensors or remote control. Drag in <code>Output</code> nodes to write values to toys via
        Intiface.
      </p>
      <Typo variant="h1" page>
        Examples
      </Typo>
      <ExampleList></ExampleList>
    </article>
  );
};
