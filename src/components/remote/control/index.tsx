import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRemoteControlStore } from "./store";
import { RemoteControlEndpoint } from "../message";

type RemoteControlProps = {
  endpoint: RemoteControlEndpoint;
};
export const RemoteControlSlider: FunctionComponent<RemoteControlProps> = ({
  endpoint,
}) => {
  const setValue = useRemoteControlStore((s) => s.setEndpointValue);

  const [state, setRawState] = useState(endpoint.value);

  const id = endpoint.id;
  const setState = useCallback(
    (value: number) => {
      setValue(id, value);
      setRawState(value);
    },
    [setRawState, setValue, id]
  );

  return (
    <div>
      <p>
        {endpoint.id} ({endpoint.type}) = {endpoint.value}
      </p>
      <input
        type="range"
        step="0.1"
        min="0"
        max="1"
        value={state}
        onChange={(e) => setState(parseFloat(e.target.value))}
      ></input>
    </div>
  );
};

export const RemoteControlPage: FunctionComponent<{}> = ({}) => {
  const { connect, disconnect, state } = useRemoteControlStore();
  const { id } = useParams();

  //The store connect method debounces the id so this is fine... yet yucky
  useEffect(() => {
    if (id !== undefined) {
      connect(id);
    } else {
      disconnect();
    }
  }, [id, connect, disconnect]);

  if (state.state === "connecting") {
    return <p>Connecting to {state.id}</p>;
  } else if (state.state === "connected") {
    return (
      <div>
        <p>Remote Control for {state.id}</p>
        <ul>
          {Object.values(state.endpoints).map((endpoint) => (
            <RemoteControlSlider endpoint={endpoint}></RemoteControlSlider>
          ))}
        </ul>
      </div>
    );
  }
  return <p>Disconnected.</p>;
};
