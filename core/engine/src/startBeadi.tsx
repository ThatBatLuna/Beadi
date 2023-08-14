import { FunctionComponent, useMemo } from "react";
import "./index.css";
import "reactflow/dist/style.css";
import App from "./App";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import { watchForChanges } from "./engine";
import { AnyPlugin } from "./plugin";
import { BeadiContext, BeadiContextProvider } from "./context";

export const EDITOR_ROOT_URL = "/edit";

export type BeadiOptions = {
  plugins: AnyPlugin[];
  extraRoutes: RouteObject[];
};

type BeadiProps = {
  options: BeadiOptions;
};
export const Beadi: FunctionComponent<BeadiProps> = ({ options }) => {
  const [context, router] = useMemo(() => {
    console.log("Beadi was instantiated - creating BeadiContext");
    const context = new BeadiContext({ plugins: options.plugins });
    context.finalize();
    watchForChanges(context);

    const router = createBrowserRouter([
      ...options.extraRoutes,
      {
        path: EDITOR_ROOT_URL,
        element: <App />,
        children: [
          ...Object.values(context.settingsTabs).map((it) => ({
            path: it.id,
            element: it.tab,
          })),
        ],
      },
    ]);
    return [context, router];
  }, []);

  return (
    <BeadiContextProvider context={context}>
      <RouterProvider router={router}></RouterProvider>
    </BeadiContextProvider>
  );
};
