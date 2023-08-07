import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "reactflow/dist/style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { enableAllPlugins } from "immer";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { watchForChanges } from "./engine";
import { useFileStore } from "./engine/store";
import { tempSyncIOValueStore } from "./remotePlugin/inputOutputStore";
import { settingsTabs } from "./registries";
// import { setButtplugInstance } from "./adapters/store";
//
enableAllPlugins();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...Object.values(settingsTabs).map((it) => ({
        path: it.id,
        element: it.tab,
      })),
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

watchForChanges();

// const bpscript = document.createElement("script");
// bpscript.src =
//   "https://cdn.jsdelivr.net/npm/buttplug@1.0.1/dist/web/buttplug.min.js";

// bpscript.onload = () => {
//   let buttplug = (window as any).Buttplug;
//   buttplug.buttplugInit().then(() => {
//     setButtplugInstance(buttplug);
//   });
// };

// document.head.appendChild(bpscript);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
tempSyncIOValueStore();
