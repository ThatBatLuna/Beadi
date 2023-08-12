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
import { settingsTabs } from "./registries";
import { finalizePlugins } from "./plugin";
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

/* ===== Debug timeouts and intevals ==== */
// const oldSetTimeout = window.setTimeout;
// const oldClearTimeout = window.clearTimeout;

// const timeouts: Record<number, any> = {};

// type TimeoutParams = Parameters<typeof window.setTimeout>;
// (window.setTimeout as any) = (func: TimeoutParams[0], timeout: TimeoutParams[1]) => {
//   let to = oldSetTimeout(() => {
//     func();
//     delete timeouts[to];
//   }, timeout);
//   const stack = new Error().stack;
//   timeouts[to] = stack;
//   const len = Object.keys(timeouts).length;
//   console.log("Timeouts: ", len);
//   if (len > 100) {
//     console.log(timeouts);
//     debugger;
//   }

//   // console.trace("Timeouts: ", timeouts.size);
//   return to;
// };
// (window.clearTimeout as any) = (a: any) => {
//   delete timeouts[a];
//   return oldClearTimeout(a);
// };

// const oldSetInterval = window.setInterval;
// const oldClearInterval = window.clearInterval;

// const intervals: Record<number, any> = {};

// type IntervalParams = Parameters<typeof window.setInterval>;
// (window.setInterval as any) = (func: IntervalParams[0], interval: IntervalParams[1]) => {
//   let to = oldSetInterval(func, interval);
//   const stack = new Error().stack;
//   intervals[to] = stack;
//   const len = Object.keys(intervals).length;
//   console.log("Intervals: ", len);
//   if (len > 100) {
//     console.log(intervals);
//     debugger;
//   }

//   // console.trace("Intervals: ", intervals.size);
//   return to;
// };
// (window.clearInterval as any) = (a: any) => {
//   delete intervals[a];
//   return oldClearInterval(a);
// };
