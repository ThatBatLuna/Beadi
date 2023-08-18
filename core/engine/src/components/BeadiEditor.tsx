import { FunctionComponent } from "react";
import { BeadiInstance, BeadiInstanceProvider, ViewportWrapper } from "..";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Drawer from "./Drawer";
import { Settings } from "./Settings";

export type BeadiEditorProps = {
  instance: BeadiInstance;
};
export const BeadiEditor: FunctionComponent<BeadiEditorProps> = ({ instance }) => {
  return (
    <BeadiInstanceProvider context={instance}>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row w-full h-full text-white bg-black overflow-x-hidden">
          <Drawer />
          <ViewportWrapper />
          <Settings />
        </div>
      </DndProvider>
    </BeadiInstanceProvider>
  );
};
