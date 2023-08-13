import { BeadiContext, plugin } from "@beadi/engine";
import { remoteInputAdapter } from "./inputAdapter";
import { remoteInputFromOutputAdapter } from "./inputAdapter";
import { remoteOutputAdapter, remoteOutputToInputAdapter } from "./outputAdapter";
import { tempPopSignalBuffer, tempSyncIOValueStore } from "./inputOutputStore";
import { remoteSettingsTab } from "./RemoteDrawerPage";
import { shard } from "./storage";
import { startSyncRemoteStateStore } from "./remote/remoteStore";

export const RemotePlugin = plugin({
  inputAdapterDefs: [remoteInputAdapter, remoteInputFromOutputAdapter],
  outputAdapterDefs: [remoteOutputAdapter, remoteOutputToInputAdapter],
  processingHooks: {
    finalizedContext: (beadi: BeadiContext) => {
      tempSyncIOValueStore(beadi);
      startSyncRemoteStateStore(beadi);
    },
    postPrepareSignals: (beadi: BeadiContext) => {
      tempPopSignalBuffer(beadi);
    },
  },
  settingsTabs: [remoteSettingsTab],
  storageShard: shard,
});
