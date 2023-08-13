import produce, { Draft } from "immer";
import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { BeadiMessage, RemoteControlEndpoint, handleMessage, sendMessage } from "../message";
import _ from "lodash";
import { useIOValueStore, useInterfaceFileStore } from "../storage";
import { BeadiContext } from "@beadi/engine";
import { RemotePlugin, RemotePluginSettings } from "..";

type PublishConnectionState =
  | {
      state: "disconnected";
      error?: string;
      updateValue: (valueId: string, value: any, immediateWriteLocal?: boolean) => void;
      emitSignal: (valueId: string, data: any) => void;
      publish: () => void;
    }
  | {
      state: "connecting";
      socket: WebSocket;
      close: () => void;
      updateValue: (valueId: string, value: any, immediateWriteLocal?: boolean) => void;
      emitSignal: (valueId: string, data: any) => void;
    }
  | {
      state: "connected";
      socket: WebSocket;
      id: string;
      close: () => void;
      updateValue: (valueId: string, value: any, immediateWriteLocal?: boolean) => void;
      emitSignal: (valueId: string, data: any) => void;
    };
type PublishStateStore = {
  state: PublishConnectionState;
};

export function makePublishStateStore(beadi: BeadiContext) {
  function makeDisconnectedState(set: Setter, get: Getter, error?: string): PublishConnectionState & { state: "disconnected" } {
    return {
      error,
      state: "disconnected",
      updateValue: (valueId, value) => {
        // console.log("Updating value ", valueId, " to ", value, " on disconnected socket");
        useIOValueStore.getStateWith(beadi).setValue(valueId, value, true);
      },
      emitSignal: (valueId, data) => {
        console.log("Emitting Signal at ", valueId, " with ", data, " on disconnected socket");
        useIOValueStore.getStateWith(beadi).emitSignal(valueId, data);
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
        // console.log("Updating value ", valueId, " to ", value, " on connecting socket");
        useIOValueStore.getStateWith(beadi).setValue(valueId, value, true);
      },
      emitSignal: (valueId, data) => {
        console.log("Emitting Signal at ", valueId, " with ", data, " on connecting socket");
        useIOValueStore.getStateWith(beadi).emitSignal(valueId, data);
      },
    };
  }
  function makeConnectedState(socket: WebSocket, id: string): PublishConnectionState & { state: "connected" } {
    const unsubscribeInterfaceChanges = useInterfaceFileStore.subscribeWith(beadi, (state) => {
      sendMessage(socket, {
        PublishInterfaces: {
          interfaces: Object.values(state.interfaces),
        },
      });
    });

    let lastPublishedEndpointDefs: { id: string; type: string }[] = [];
    const unsubscribeValueChanges = useIOValueStore.subscribeWith(beadi, (state) => {
      const endpointDefs = Object.values(state.values).map((v) => ({
        id: v.valueId,
        type: v.type,
      }));
      if (!_.isEqual(endpointDefs, lastPublishedEndpointDefs)) {
        lastPublishedEndpointDefs = endpointDefs;
        sendMessage(socket, {
          PublishEndpoints: {
            endpoints: Object.values(state.values).map(
              (v) =>
                ({
                  def: {
                    valueId: v.valueId,
                    type: v.type,
                    name: v.name,
                    writeable: v.writeable,
                  },
                  value: v.value,
                } satisfies RemoteControlEndpoint)
            ),
          },
        });
      }
    });

    return {
      state: "connected",
      close: () => {
        unsubscribeValueChanges();
        unsubscribeInterfaceChanges();
        socket.close();
      },
      id,
      socket,
      updateValue: (valueId, value, immediateWriteLocal = false) => {
        // console.log("Updating value ", valueId, " to ", value, " on connected socket");
        if (immediateWriteLocal) {
          useIOValueStore.getStateWith(beadi).setValue(valueId, value, true);
        }
        sendMessage(socket, {
          ValueChanged: {
            endpoint: valueId,
            value: value,
          },
        });
      },
      emitSignal: (valueId, data) => {
        sendMessage(socket, {
          EmitSignal: {
            endpoint: valueId,
            value: data ?? null,
          },
        });
      },
    };
  }

  function publish(set: Setter, get: Getter): void {
    const socket = new WebSocket(`${(beadi.globals as any).remotePlugin.remoteServerUrl}/publish`);

    socket.addEventListener("open", (event) => {
      console.log("WebSocket Opened: ", event);
    });
    socket.addEventListener("close", (event) => {
      console.log("WebSocket closed: ", event);

      const old = get().state;
      set((s) => {
        s.state = makeDisconnectedState(set, get, `Socket closed: ${event.reason} (${event.code})`);
      });
      if (old.state !== "disconnected") {
        old.close();
      }
    });
    socket.addEventListener("message", (event) => {
      // console.log("WebSocket message: ", event);
      let data: BeadiMessage;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.error("Unreadable message: ", event, e);
        return;
      }
      handleMessage(data, {
        Welcome: (payload) => {
          set((s) => {
            s.state = makeConnectedState(socket, payload.id);
          });
          sendMessage(socket, {
            PublishEndpoints: {
              endpoints: Object.values(useIOValueStore.getStateWith(beadi).values).map(
                (v) =>
                  ({
                    def: {
                      valueId: v.valueId,
                      type: v.type,
                      name: v.name,
                      writeable: v.writeable,
                    },
                    value: v.value,
                  } satisfies RemoteControlEndpoint)
              ),
            },
          });
          sendMessage(socket, {
            PublishInterfaces: {
              interfaces: Object.values(useInterfaceFileStore.getStateWith(beadi).interfaces),
            },
          });
        },
        PublishEndpoints: (_payload) => {
          console.log("TODO Compare payload endpoints to actually published endpoints and warn if they diverge");
        },
        ValueChanged: ({ endpoint, value }) => {
          // console.log("ValueChanged request got to Set ", endpoint, " to ", value);

          useIOValueStore.getStateWith(beadi).setValue(endpoint, value);
        },
        EmitSignal: ({ endpoint, value }) => {
          console.log("EmitSignal request got to ", endpoint, " with ", value);
          useIOValueStore.getStateWith(beadi).emitSignal(endpoint, value);
        },
      });
    });

    set((s) => {
      s.state = makeConnectingState(socket);
    });
  }

  return createStore(
    devtools<PublishStateStore>(
      (set, get) => ({
        state: makeDisconnectedState((recipe) => set((s) => produce(s, recipe)), get),
        close: () => {},
      }),
      { name: "usePublishStateStore" }
    )
  );
}

type Setter = (recipe: (draft: Draft<PublishStateStore>) => void | PublishStateStore) => void;
type Getter = () => PublishStateStore;
