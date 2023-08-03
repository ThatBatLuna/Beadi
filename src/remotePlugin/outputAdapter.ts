import { InputAdapterDef, OutputAdapterDef } from "../engine/adapter";

export const remoteOutputAdapter: OutputAdapterDef<number, {}> = {
  id: "remoteOutput",
  getType: () => "number",
  pushData: (nodeId, data) => {
    console.log("Output: ", data);
  },
  label: "Remote",
};

export const remoteOutputToInputAdapter: OutputAdapterDef<number, {}> = {
  id: "remoteOutputToInput",
  getType: () => "number",
  pushData: (nodeId, data) => {
    console.log("RemoteOutputToRemoteInput", data);
  },
  label: "Set Remote Input",
};

export const testRemoteOutputAdapter: OutputAdapterDef<number, {}> = {
  id: "remoteOutput2",
  getType: () => "number",
  pushData: (nodeId, data) => {
    // console.log("Output2: ", data);
  },
  label: "Remote2",
};
