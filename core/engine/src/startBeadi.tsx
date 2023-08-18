import { FunctionComponent, useMemo } from "react";
import "./index.css";
import "reactflow/dist/style.css";
import App from "./App";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AnyPlugin } from "./plugin";
import { BeadiContext, BeadiContextProvider } from "./context";
import { BeadiInstance, BeadiInstanceProvider } from ".";

export const EDITOR_ROOT_URL = "/edit";

export type BeadiOptions = {
  plugins: AnyPlugin[];
  extraRoutes: RouteObject[];
};

type BeadiProps = {
  options: BeadiOptions;
};
export const Beadi: FunctionComponent<BeadiProps> = ({ options }) => {
  const [context, router, instance] = useMemo(() => {
    console.log("Beadi was instantiated - creating BeadiContext");
    const context = new BeadiContext({ plugins: options.plugins });

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

    const instance = new BeadiInstance({
      beadiContext: context,
      initialData: {},
    });
    return [context, router, instance];
  }, []);

  return (
    <BeadiContextProvider context={context}>
      <BeadiInstanceProvider context={instance}>
        <RouterProvider router={router}></RouterProvider>
      </BeadiInstanceProvider>
    </BeadiContextProvider>
  );
};
