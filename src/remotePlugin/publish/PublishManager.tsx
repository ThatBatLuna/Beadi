import { FunctionComponent } from "react";
import { usePublishStateStore } from "./store";
import { Button } from "../../components/input/Button";
import clsx from "clsx";

type PublishManagerProps = {};
export const PublishManager: FunctionComponent<PublishManagerProps> = ({}) => {
  const state = usePublishStateStore((s) => s.state);

  return (
    <div className="p-2 bg-primary-1000 flex flex-col rounded-md">
      {state.state === "disconnected" && <div className="text-center mb-2">Ready to start Remote Control</div>}
      {state.state === "connecting" && <div className="text-center mb-2 animate-pulse">Connecting...</div>}
      {state.state === "connected" && (
        <div className="text-center mb-2">
          <div>Remote Control published at</div>
          <code className="p-1 border-primary-600 block border m-2">{state.id}</code>
        </div>
      )}
      {state.state === "disconnected" && <Button onClick={() => state.publish()}>Start</Button>}
      {state.state !== "disconnected" && <Button onClick={() => state.close()}>Stop</Button>}
    </div>
  );

  // return (
  //   <div>
  //     <div>
  //       {state.state} {state.state === "connected" && <span>{state.id}</span>}
  //     </div>
  //     {state.state !== "disconnected" ? (
  //       <Button
  //         onClick={() => {
  //           state.close();
  //         }}
  //       >
  //         Disconnect
  //       </Button>
  //     ) : (
  //       <Button onClick={() => state.publish()}>Publish</Button>
  //     )}
  //   </div>
  // );
};
