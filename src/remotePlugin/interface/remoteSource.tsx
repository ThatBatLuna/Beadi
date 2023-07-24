import { FunctionComponent } from "react";
import { CommonRemoteInterfaceSource, RemoteInterfaceSourceFactory } from "./store";
import { BeadiMessage, handleMessage, sendMessage } from "../message";
import _ from "lodash";

type RemoteControlStoreState =
  | {
      state: "disconnected";
    }
  | {
      state: "connecting";
      socket: WebSocket;
      code: string;
    }
  | {
      state: "connected";
      socket: WebSocket;
      code: string;
      //   endpoints: Record<string, RemoteControlEndpoint>;
    };

export type RemoteRemoteInterfaceSource = CommonRemoteInterfaceSource<"remote"> & {
  state: RemoteControlStoreState;
};
type RemoteFactoryProps = {
  code: string;
};
export const remoteSourceFactory: RemoteInterfaceSourceFactory<RemoteFactoryProps, RemoteRemoteInterfaceSource> = (
  props,
  updateInterface,
  getInterface
) => {
  const socket = new WebSocket(`ws://localhost:6969/control/${props.code}`);

  socket.addEventListener("open", (event) => {
    console.log("WebSocket Opened: ", event);
  });
  socket.addEventListener("close", (event) => {
    console.log("WebSocket closed: ", event);

    updateInterface((draft) => {
      draft.source.state = { state: "disconnected" };
    });
  });
  socket.addEventListener("message", (event) => {
    console.log("WebSocket message: ", event);
    try {
      const data: BeadiMessage = JSON.parse(event.data);
      handleMessage(data, {
        WelcomeController: (payload) => {
          updateInterface((draft) => {
            draft.source.state = {
              state: "connected",
              code: props.code,
              socket: socket,
            };
            draft.values = _.keyBy(
              payload.endpoints.map((endp) => ({
                valueId: endp.id,
                value: endp.value,
                localValue: endp.value,
              })),
              (e) => e.valueId
            );
            draft.widgets = payload.endpoints.map((endp) => ({
              settings: {
                valueId: endp.id,
              },
              type: "slider",
              widgetId: `${new Date().getTime()}`,
            }));
          });
        },
        PublishEndpoints: (payload) => {
          console.log("PublishEndpoints: ", payload);
          updateInterface((draft) => {
            draft.values = _.keyBy(
              payload.endpoints.map((endp) => ({
                valueId: endp.id,
                value: endp.value,
                localValue: endp.value,
              })),
              (e) => e.valueId
            );
            draft.widgets = payload.endpoints.map((endp) => ({
              settings: {
                valueId: endp.id,
              },
              type: "slider",
              widgetId: `${new Date().getTime()}`,
            }));
          });
        },
        ValueChanged: ({ endpoint, value }) => {
          updateInterface((draft) => {
            draft.values[endpoint].localValue = value;
            draft.values[endpoint].value = value;
          });
        },
      });
    } catch (e) {
      console.error(e);
      console.error("Error occurred while reading message: ", event);
    }
  });

  return {
    type: "remote",
    destroy: () => {
      if (getInterface().source.state.state === "connected") {
        socket.close();
      }
    },
    updateValue: (valueId, value) => {
      if (getInterface().source.state.state === "connected") {
        sendMessage(socket, {
          ValueChanged: {
            endpoint: valueId,
            value: value,
          },
        });
      }
    },
    state: {
      state: "connecting",
      socket,
      code: props.code,
    },
  };
};

type RemoteSourceDisplayProps = {
  interfaceId: string;
};
export const RemoteSourceDisplay: FunctionComponent<RemoteSourceDisplayProps> = ({ interfaceId }) => {
  return (
    <div>
      <p>Remote</p>
    </div>
  );
};
