import { InputAdapterDef } from "../engine/adapter";
import { useRemoteValueStore } from "./remoteValueStore";

export const remoteInputAdapter: InputAdapterDef<number> = {
  id: "remoteInput",
  getData: (nodeId: string) => {
    const value = useRemoteValueStore.getState().sources["local"].values[nodeId].value;
    return value ?? 0.0;
  },
  label: "Remote",
};

export const remoteInputFromOutputAdapter: InputAdapterDef<number> = {
  id: "remoteInputFromOutput",
  getData: (nodeId) => {
    // console.log("RemoteOutputToRemoteInput", data);
    return 0.0;
  },
  label: "Set Remote Input",
};

export const testRemoteInputAdapter: InputAdapterDef<number> = {
  id: "remoteInput2",
  getData: (nodeId: string) => {
    return 83;
  },
  label: "Remote2",
};
