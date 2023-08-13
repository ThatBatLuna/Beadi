import { FunctionComponent } from "react";
import { Button } from "@beadi/components";
import { usePublishStateStore } from "../storage";

type PublishManagerProps = {};
export const PublishManager: FunctionComponent<PublishManagerProps> = () => {
  const state = usePublishStateStore((s) => s.state);

  return (
    <div className="p-2 bg-primary-1000 flex flex-col rounded-md">
      {state.state === "disconnected" && (
        <div className="text-center mb-2">
          <p>Ready to start Remote Control</p>
          <p>{state.error}</p>
        </div>
      )}
      {state.state === "connecting" && <div className="text-center mb-2 animate-pulse">Connecting...</div>}
      {state.state === "connected" && (
        <div className="text-center mb-2">
          <div>Remote Control published at code</div>
          <code className="p-1 border-primary-600 block border m-2">{state.id}</code>
          <div>Others can enter that code to connect to published Values / Interfaces</div>
        </div>
      )}
      {state.state === "disconnected" && <Button onClick={() => state.publish()}>Start</Button>}
      {state.state !== "disconnected" && <Button onClick={() => state.close()}>Stop</Button>}
    </div>
  );
};
