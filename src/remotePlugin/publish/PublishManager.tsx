import { FunctionComponent } from "react";
import { usePublishStateStore } from "./store";
import { Button } from "../../components/input/Button";

type PublishManagerProps = {};
export const PublishManager: FunctionComponent<PublishManagerProps> = ({}) => {
  const state = usePublishStateStore((s) => s.state);

  return (
    <div>
      <div>
        {state.state} {state.state === "connected" && <span>{state.id}</span>}
      </div>
      {state.state !== "disconnected" ? (
        <Button
          onClick={() => {
            state.close();
          }}
        >
          Disconnect
        </Button>
      ) : (
        <Button onClick={() => state.publish()}>Publish</Button>
      )}
    </div>
  );
};
