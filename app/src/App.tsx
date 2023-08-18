import { BeadiContext, BeadiContextProvider } from "@beadi/engine";
import { intifacePlugin } from "@beadi/plugin-intiface";
import { FunctionComponent } from "react";
import { makeRemotePlugin } from "../../plugins/remote/src";
import { beadiAppPlugin } from "./beadiAppPlugin";
import { HomePage } from "./home/HomePage";
import { ChangelogPage } from "./pages/Changelog";
import { GuidePage } from "./pages/Guide";
import { Introduction } from "./pages/Introduction";
import { Privacy } from "./pages/Privacy";
import { EditorPage } from "./editor/EditorPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

export const EDITOR_ROOT_URL = "/edit";

const context = new BeadiContext({
  rootUrl: EDITOR_ROOT_URL,
  plugins: [
    beadiAppPlugin,
    makeRemotePlugin({
      remoteServerUrl: import.meta.env.VITE_APP_REMOTE_SERVER_URL,
    }),
    intifacePlugin,
  ],
});
const routes = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "/",
        element: <Introduction />,
      },
      {
        path: "guide",
        element: <GuidePage />,
      },
      {
        path: "changelog",
        element: <ChangelogPage />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
    ],
  },
  {
    path: EDITOR_ROOT_URL,
    element: <EditorPage />,
    children: context.createRoutes(),
  },
];

const router = createBrowserRouter(routes);

export const App: FunctionComponent = () => {
  return (
    <BeadiContextProvider context={context}>
      <RouterProvider router={router}></RouterProvider>
    </BeadiContextProvider>
  );
};
