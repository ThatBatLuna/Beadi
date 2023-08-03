import create from "zustand";
import { diffByKeys } from "../../utils/diffBy";
import produce, { Draft } from "immer";
import { BeadiMessage, handleMessage } from "../message";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import _ from "lodash";
import { Interface } from "../interface/stores";

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
  devtools(
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
    ),
    {
      name: "useRemoteStore",
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
      interfaces: Record<string, Interface>;
    }
  | {
      state: "closing";
      socket: WebSocket;
      id: string;
      values: Record<string, RemoteConnectionValue>;
      interfaces: Record<string, Interface>;
    };
export type RemoteConnectionHandle = {
  state: RemoteConnectionState;
  definition: RemoteConnection;
  close: () => Promise<void>;
};

export type RemoteStateStore = {
  remotes: Record<string, RemoteConnectionHandle>;
};
export const useRemoteStateStore = create(
  devtools<RemoteStateStore>(
    (set, get) => ({
      remotes: {},
    }),
    {
      name: "useRemoteStateStore",
    }
  )
);

type Setter = (recipe: (draft: Draft<RemoteConnectionState>) => void | RemoteConnectionState) => void;
function openRemoteConnection(connection: RemoteConnection, set: Setter): RemoteConnectionHandle {
  console.log("Opening Remote Socket ", connection.code);
  const socket = new WebSocket(`${process.env.REACT_APP_REMOTE_SERVER_URL}/control/${connection.code}`);

  socket.addEventListener("open", (event) => {
    console.log("WebSocket Opened: ", event);
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed: ", event);
    set((s) => ({ state: "disconnected" }));
  });
  socket.addEventListener("message", (event) => {
    console.log("WebSocket message: ", event);
    let data: BeadiMessage;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error("Unparsable message: ", event, e);
      return;
    }
    handleMessage(data, {
      WelcomeController: (payload) => {
        set((s) => ({
          state: "connected",
          id: payload.id,
          socket: socket,
          interfaces: _.keyBy(payload.interfaces, (i) => i.interfaceId),
          values: Object.assign(
            {},
            ...payload.endpoints.map((it) => ({
              [it.id]: {
                value: it.value,
                valueId: it.id,
              } satisfies RemoteConnectionValue,
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
                [it.id]: {
                  value: it.value,
                  valueId: it.id,
                } satisfies RemoteConnectionValue,
              }))
            );
          }
        });
      },
      PublishInterfaces: (payload) => {
        set((draft) => {
          if (draft.state === "connected") {
            draft.interfaces = _.keyBy(payload.interfaces, (i) => i.interfaceId);
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
  });

  return {
    state: { state: "connecting", socket, id: connection.code },
    definition: connection,
    close: () => {
      set((draft) => {
        draft.state = "closing";
      });
      console.log("Closing Remote Socket ", connection.code);
      const promise = new Promise<void>((resolve) => {
        socket.addEventListener("close", () => {
          resolve();
        });
        socket.close();
      });
      return promise;
    },
  };
}

function startSyncRemoteStateStore() {
  console.log("Start syncRemoteStateStore");
  const syncRemoteStateStore = (state: RemoteStore) => {
    const oldRemotes = useRemoteStateStore.getState().remotes;
    const { missing, extra } = diffByKeys(oldRemotes, state.remotes, (a, b) => _.isEqual(a.definition, b));
    console.log("syncRemoteStateStore: ", missing, extra);

    for (const extraKey in extra) {
      console.log("Closing Remote: ", extraKey);
      oldRemotes[extraKey].close().then(() => {
        useRemoteStateStore.setState((s) =>
          produce(s, (draft) => {
            console.log("Closed Remote: ", extraKey);
            delete draft.remotes[extraKey];
          })
        );
      });
    }
    useRemoteStateStore.setState((s) =>
      produce(s, (draft) => {
        for (const missingKey in missing) {
          console.log("Missing: ", missing, missingKey);
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
