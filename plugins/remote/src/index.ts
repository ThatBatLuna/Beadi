import { plugin } from "@beadi/engine";
import { remoteInputAdapter } from "./inputAdapter";
import { remoteInputFromOutputAdapter } from "./inputAdapter";
import { remoteOutputAdapter, remoteOutputToInputAdapter } from "./outputAdapter";
import { tempPopSignalBuffer, tempSyncIOValueStore } from "./inputOutputStore";
import { remoteSettingsTab } from "./RemoteDrawerPage";
import { shard } from "./storage";
import { startSyncRemoteStateStore } from "./remote/remoteStore";

export type RemotePluginSettings = {
  remoteServerUrl: string;
};

export function makeRemotePlugin(settings: RemotePluginSettings) {
  return plugin({
    id: "remotePlugin" as const,
    inputAdapterDefs: [remoteInputAdapter, remoteInputFromOutputAdapter],
    outputAdapterDefs: [remoteOutputAdapter, remoteOutputToInputAdapter],
    processingHooks: {
      finalizedContext: ({ beadiInstance }) => {
        tempSyncIOValueStore(beadiInstance);
        startSyncRemoteStateStore(beadiInstance, (beadiInstance.context.globals as any).remotePlugin.remoteServerUrl);
      },
      postPrepareSignals: ({ beadiInstance }) => {
        tempPopSignalBuffer(beadiInstance);
      },
    },
    globals: {
      remoteServerUrl: settings.remoteServerUrl,
    },
    settingsTabs: [remoteSettingsTab],
    storageShard: shard,
  });
}

export type RemotePlugin = ReturnType<typeof makeRemotePlugin>;
