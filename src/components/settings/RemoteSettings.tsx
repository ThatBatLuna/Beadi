import { FunctionComponent } from "react";
import { Typo } from "../Typo";
import _ from "lodash";
import { Button } from "../input/Button";
import { useRemotePublishStore } from "../remote";
import { Link } from "react-router-dom";

export const RemoteSettings: FunctionComponent<{}> = () => {
  const state = useRemotePublishStore((s) => s.state);
  const funcs = useRemotePublishStore((s) => ({
    connect: s.connect,
    disconnect: s.disconnect,
  }));

  return (
    <div className="flex flex-col w-full gap-2 p-2">
      <Typo>Remote Control</Typo>
      {state.state === "connected" ? (
        <>
          <Button onClick={() => funcs.disconnect()}>
            Stop Remote Control
          </Button>
          <p>
            Remote Control is active via code:{" "}
            <Link
              to={`${process.env.PUBLIC_URL}/remote/${state.id}`}
              target="_blank"
              rel="noreferrer"
              className="underline text-purple-200"
            >
              {state.id}
            </Link>
          </p>
        </>
      ) : (
        <>
          <Button
            disabled={state.state === "connecting"}
            onClick={() => funcs.connect()}
          >
            Start Remote Control
          </Button>
        </>
      )}
    </div>
  );
};
