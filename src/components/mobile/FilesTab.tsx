import { FunctionComponent } from "react";
import { ExampleList } from "../../nodes/WelcomeNode";
import { Button } from "../input/Button";
import { FileSettings } from "../settings/FileSettings";
import { Typo } from "../Typo";

export const FilesTab: FunctionComponent<{}> = () => {
  return (
    <div className="flex flex-col py-2">
      <Typo variant="h0" className="text-center">
        Files
      </Typo>
      <FileSettings></FileSettings>
      <Typo variant="h0" className="text-center">
        Examples
      </Typo>
      <div className="p-2">
        <ExampleList></ExampleList>
      </div>
    </div>
  );
};
