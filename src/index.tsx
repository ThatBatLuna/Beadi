import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "reactflow/dist/style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { setButtplugInstance } from "./adapters/ButtplugInstanceProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const bpscript = document.createElement("script");
bpscript.src =
  "https://cdn.jsdelivr.net/npm/buttplug@1.0.1/dist/web/buttplug.min.js";

bpscript.onload = () => {
  let buttplug = (window as any).Buttplug;
  buttplug.buttplugInit().then(() => {
    setButtplugInstance(buttplug);
  });
};

document.head.appendChild(bpscript);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
