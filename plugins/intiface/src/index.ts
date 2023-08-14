import { plugin } from "@beadi/engine";
import { intifaceTab } from "./settings/IntifaceTab";
import { shard } from "./storage";
import { persistIntifaceStore, startSendCommandLoop, stopUnusedDevices } from "./intifaceStore";
import { intifaceAdapter } from "./outputAdapter";

export const intifacePlugin = plugin({
  id: "intifacePlugin",
  outputAdapterDefs: [intifaceAdapter],
  processingHooks: {
    finalizedContext: (beadi) => {
      persistIntifaceStore(beadi);
      stopUnusedDevices(beadi);
      startSendCommandLoop(beadi);
    },
  },
  settingsTabs: [intifaceTab],
  storageShard: shard,
});
