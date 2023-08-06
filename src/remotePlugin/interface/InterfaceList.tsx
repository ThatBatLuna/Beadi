import { FunctionComponent, useState } from "react";
import { InterfaceDef, useInterfaceFileStore } from "./interfaceStores";
import { InterfaceEditor } from "./InterfaceEditor";
import { Button } from "../../components/input/Button";
import { MdDelete, MdDeviceHub, MdEdit, MdEditOff } from "react-icons/md";
import { CollapsibleCard } from "../../components/CollapsibleCard";
import { TextInput } from "../../components/input/TextInput";
import _ from "lodash";
import { RemoteStateStore, useRemoteStateStore } from "../remote/remoteStore";
import { notNull } from "../../utils/notNull";
import { Interface } from "./Interface";
import { StoreHandle } from "../../hooks/useDynamicStore";
import { IOValueState, IOValueStore, useIOValueStore } from "../inputOutputStore";
import { usePublishStateStore } from "../publish/publishStore";
import { sendMessage } from "../message";

type InterfaceListEntryProps = {
  interfaceHandle: InterfaceHandle<any>;
};
export const InterfaceListEntry: FunctionComponent<InterfaceListEntryProps> = ({ interfaceHandle }) => {
  const [editing, setEditing] = useState(false);
  const deleteLocalInterface = useInterfaceFileStore((s) => s.deleteInterface);
  // const deleteRemoteInterface = useInterfaceDisplayStore((s) => s.removeRemoteInterface);
  const isLocal = interfaceHandle.brokerType === "local";
  const updateInterface = useInterfaceFileStore((s) => s.updateInterface);

  if (editing && isLocal) {
    return (
      <CollapsibleCard
        header={
          <>
            {!isLocal && <MdDeviceHub className="w-4 h-4 m-2"></MdDeviceHub>}
            {isLocal && <span className="w-4 mx-2">L</span>}
            <div className="grow">
              <TextInput
                value={interfaceHandle.interfaceDef.name}
                onChange={(e) =>
                  updateInterface(interfaceHandle.interfaceDef.interfaceId, (d) => {
                    d.name = e;
                  })
                }
                id={`name_${interfaceHandle.interfaceDef.interfaceId}`}
              ></TextInput>
            </div>
            <Button onClick={() => deleteLocalInterface(interfaceHandle.interfaceDef.interfaceId)} icon={<MdDelete />}></Button>
            <Button onClick={() => setEditing(false)} icon={<MdEditOff />}></Button>
          </>
        }
      >
        <InterfaceEditor interfaceDef={interfaceHandle.interfaceDef}></InterfaceEditor>
      </CollapsibleCard>
    );
  } else {
    return (
      <CollapsibleCard
        header={
          <>
            {!isLocal && <MdDeviceHub className="w-4 h-4 m-2"></MdDeviceHub>}
            {isLocal && <span className="w-4 mx-2">L</span>}
            <span>{interfaceHandle.interfaceDef.name}</span>
            <div className="grow"></div>
            {/* <Button onClick={() => deleteRemoteInterface(interfaceId)} icon={<MdDelete />}></Button> */}
            {isLocal && <Button onClick={() => setEditing(true)} icon={<MdEdit />}></Button>}
          </>
        }
      >
        <Interface interfaceHandle={interfaceHandle}></Interface>
      </CollapsibleCard>
    );
  }
};

export type InterfaceHandle<TValueStore> = {
  interfaceDef: InterfaceDef;
  brokerType: "local" | "remote";
  valueStoreHandle: StoreHandle<TValueStore, Record<string, IOValueState<any>> | null>;
  updateValue: (valueId: string, value: any) => void;
  emitSignal: (valueId: string, data: any) => void;
};

type InterfaceListProps = {};
export const InterfaceList: FunctionComponent<InterfaceListProps> = () => {
  const localInterfaces = useInterfaceFileStore((s) =>
    Object.values(s.interfaces).map(
      (it) =>
        ({
          interfaceDef: it,
          brokerType: "local",
          valueStoreHandle: {
            getState: () => useIOValueStore.getState(),
            subscribe: (listener) => useIOValueStore.subscribe(listener),
            selectData: (store) => store.values,
          },
          updateValue: (valueId, value) => {
            // console.log("Local Update Value: ", valueId, value);
            usePublishStateStore.getState().state.updateValue(valueId, value);
          },
          emitSignal: (valueId, data) => {
            // console.log("Local Emit Signal: ", valueId, data);
            usePublishStateStore.getState().state.emitSignal(valueId, data);
          },
        } satisfies InterfaceHandle<IOValueStore>)
    )
  );
  const remoteInterfaces = useRemoteStateStore((s) =>
    Object.values(s.remotes)
      .flatMap((remote) => {
        if (remote.state.state === "connected") {
          return Object.values(remote.state.interfaces).map(
            (it) =>
              ({
                interfaceDef: it,
                brokerType: "remote",
                valueStoreHandle: {
                  getState: () => useRemoteStateStore.getState(),
                  subscribe: (listener) => useRemoteStateStore.subscribe(listener),
                  selectData: (store) => {
                    const r = store.remotes[remote.definition.remoteConnectionId];
                    if (r.state.state === "connected") {
                      return r.state.values;
                    } else {
                      return null;
                    }
                  },
                },
                updateValue: (valueId, value) => {
                  // console.log("Remote Update Value: ", valueId, value);
                  const r = useRemoteStateStore.getState().remotes[remote.definition.remoteConnectionId];
                  if (r.state.state === "connected") {
                    sendMessage(r.state.socket, {
                      ValueChanged: {
                        endpoint: valueId,
                        value: value,
                      },
                    });
                  }
                },
                emitSignal: (valueId, data) => {
                  console.log("Remote Emit Signal: ", valueId, data);
                  const r = useRemoteStateStore.getState().remotes[remote.definition.remoteConnectionId];
                  if (r.state.state === "connected") {
                    sendMessage(r.state.socket, {
                      EmitSignal: {
                        endpoint: valueId,
                        value: data ?? null,
                      },
                    });
                  }
                },
              } satisfies InterfaceHandle<RemoteStateStore>)
          );
        } else {
          return null;
        }
      })
      .filter(notNull)
  );

  // const interfaces = useInterfaceDisplayStateStore(
  //   (s) =>
  //     Object.entries(s.interfaces).map(([interfaceId, iface]) => ({
  //       interfaceId,
  //       brokerType: iface.brokerType,
  //     })),
  //   _.isEqual
  // );

  // console.log(interfaces);

  return (
    <ul>
      {localInterfaces.map((handle) => (
        <li key={handle.interfaceDef.interfaceId} className="my-2">
          <InterfaceListEntry interfaceHandle={handle}></InterfaceListEntry>
        </li>
      ))}
      {remoteInterfaces.map((handle) => (
        <li key={handle.interfaceDef.interfaceId} className="my-2">
          <InterfaceListEntry interfaceHandle={handle}></InterfaceListEntry>
        </li>
      ))}
    </ul>
  );
};
