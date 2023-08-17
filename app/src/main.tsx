import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { HomePage } from "./home/HomePage";
import { Beadi } from "@beadi/engine";
import { beadiAppPlugin } from "./beadiAppPlugin";
import { makeRemotePlugin } from "../../plugins/remote/src";
import { intifacePlugin } from "@beadi/plugin-intiface";
import { Introduction } from "./pages/Introduction";
import { ChangelogPage } from "./pages/Changelog";
import { GuidePage } from "./pages/Guide";
import { Privacy } from "./pages/Privacy";

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
];
const options = {
  extraRoutes: routes,
  plugins: [
    beadiAppPlugin,
    makeRemotePlugin({
      remoteServerUrl: import.meta.env.VITE_APP_REMOTE_SERVER_URL,
    }),
    intifacePlugin,
  ],
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Beadi options={options}></Beadi>
  </React.StrictMode>
);

// startBeadi({
//   rootElement: "root",
// });
