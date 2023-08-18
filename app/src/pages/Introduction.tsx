import { Card, Typo, TypoLink } from "@beadi/components";
import { FunctionComponent } from "react";
// import { ExampleList } from "../beadiAppPlugin/WelcomeNode";
// import { EDITOR_ROOT_URL } from "@beadi/engine";

export const Introduction: FunctionComponent = () => {
  return (
    <article>
      <Typo variant="h0" page>
        Hello!
      </Typo>
      <p className="text-center">
        I am Luna the bat, and this is Beadi, a platform for visual, node-based, programming for{" "}
        <a href="https://buttplug.io/" className="text-purple-400 underline" target="_blank" rel="noreferrer">
          Buttplug.io
        </a>{" "}
        compatible Sextoys.
      </p>
      <Typo variant="h1" page>
        Features
      </Typo>
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <Typo variant="h2">Extensive Collection of Nodes</Typo>
          <p>A collection of versatile Nodes enables you to create everything from simple waves up to complex event driven control flows</p>
        </Card>
        <Card>
          <Typo variant="h2">Customizable Interfaces</Typo>
          <p>Create Sliders, Buttons and switches to act as inputs for your graph</p>
        </Card>
        <Card>
          <Typo variant="h2">Remote Control</Typo>
          <p>Let other people remotely control your interfaces or even connect multiple graphs together to create a network of fun.</p>
        </Card>
        <Card>
          <Typo variant="h2">Adapters for I/O</Typo>
          <p>
            Access the sensors of your mobile phone or connect to <TypoLink to="https://intiface.com/">Intiface</TypoLink> to make your toys
            vibe.
          </p>
        </Card>
      </div>
      <div>
        <p className="mt-8 mb-8 text-center text-lg font-bold">And many more to come!</p>
        <div>
          You can visit my <TypoLink to="https://github.com/ThatBatLuna/Beadi">Github</TypoLink> to take a look at current developments or
          suggest new features via <TypoLink to="https://github.com/ThatBatLuna/Beadi/issues">Issues</TypoLink> or on{" "}
          <TypoLink to="https://thicc.horse/@thatbatluna">Social Media</TypoLink>
        </div>
      </div>
    </article>
  );
};
