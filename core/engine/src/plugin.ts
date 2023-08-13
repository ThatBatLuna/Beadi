import { BeadiContext, StorageShardDefBuilder } from ".";
import { Tab } from "./components/Settings";
import { AnyInputAdapterDef, AnyOutputAdapterDef } from "./engine/adapter";
import { AnyNodeDef } from "./engine/node";
import { StorageShard } from "./storage";

export type { Tab };
export type Plugin<TShard extends StorageShard> = {
  nodeDefs?: AnyNodeDef[];
  inputAdapterDefs?: AnyInputAdapterDef[];
  outputAdapterDefs?: AnyOutputAdapterDef[];
  settingsTabs?: Tab[];
  processingHooks?: {
    postPrepareSignals?: (beadi: BeadiContext) => void;
    finalizedContext?: (beadi: BeadiContext) => void;
  };
  storageShard?: StorageShardDefBuilder<TShard>;
};

export function plugin<TPlugin extends Plugin<any>>(plugin: TPlugin): TPlugin {
  return plugin;
}
