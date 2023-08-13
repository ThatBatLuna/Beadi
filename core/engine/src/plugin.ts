import { Tab } from "./components/Settings";
import { AnyInputAdapterDef, AnyOutputAdapterDef } from "./engine/adapter";
import { AnyNodeDef } from "./engine/node";

export type { Tab };
export type Plugin = {
  nodeDefs?: AnyNodeDef[];
  inputAdapterDefs?: AnyInputAdapterDef[];
  outputAdapterDefs?: AnyOutputAdapterDef[];
  settingsTabs?: Tab[];
  processingHooks?: {
    postPrepareSignals?: () => void;
  };
};
