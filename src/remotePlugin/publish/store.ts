import produce, { Draft } from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BeadiMessage, handleMessage, sendMessage } from "../message";
import { useIOValueStore } from "../inputOutputStore";

function makeDisconnectedState(set: Setter, get: Getter): PublishConnectionState & { state: "disconnected" } {
  return {
    state: "disconnected",
    updateValue: (valueId, value) => {
      console.log("Updating value ", valueId, " to ", value, " on disconnected socket");
    },
    publish: () => {
      publish(set, get);
    },
  };
}
function makeConnectingState(socket: WebSocket): PublishConnectionState & { state: "connecting" } {
  return {
    state: "connecting",
    close: () => {
      socket.close();
    },
    socket,
    updateValue: (valueId, value) => {
      console.log("Updating value ", valueId, " to ", value, " on connecting socket");
    },
  };
}
function makeConnectedState(socket: WebSocket, id: string): PublishConnectionState & { state: "connected" } {
  return {
    state: "connected",
    close: () => {
      socket.close();
    },
    id,
    socket,
    updateValue: (valueId, value) => {
      console.log("Updating value ", valueId, " to ", value, " on connected socket");
    },
  };
}

type PublishConnectionState =
  | {
      state: "disconnected";
      updateValue: (valueId: string, value: any) => void;
      publish: () => void;
    }
  | {
      state: "connecting";
      socket: WebSocket;
      close: () => void;
      updateValue: (valueId: string, value: any) => void;
    }
  | {
      state: "connected";
      socket: WebSocket;
      id: string;
      close: () => void;
      updateValue: (valueId: string, value: any) => void;
    };
type PublishStateStore = {
  state: PublishConnectionState;
};
export const usePublishStateStore = create<PublishStateStore>()((set, get) => ({
  state: makeDisconnectedState((recipe) => set((s) => produce(s, recipe)), get),
  close: () => {},
}));

type Setter = (recipe: (draft: Draft<PublishStateStore>) => void | PublishStateStore) => void;
type Getter = () => PublishStateStore;
function publish(set: Setter, get: Getter): void {
  const socket = new WebSocket("ws://localhost:6969/publish");

  socket.addEventListener("open", (event) => {
    console.log("WebSocket Opened: ", event);
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed: ", event);

    const old = get().state;
    set((s) => {
      s.state = makeDisconnectedState(set, get);
    });
    if (old.state !== "disconnected") {
      old.close();
    }
  });
  socket.addEventListener("message", (event) => {
    console.log("WebSocket message: ", event);
    try {
      const data: BeadiMessage = JSON.parse(event.data);
      handleMessage(data, {
        Welcome: (payload) => {
          set((s) => {
            s.state = makeConnectedState(socket, payload.id);
          });
          sendMessage(socket, {
            PublishEndpoints: {
              endpoints: Object.values(useIOValueStore.getState().values).map((v) => ({
                id: v.valueId,
                type: v.type,
                value: v.value,
              })),
            },
          });
        },
        PublishEndpoints: (payload) => {
          console.log("TODO Compare payload endpoints to actually published endpoints and warn if they diverge");
        },
        ValueChanged: ({ endpoint, value }) => {
          console.log("ValueChanged request got to Set ", endpoint, " to ", value);

          useIOValueStore.getState().setValue(endpoint, value);
        },
      });
    } catch (e) {
      console.error("Unreadable message: ", event);
    }
  });

  set((s) => {
    s.state = makeConnectingState(socket);
  });
}

// export function startSyncPublishConnectionState() {
//   const syncToState = (state: PublishStore) => {
//     const oldState = usePublishStateStore.getState();

//     const oldConnectionState = oldState.state;
//     const oldIsConnected = oldConnectionState.state === "connecting" || oldConnectionState.state === "connected";
//     if (oldIsConnected && !state.published) {
//       //Disconnect
//       oldConnectionState.close();
//     }
//     if (!oldIsConnected && state.published) {
//       //Connect
//       usePublishStateStore.setState(
//         publish((recipe) => {
//           usePublishStateStore.setState((s) => produce(s, recipe));
//         }, usePublishStateStore.getState)
//       );
//     }
//   };

//   usePublishStore.subscribe(syncToState);
//   syncToState(usePublishStore.getState());
// }
// startSyncPublishConnectionState();
