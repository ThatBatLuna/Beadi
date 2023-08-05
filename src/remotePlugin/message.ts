import { HandleType } from "../engine/node";
import { Interface } from "./interface/interfaceStores";

type RemoteControlWidget = {
  widgetId: string;
  widgetType: string;
  settings: any;
};
export type RemoteControlInterface = {
  name: string;
  interfaceId: string;
  layout: RemoteControlWidget[];
};
export type RemoteControlEndpointDef = {
  valueId: string;
  type: HandleType;
  name: string;
  writeable: boolean;
};
export type RemoteControlEndpoint = {
  value: number;
  def: RemoteControlEndpointDef;
};

export type BeadiMessage = {
  Welcome?: {
    id: string;
  };
  PublishEndpoints?: {
    endpoints: RemoteControlEndpoint[];
  };
  PublishInterfaces?: {
    interfaces: Interface[];
  };
  WelcomeController?: {
    endpoints: RemoteControlEndpoint[];
    interfaces: Interface[];
    id: string;
  };
  ValueChanged?: {
    endpoint: string;
    value: number;
  };
  EmitSignal?: {
    endpoint: string;
    value: any;
  };
};

type BeadiMessageHandlers = {
  [k in keyof BeadiMessage]?: (data: Required<BeadiMessage>[k]) => void;
};

export function handleMessage(message: BeadiMessage, handlers: BeadiMessageHandlers) {
  for (const key in message) {
    const k = key as keyof BeadiMessage;
    if (k in handlers) {
      const handler = handlers[k];
      if (handler !== undefined) {
        handler(message[k] as any);
      }
    }
  }
}

export function sendMessage(socket: WebSocket, message: BeadiMessage) {
  Object.entries(message).forEach(([key, payload]) => {
    const data = JSON.stringify({ [key]: payload });
    // console.log("Sending ", socket, data);
    socket.send(data);
  });
}
