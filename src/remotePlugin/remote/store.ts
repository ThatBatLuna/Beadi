import create from "zustand";
import { diffBy, diffByKeys } from "../../utils/diffBy";
import produce, { Draft } from "immer";
import { BeadiMessage, handleMessage } from "../message";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type RemoteConnection = {
  remoteConnectionId: string;
  code: string;
};
export type RemoteStore = {
  remotes: Record<string, RemoteConnection>;
  addConnection: (connection: Omit<RemoteConnection, "remoteConnectionId">) => void;
  removeConnection: (connectionId: string) => void;
};
export const useRemoteStore = create(
  persist(
    immer<RemoteStore>((set, get) => ({
      remotes: {},
      addConnection: (connection) => {
        const id = `${new Date().getTime()}`;
        set((draft) => {
          draft.remotes[id] = {
            ...connection,
            remoteConnectionId: id,
          };
        });
      },
      removeConnection: (id) => {
        set((draft) => {
          delete draft.remotes[id];
        });
      },
    })),
    {
      name: "remoteConnections",
      getStorage: () => window.sessionStorage,
    }
  )
);

type RemoteConnectionValue = {
  valueId: string;
  value: any;
};
type RemoteConnectionState =
  | {
      state: "disconnected";
    }
  | {
      state: "connecting";
      socket: WebSocket;
      id: string;
    }
  | {
      state: "connected";
      socket: WebSocket;
      id: string;
      values: Record<string, RemoteConnectionValue>;
    };

export type RemoteConnectionHandle = {
  state: RemoteConnectionState;
  definition: RemoteConnection;
  close: () => void;
};

export type RemoteStateStore = {
  remotes: Record<string, RemoteConnectionHandle>;
};
export const useRemoteStateStore = create<RemoteStateStore>()((set, get) => ({
  remotes: {},
}));

type Setter = (recipe: (draft: Draft<RemoteConnectionState>) => void | RemoteConnectionState) => void;
function openRemoteConnection(connection: RemoteConnection, set: Setter): RemoteConnectionHandle {
  console.log("Opening Remote Socket ", connection.code);
  const socket = new WebSocket(`ws://localhost:6969/control/${connection.code}`);

  socket.addEventListener("open", (event) => {
    console.log("WebSocket Opened: ", event);
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed: ", event);
    set((s) => ({ state: "disconnected" }));
  });
  socket.addEventListener("message", (event) => {
    console.log("WebSocket message: ", event);
    try {
      const data: BeadiMessage = JSON.parse(event.data);
      handleMessage(data, {
        WelcomeController: (payload) => {
          set((s) => ({
            state: "connected",
            id: payload.id,
            socket: socket,
            values: Object.assign(
              {},
              ...payload.endpoints.map((it) => ({
                [it.id]: it,
              }))
            ),
          }));
        },
        PublishEndpoints: (payload) => {
          set((draft) => {
            if (draft.state === "connected") {
              draft.values = Object.assign(
                {},
                ...payload.endpoints.map((it) => ({
                  [it.id]: it,
                }))
              );
            }
          });
        },
        ValueChanged: ({ endpoint, value }) => {
          set((draft) => {
            if (draft.state === "connected") {
              if (endpoint in draft.values) {
                draft.values[endpoint].value = value;
              }
            }
          });
        },
      });
    } catch (e) {
      console.error("Unreadable message: ", event);
    }
  });

  return {
    state: { state: "connecting", socket, id: connection.code },
    definition: connection,
    close: () => {
      console.log("Closing Remote Socket ", connection.code);
      socket.close();
    },
  };
}

function startSyncRemoteStateStore() {
  console.log("Start syncRemoteStateStore");
  const syncRemoteStateStore = (state: RemoteStore) => {
    const oldRemotes = useRemoteStateStore.getState().remotes;
    const { missing, extra } = diffByKeys(oldRemotes, state.remotes);

    useRemoteStateStore.setState((s) =>
      produce(s, (draft) => {
        for (const extraKey in extra) {
          draft.remotes[extraKey].close();
          delete draft.remotes[extraKey];
        }
        for (const missingKey in missing) {
          draft.remotes[missingKey] = openRemoteConnection(missing[missingKey], (recipe) => {
            useRemoteStateStore.setState((s) =>
              produce(s, (draft) => {
                const result = recipe(draft.remotes[missingKey].state);
                if (result !== undefined) {
                  draft.remotes[missingKey].state = result;
                }
              })
            );
          });
        }
      })
    );
  };
  useRemoteStore.subscribe(syncRemoteStateStore);
  syncRemoteStateStore(useRemoteStore.getState());
}
startSyncRemoteStateStore();
