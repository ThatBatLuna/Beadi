import React from "react";
import Drawer from "./components/Drawer";
import Viewport from "./components/Viewport";
import logo from "./logo.svg";

function App() {
  return (
    <div className="flex flex-row w-full h-full bg-black">
      <Drawer />
      <Viewport />
    </div>
  );
}

export default App;
