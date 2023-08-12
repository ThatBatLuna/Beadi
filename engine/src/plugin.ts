import { Tab } from "./components/Settings";
import { AnyInputAdapterDef, AnyOutputAdapterDef } from "./engine/adapter";
import { AnyNodeDef } from "./engine/node";

export type Plugin = {
  nodeDefs?: AnyNodeDef[];
  inputAdapterDefs?: AnyInputAdapterDef[];
  outputAdapterDefs?: AnyOutputAdapterDef[];
  settingsTabs?: Tab[];
  processingHooks: {
    postPrepareSignals?: () => {};
  };
};

let finalized = false;
const plugins: Plugin[] = [];

export function loadPlugin(plugin: Plugin) {
  if (finalized) {
    throw new Error("Attempt to load plugin after plugins have been finalized.");
  }
  plugins.push(plugin);
}

export function finalizePlugins() {
  finalized = true;
}

export function getPlugins(): Plugin[] {
  if (!finalized) {
    throw new Error("Attempt to access plugins before plugins have been finalized.");
  }
  return plugins;
}

export function runHooks(hook: keyof Plugin["processingHooks"]) {
  getPlugins().forEach((it) => it.processingHooks[hook]?.());
}
