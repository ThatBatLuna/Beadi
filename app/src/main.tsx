import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startBeadi } from "@beadi/engine";
import { RemotePlugin } from "@beadi/plugin-remote";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

startBeadi({
  plugins: [RemotePlugin],
  rootElement: "root",
});
