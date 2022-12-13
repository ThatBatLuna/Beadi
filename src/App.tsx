import Drawer from "./components/Drawer";
import { Settings } from "./components/Settings";
import Viewport from "./components/Viewport";

function App() {
  return (
    <div className="flex flex-row w-full h-full bg-black">
      <Drawer />
      <Viewport />
      <Settings />
    </div>
  );
}

export default App;
