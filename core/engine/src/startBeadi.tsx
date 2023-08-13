import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "reactflow/dist/style.css";
import App from "./App";
import { enableAllPlugins } from "immer";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { watchForChanges } from "./engine";
import { Plugin } from "./plugin";
import { BeadiContext, BeadiContextProvider } from "./context";

export type BeadiOptions = {
  rootElement: string;
  plugins: Plugin<any>[];
};
export function startBeadi(options: BeadiOptions) {
  enableAllPlugins();

  const context = new BeadiContext({ plugins: options.plugins });
  context.finalize();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        ...Object.values(context.settingsTabs).map((it) => ({
          path: it.id,
          element: it.tab,
        })),
      ],
    },
  ]);

  const root = ReactDOM.createRoot(document.getElementById(options.rootElement) as HTMLElement);
  root.render(
    <React.StrictMode>
      <BeadiContextProvider context={context}>
        <RouterProvider router={router}></RouterProvider>
      </BeadiContextProvider>
    </React.StrictMode>
  );

  watchForChanges(context);
}
