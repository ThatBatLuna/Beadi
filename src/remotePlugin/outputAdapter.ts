import { InputAdapterDef, OutputAdapterDef } from "../engine/adapter";

export const remoteOutputAdapter: OutputAdapterDef<number> = {
  id: "remoteInput",
  pushData: (nodeId, data) => {
    console.log("Output: ", data);
  },
  label: "Remote",
};

export const testRemoteOutputAdapter: OutputAdapterDef<number> = {
  id: "remoteInput2",
  pushData: (nodeId, data) => {
    console.log("Output2: ", data);
  },
  label: "Remote2",
};
