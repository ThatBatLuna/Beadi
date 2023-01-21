import { FunctionComponent, useState } from "react";
import { WelcomeNode, WelcomeNodeContent } from "../../nodes/WelcomeNode";
import { Button } from "../input/Button";
import { Typo } from "../Typo";

export const MobileWelcome: FunctionComponent<{}> = () => {
  const [visible, setVisible] = useState(true);

  if (visible) {
    return (
      <div className="m-2 overflow-y-scroll border rounded-md max-h-96 bg-primary-900 border-primary-500">
        <div className="relative p-2 overflow-y-visible">
          <Typo variant="h1" className="text-center">
            Beadi
          </Typo>
          <Button
            variant="big"
            className="absolute top-0 right-0"
            onClick={() => setVisible(false)}
          >
            Close
          </Button>
          <p>
            Welcome to the mobile view of Beadi, a platform to create complex
            patterns for sex toys. - this is merely a tiny interface to complex
            programs and flows you can build using the <b>desktop view</b>. You
            can open the desktop view in the Settings tab, but the editor will
            not be very usable on mobile at the current state. You can use the
            file tab of the bottom bar to open or import flows that you built,
            or explore the examples.
          </p>
        </div>
        <WelcomeNodeContent></WelcomeNodeContent>
      </div>
    );
  } else {
    return <></>;
  }
};
