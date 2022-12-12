import React from "react";
import { ButtplugProvider } from "./adapters/buttplug";
import Drawer from "./components/Drawer";
import Viewport from "./components/Viewport";
import logo from "./logo.svg";

function App() {
  return (
    <ButtplugProvider>
      <div className="flex flex-row w-full h-full bg-black">
        <Drawer />
        <Viewport />
      </div>
    </ButtplugProvider>
  );
}

export default App;
