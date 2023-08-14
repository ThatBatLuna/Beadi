import { FunctionComponent } from "react";
import { useIntifaceStore } from "../storage";
import { Button, CollapsibleCard, Typo } from "@beadi/components";
import { IntifaceConnection } from "../intifaceStore";
import { clsx } from "clsx";
import { MdClose, MdDelete, MdRefresh, MdWifi, MdWifiOff } from "react-icons/md";
import _ from "lodash";

type IntifaceConnectionListEntryProps = {
  connection: IntifaceConnection;
};
export const IntifaceConnectionListEntry: FunctionComponent<IntifaceConnectionListEntryProps> = ({ connection }) => {
  const removeConnection = useIntifaceStore((s) => s.removeConnection);

  const state = connection.state;

  return (
    <CollapsibleCard
      header={
        <>
          {state.state === "disconnected" ? (
            <MdWifiOff className="h-6 w-6 block" />
          ) : (
            <MdWifi
              className={clsx("h-6 w-6 block", {
                "animate-pulse": state.state === "connecting",
              })}
            />
          )}
          <div className="px-2">{connection.def.url}</div>
          <div className="grow"></div>
          {state.state === "disconnected" ? (
            <>
              <Button onClick={() => removeConnection(connection.def.connectionId)} icon={<MdDelete />}></Button>
            </>
          ) : (
            <Button onClick={() => state.disconnect()} icon={<MdClose />}></Button>
          )}
        </>
      }
      forceExpanded={state.state === "disconnected" ? true : undefined}
    >
      {state.state === "connected" ? (
        <div>
          <ul className={clsx({ "animate-pulse": state.scanning })}>
            {_.values(state.devices).map((it) => (
              <li className="py-2 px-2 -mx-2 border-b border-b-primary-600" key={it.deviceIndex}>
                <div className="flex flex-row justify-between w-full">
                  <Typo element="h3">{it.displayName}</Typo>
                  {it.displayName !== it.name && <Typo element="small">{it.name}</Typo>}
                </div>
                <ul className="px-2">
                  {it.actuactors.map((actuator, index) => (
                    <li key={index}>
                      <p>{actuator.actuatorType}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="flex flex-row my-2 justify-center">
            {state.scanning ? (
              <Button onClick={() => state.stopScan()} icon={<MdRefresh className="animate-spin" />}>
                Stop Scan
              </Button>
            ) : (
              <Button onClick={() => state.startScan()} icon={<MdRefresh />}>
                Scan
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-center my-2">
          {state.state === "connecting" ? (
            <Button disabled={true} className="animate-pulse">
              Connect
            </Button>
          ) : (
            <Button onClick={() => state.connect()}>Connect</Button>
          )}
        </div>
      )}
    </CollapsibleCard>
  );
};

type IntifaceConnectionListProps = {};
export const IntifaceConnectionList: FunctionComponent<IntifaceConnectionListProps> = ({}) => {
  const connections = useIntifaceStore((s) => s.connections);

  return (
    <ul className="flex flex-col gap-2">
      {Object.values(connections).map((it) => (
        <li key={it.def.connectionId}>
          <IntifaceConnectionListEntry connection={it}></IntifaceConnectionListEntry>
        </li>
      ))}
    </ul>
  );
};
