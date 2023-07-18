import { InputAdapterDef } from "../engine/adapter";

export const remoteInputAdapter: InputAdapterDef<number> = {
  id: "remoteInput",
  getData: (nodeId: string) => {
    return 82;
  },
  label: "Remote",
};

export const testRemoteInputAdapter: InputAdapterDef<number> = {
  id: "remoteInput2",
  getData: (nodeId: string) => {
    return 83;
  },
  label: "Remote2",
};
