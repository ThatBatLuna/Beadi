import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Drawer from "./components/Drawer";
import { MobileView } from "./components/mobile/MobileView";
import { Settings } from "./components/Settings";
import Viewport from "./components/Viewport";
import { runEngineLoop } from "./engine/runner";

function App() {
  const [mobile, setMobile] = useState(window.innerWidth < 1000);

  return (
    <div className="flex flex-row w-full h-full text-white bg-black">
      {mobile ? (
        <MobileView></MobileView>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Drawer />
          <Viewport />
          <Settings />
        </DndProvider>
      )}
    </div>
  );
}

export default App;

runEngineLoop();
