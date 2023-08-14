import { plugin } from "@beadi/engine";
import { intifaceTab } from "./settings/IntifaceTab";
import { shard } from "./storage";
import { persistIntifaceStore } from "./intifaceStore";
import { intifaceAdapter } from "./outputAdapter";

export const intifacePlugin = plugin({
  id: "intifacePlugin",
  outputAdapterDefs: [intifaceAdapter],
  processingHooks: {
    finalizedContext: (beadi) => {
      persistIntifaceStore(beadi);
    },
  },
  settingsTabs: [intifaceTab],
  storageShard: shard,
});
