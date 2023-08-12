import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "reactflow/dist/style.css";
import App from "./App";
import { enableAllPlugins } from "immer";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { watchForChanges } from "./engine";
import { settingsTabs } from "./registries";
import { Plugin } from "./plugin";

export type BeadiOptions = {
  rootElement: string;
  plugins: Plugin[];
};
export function startBeadi(options: BeadiOptions) {
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

  const root = ReactDOM.createRoot(document.getElementById(options.rootElement) as HTMLElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
  );

  watchForChanges();
}
