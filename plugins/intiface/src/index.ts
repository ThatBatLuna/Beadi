import { plugin } from "@beadi/engine";
import { intifaceTab } from "./settings/IntifaceTab";
import { shard } from "./storage";
import { persistIntifaceStore, startSendCommandLoop, stopUnusedDevices } from "./intifaceStore";
import { intifaceAdapter } from "./outputAdapter";

export const intifacePlugin = plugin({
  id: "intifacePlugin",
  outputAdapterDefs: [intifaceAdapter],
  processingHooks: {
    finalizedContext: ({ beadiInstance }) => {
      persistIntifaceStore(beadiInstance);
      stopUnusedDevices(beadiInstance);
      startSendCommandLoop(beadiInstance);
    },
  },
  settingsTabs: [intifaceTab],
  storageShard: shard,
});
