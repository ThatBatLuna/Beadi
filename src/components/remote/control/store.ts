import create from "zustand";
import { BeadiMessage, RemoteControlEndpoint, handleMessage, sendMessage } from "../message";
import produce from "immer";

type RemoteControlStoreState =
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
      endpoints: Record<string, RemoteControlEndpoint>;
    };
type RemoteControlStore = {
  state: RemoteControlStoreState;

  connect: (id: string) => void;
  disconnect: () => void;
  setEndpointValue: (endpointId: string, value: number) => void;
};

export const useRemoteControlStore = create<RemoteControlStore>()((set, get) => ({
  state: {
    state: "disconnected",
  },
  endpoints: [],
  connect: (id) => {
    //If i'm connecting to another id, cancel the old id
    {
      const state = get().state;
      if (state.state !== "disconnected") {
        if (state.id === id) {
          return;
        } else {
          get().disconnect();
        }
      }
    }

    console.log("Connecting to new websocket.");
    const socket = new WebSocket(`ws://localhost:6969/control/${id}`);
    set({ state: { state: "connecting", socket, id } });

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
          WelcomeController: (payload) => {
            set({
              state: {
                state: "connected",
                id: payload.id,
                socket: socket,
                endpoints: Object.assign(
                  {},
                  ...payload.endpoints.map((it) => ({
                    [it.id]: it,
                  }))
                ),
              },
            });
          },
          PublishEndpoints: (payload) => {
            set((it) =>
              produce(it, (draft) => {
                if (draft.state.state === "connected") {
                  draft.state.endpoints = Object.assign(
                    {},
                    ...payload.endpoints.map((it) => ({
                      [it.id]: it,
                    }))
                  );
                }
              })
            );
          },
          ValueChanged: ({ endpoint, value }) => {
            set((it) =>
              produce(it, (draft) => {
                if (draft.state.state === "connected") {
                  if (endpoint in draft.state.endpoints) {
                    draft.state.endpoints[endpoint].value = value;
                  }
                }
              })
            );
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
      console.log("Disconnecting from websocket.");
      state.socket.close(0, "Generic disconnect message from beadi.");
    }
  },
  setEndpointValue: (endpoint, value) => {
    const state = get().state;
    if (state.state === "connected") {
      sendMessage(state.socket, {
        ValueChanged: {
          endpoint: endpoint,
          value: value,
        },
      });
    }
  },
}));
