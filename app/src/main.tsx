import "./index.css";
import { startBeadi } from "@beadi/engine";
import { makeRemotePlugin } from "@beadi/plugin-remote";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

startBeadi({
  plugins: [
    makeRemotePlugin({
      remoteServerUrl: import.meta.env.VITE_APP_REMOTE_SERVER_URL,
    }),
  ],
  rootElement: "root",
});
