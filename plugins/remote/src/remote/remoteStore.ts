import produce, { Draft } from "immer";
import { BeadiMessage, handleMessage } from "../message";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import _ from "lodash";
import { InterfaceDef } from "../interface/interfaceStores";
import { IOValueState } from "../inputOutputStore";
import { BeadiContext, diffByKeys } from "@beadi/engine";
import { createStore } from "zustand";
import { useRemoteStateStore, useRemoteStore } from "../storage";

type RemoteConnection = {
  remoteConnectionId: string;
  code: string;
};
export type RemoteStore = {
  remotes: Record<string, RemoteConnection>;
  addConnection: (connection: Omit<RemoteConnection, "remoteConnectionId">) => void;
  removeConnection: (connectionId: string) => void;
};
export function makeRemoteStore() {
  return createStore(
    devtools(
      persist(
        immer<RemoteStore>((set) => ({
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
}
type RemoteConnectionValue = IOValueState<any>;
// type RemoteConnectionValue = {
//   valueId: string;
//   value: any;
//   type: HandleType
// };
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
      interfaces: Record<string, InterfaceDef>;
    }
  | {
      state: "closing";
      socket: WebSocket;
      id: string;
      values: Record<string, RemoteConnectionValue>;
      interfaces: Record<string, InterfaceDef>;
    };
export type RemoteConnectionHandle = {
  state: RemoteConnectionState;
  definition: RemoteConnection;
  close: () => Promise<void>;
};

export type RemoteStateStore = {
  remotes: Record<string, RemoteConnectionHandle>;
};
export function makeRemoteStateStore() {
  return createStore(
    devtools<RemoteStateStore>(
      () => ({
        remotes: {},
      }),
      {
        name: "useRemoteStateStore",
      }
    )
  );
}

type Setter = (recipe: (draft: Draft<RemoteConnectionState>) => void | RemoteConnectionState) => void;
function openRemoteConnection(connection: RemoteConnection, set: Setter, serverUrl: string): RemoteConnectionHandle {
  console.log("Opening Remote Socket ", connection.code);
  //TODO Resolving environment variables should be done in the app and not the engine
  const socket = new WebSocket(`${serverUrl}/control/${connection.code}`);

  socket.addEventListener("open", (event) => {
    console.log("WebSocket Opened: ", event);
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed: ", event);
    set((_s) => ({ state: "disconnected" }));
  });
  socket.addEventListener("message", (event) => {
    // console.log("WebSocket message: ", event);
    let data: BeadiMessage;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error("Unparsable message: ", event, e);
      return;
    }
    handleMessage(data, {
      WelcomeController: (payload) => {
        set(() => ({
          state: "connected",
          id: payload.id,
          socket: socket,
          interfaces: _.keyBy(payload.interfaces, (i) => i.interfaceId),
          values: Object.assign(
            {},
            ...payload.endpoints.map((it) => ({
              [it.def.valueId]: {
                value: it.value,
                ...it.def,
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
                [it.def.valueId]: {
                  value: it.value,
                  ...it.def,
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

export function startSyncRemoteStateStore(beadi: BeadiContext) {
  console.log("Start syncRemoteStateStore");
  const syncRemoteStateStore = (state: RemoteStore) => {
    const oldRemotes = useRemoteStateStore.getStateWith(beadi).remotes;
    const { missing, extra } = diffByKeys(oldRemotes, state.remotes, (a, b) => _.isEqual(a.definition, b));
    // console.log("syncRemoteStateStore: ", missing, extra);

    for (const extraKey in extra) {
      console.log("Closing Remote: ", extraKey);
      oldRemotes[extraKey].close().then(() => {
        useRemoteStateStore.setStateWith(beadi, (s) =>
          produce(s, (draft) => {
            console.log("Closed Remote: ", extraKey);
            delete draft.remotes[extraKey];
          })
        );
      });
    }
    useRemoteStateStore.setStateWith(beadi, (s) =>
      produce(s, (draft) => {
        for (const missingKey in missing) {
          console.log("Missing: ", missing, missingKey);
          draft.remotes[missingKey] = openRemoteConnection(
            missing[missingKey],
            (recipe) => {
              useRemoteStateStore.setStateWith(beadi, (s) =>
                produce(s, (draft) => {
                  const result = recipe(draft.remotes[missingKey].state);
                  if (result !== undefined) {
                    draft.remotes[missingKey].state = result;
                  }
                })
              );
            },
            (beadi.globals as any).remotePlugin.remoteServerUrl
          );
        }
      })
    );
  };
  useRemoteStore.subscribeWith(beadi, syncRemoteStateStore);
  syncRemoteStateStore(useRemoteStore.getStateWith(beadi));
}
