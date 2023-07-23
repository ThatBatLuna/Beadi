import _ from "lodash";
import { useIOValueStore } from "../inputOutputStore";
import { BeadiMessage, handleMessage, sendMessage } from "../message";
import { CommonRemoteInterfaceSource, RemoteInterfaceSourceFactory, RemoteInterfaceWidget, useInterfaceStore } from "./store";
import { Draft } from "immer";
import { FunctionComponent } from "react";
import { Button } from "../../components/input/Button";

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

export type LocalSourceState = {
  connection: RemotePublishStoreState;
};

export type LocalRemoteInterfaceSource = CommonRemoteInterfaceSource<"local"> & {
  updateWidgets: (recipe: (draft: Draft<RemoteInterfaceWidget[]>) => void) => void;
  publish: () => void;
  state: LocalSourceState;
};

export const localSourceFactory: RemoteInterfaceSourceFactory<LocalRemoteInterfaceSource> = (updateInterface, getInterface) => {
  const unsubscribe = useIOValueStore.subscribe((state) => {
    updateInterface((draft) => {
      draft.values = _.mapValues(state.values, (val) => ({
        value: val.value,
        localValue: val.value,
        valueId: val.valueId,
      }));
    });
  });

  return {
    state: {
      connection: { state: "disconnected" },
    },
    type: "local",
    updateWidgets: (recipe) => {
      updateInterface((draft) => {
        recipe(draft.widgets);
      });
      const connection = getInterface().source.state.connection;
      if (connection.state === "connected") {
        sendMessage(connection.socket, {
          PublishEndpoints: {
            endpoints: getInterface()
              .widgets.filter((it) => "valueId" in it.settings)
              .map((widget) => ({
                id: widget.settings["valueId"],
                type: "number",
                value: 0.0,
              })),
          },
        });
      }
    },
    updateValue: (valueId, value) => {
      const connection = getInterface().source.state.connection;
      if (connection.state === "connected") {
        sendMessage(connection.socket, {
          ValueChanged: {
            endpoint: valueId,
            value: value,
          },
        });
      } else {
        useIOValueStore.getState().updateValue(valueId, value);
      }
    },
    publish: () => {
      const socket = new WebSocket("ws://localhost:6969/publish");
      // set({ state: { state: "connecting", socket } });
      updateInterface((draft) => {
        draft.source.state.connection = { state: "connecting", socket };
      });

      socket.addEventListener("open", (event) => {
        console.log("WebSocket Opened: ", event);
      });
      socket.addEventListener("close", (event) => {
        console.log("WebSocket closed: ", event);
        //   set({ state: { state: "disconnected" } });
        updateInterface((draft) => {
          draft.source.state.connection = { state: "disconnected" };
        });
      });
      socket.addEventListener("message", (event) => {
        console.log("WebSocket message: ", event);
        try {
          const data: BeadiMessage = JSON.parse(event.data);
          handleMessage(data, {
            Welcome: (payload) => {
              updateInterface((draft) => {
                draft.source.state.connection = { state: "connected", id: payload.id, socket };
              });
              sendMessage(socket, {
                PublishEndpoints: {
                  endpoints: getInterface()
                    .widgets.filter((it) => "valueId" in it.settings)
                    .map((widget) => ({
                      id: widget.settings["valueId"],
                      type: "number",
                      value: 0.0,
                    })),
                },
              });
            },
            PublishEndpoints: (payload) => {
              console.log("ENdpoints:", payload);
            },
            ValueChanged: ({ endpoint, value }) => {
              console.log("Set ", endpoint, " to ", value);
              useIOValueStore.getState().updateValue(endpoint, value);
            },
          });
        } catch (e) {
          console.error("Unreadable message: ", event);
        }
      });
    },
    destroy: () => {
      unsubscribe();
    },
  };
};

type LocalSourceDisplayProps = {
  interfaceId: string;
};
export const LocalSourceDisplay: FunctionComponent<LocalSourceDisplayProps> = ({ interfaceId }) => {
  const state = useInterfaceStore((s) => s.interfaces[interfaceId].source.state);
  const publish = useInterfaceStore((s) => (s.interfaces[interfaceId].source as LocalRemoteInterfaceSource).publish);

  return (
    <div>
      <p>Local {JSON.stringify(state)}</p>
      <Button onClick={() => publish()}>Publish</Button>
    </div>
  );
};
