import { plugin } from "@beadi/engine";
import { intifaceTab } from "./settings/IntifaceTab";
import { shard } from "./storage";
import { persistIntifaceStore } from "./intifaceStore";

export const intifacePlugin = plugin({
  id: "intifacePlugin",
  outputAdapterDefs: [],
  processingHooks: {
    finalizedContext: (beadi) => {
      persistIntifaceStore(beadi);
    },
  },
  settingsTabs: [intifaceTab],
  storageShard: shard,
});
