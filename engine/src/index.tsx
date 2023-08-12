import { enableAllPlugins } from "immer";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { watchForChanges } from "./engine";
import { Plugin } from "./plugin";
import { settingsTabs } from "./registries";

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
