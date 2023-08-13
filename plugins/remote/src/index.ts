import { Plugin } from "@beadi/engine";
import { remoteInputAdapter } from "./inputAdapter";
import { remoteInputFromOutputAdapter } from "./inputAdapter";
import { remoteOutputAdapter, remoteOutputToInputAdapter } from "./outputAdapter";
import { tempPopSignalBuffer } from "./inputOutputStore";
import { remoteSettingsTab } from "./RemoteDrawerPage";

export const RemotePlugin: Plugin = {
  inputAdapterDefs: [remoteInputAdapter, remoteInputFromOutputAdapter],
  outputAdapterDefs: [remoteOutputAdapter, remoteOutputToInputAdapter],
  processingHooks: {
    postPrepareSignals: () => {
      tempPopSignalBuffer();
    },
  },
  settingsTabs: [remoteSettingsTab],
};
