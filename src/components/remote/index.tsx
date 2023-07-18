import create, { useStore } from "zustand";
import {
  BeadiMessage,
  RemoteControlEndpoint,
  handleMessage,
  sendMessage,
} from "./message";
import _ from "lodash";
import produce from "immer";
import { useDisplayStore } from "../../engine/store";
import { nodeDefs } from "../../nodes/nodes";

type RemotePublishStoreState =
  | {
      state: "disconnected";
    }
  | {
      state: "connecting";
      socket: WebSocket;
    }
  | {
      state: "connected";
      socket: WebSocket;
      id: string;
    };
type RemotePublishStore = {
  state: RemotePublishStoreState;

  endpoints: RemoteControlEndpoint[];

  connect: () => void;
  disconnect: () => void;
  setEndpoints: (endpoints: RemoteControlEndpoint[]) => void;
};

export const useRemotePublishStore = create<RemotePublishStore>()(
  (set, get) => ({
    state: {
      state: "disconnected",
    },
    endpoints: [],
    connect: () => {
      const socket = new WebSocket("ws://localhost:6969/publish");
      set({ state: { state: "connecting", socket } });

      socket.addEventListener("open", (event) => {
        console.log("WebSocket Opened: ", event);
      });
      socket.addEventListener("close", (event) => {
        console.log("WebSocket closed: ", event);
        set({ state: { state: "disconnected" } });
      });
      socket.addEventListener("message", (event) => {
        console.log("WebSocket message: ", event);
        try {
          const data: BeadiMessage = JSON.parse(event.data);
          handleMessage(data, {
            Welcome: (payload) => {
              set({
                state: {
                  state: "connected",
                  id: payload.id,
                  socket: socket,
                },
              });
              sendMessage(socket, {
                PublishEndpoints: { endpoints: get().endpoints },
              });
            },
            PublishEndpoints: (payload) => {
              set({ endpoints: payload.endpoints });
            },
            ValueChanged: ({ endpoint, value }) => {
              console.log("Set ", endpoint, " to ", value);
              set((it) =>
                produce(it, (draft) => {
                  const ep = draft.endpoints.find((it) => it.id === endpoint);
                  if (ep !== undefined) {
                    ep.value = value;
                  }
                })
              );
              useDisplayStore
                .getState()
                .setHandle(endpoint, "input__value", value);
            },
          });
        } catch (e) {
          console.error("Unreadable message: ", event);
        }
      });
    },
    disconnect: () => {
      const state = get().state;
      if (state.state !== "disconnected") {
        state.socket.close(1000, "Generic disconnect message from beadi.");
      }
    },
    setEndpoints: (endpoints) => {
      console.log(get().endpoints, endpoints);
      if (!_.isEqual(get().endpoints, endpoints)) {
        const state = get().state;
        if (state.state === "connected") {
          sendMessage(state.socket, {
            PublishEndpoints: { endpoints: endpoints },
          });
          //Update the state in handlemessage
        } else {
          set({ endpoints: endpoints });
        }
      }
    },
  })
);

useDisplayStore.subscribe((state, prevState) => {
  const publishedEndpoints = state.nodes
    .filter((node) => {
      if (node.type !== undefined) {
        return (
          (nodeDefs[node.type]?.publishable ?? false) &&
          (node.data.published ?? false)
        );
      }
      return false;
    })
    .map((node) => {
      const val = state.getHandle(node.id, "input__value");
      return { id: node.id, type: node.type!!, value: val };
    });
  useRemotePublishStore.getState().setEndpoints(publishedEndpoints);
});
