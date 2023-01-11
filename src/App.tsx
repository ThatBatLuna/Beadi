import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Drawer from "./components/Drawer";
import { Settings } from "./components/Settings";
import Viewport from "./components/Viewport";

function App() {
  return (
    <div className="flex flex-row w-full h-full text-white bg-black">
      <DndProvider backend={HTML5Backend}>
        <Drawer />
        <Viewport />
        <Settings />
      </DndProvider>
    </div>
  );
}

export default App;
