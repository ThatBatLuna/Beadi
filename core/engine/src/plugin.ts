import { ComponentType } from "react";
import { BeadiInstance, StorageShardDefBuilder, UnknownBeadiNodeProps } from ".";
import { Tab } from "./components/Settings";
import { AnyInputAdapterDef, AnyOutputAdapterDef } from "./engine/adapter";
import { AnyNodeDef } from "./engine/node";
import { StorageShard } from "./storage";

export type ProcessingHookContext = {
  beadiInstance: BeadiInstance;
};
export type { Tab };
export type Plugin<TShard extends StorageShard, TGlobals, TId extends string> = {
  id: TId;
  nodeDefs?: AnyNodeDef[];
  extraNodeRenderers?: Record<string, ComponentType<UnknownBeadiNodeProps>>;
  inputAdapterDefs?: AnyInputAdapterDef[];
  outputAdapterDefs?: AnyOutputAdapterDef[];
  settingsTabs?: Tab[];
  globals?: TGlobals;
  processingHooks?: {
    postPrepareSignals?: (props: ProcessingHookContext) => void;
    finalizedContext?: (props: ProcessingHookContext) => void;
  };
  storageShard?: StorageShardDefBuilder<TShard>;
};

export type AnyPlugin = Plugin<any, any, any>;

export function plugin<TShard extends StorageShard, TGlobals, TId extends string>(
  plugin: Plugin<TShard, TGlobals, TId>
): Plugin<TShard, TGlobals, TId> {
  return plugin;
}
