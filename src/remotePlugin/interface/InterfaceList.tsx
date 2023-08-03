import { FunctionComponent, useState } from "react";
import { useInterfaceDisplayStateStore, useInterfaceFileStore } from "./stores";
import { Interface } from "./Interface";
import { InterfaceEditor } from "./InterfaceEditor";
import { Button } from "../../components/input/Button";
import { MdDelete, MdDeviceHub, MdEdit, MdEditOff, MdExpandLess, MdExpandMore } from "react-icons/md";
import { CollapsibleCard } from "../../components/CollapsibleCard";
import { TextInput } from "../../components/input/TextInput";

type InterfaceListEntryProps = {
  interfaceId: string;
  brokerType: string;
};
export const InterfaceListEntry: FunctionComponent<InterfaceListEntryProps> = ({ interfaceId, brokerType }) => {
  const [editing, setEditing] = useState(false);
  const deleteLocalInterface = useInterfaceFileStore((s) => s.deleteInterface);
  // const deleteRemoteInterface = useInterfaceDisplayStore((s) => s.removeRemoteInterface);
  const isLocal = brokerType === "local";
  const iface = useInterfaceDisplayStateStore((s) => s.interfaces[interfaceId]);
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
                value={iface.def.name}
                onChange={(e) =>
                  updateInterface(interfaceId, (d) => {
                    d.name = e;
                  })
                }
                id={`name_${interfaceId}`}
              ></TextInput>
            </div>
            <Button onClick={() => deleteLocalInterface(interfaceId)} icon={<MdDelete />}></Button>
            <Button onClick={() => setEditing(false)} icon={<MdEditOff />}></Button>
          </>
        }
      >
        <InterfaceEditor interfaceId={interfaceId}></InterfaceEditor>
      </CollapsibleCard>
    );
  } else {
    return (
      <CollapsibleCard
        header={
          <>
            {!isLocal && <MdDeviceHub className="w-4 h-4 m-2"></MdDeviceHub>}
            {isLocal && <span className="w-4 mx-2">L</span>}
            <span>{iface.def.name}</span>
            <div className="grow"></div>
            {/* <Button onClick={() => deleteRemoteInterface(interfaceId)} icon={<MdDelete />}></Button> */}
            {isLocal && <Button onClick={() => setEditing(true)} icon={<MdEdit />}></Button>}
          </>
        }
      >
        <Interface key={interfaceId} interfaceId={interfaceId}></Interface>
      </CollapsibleCard>
    );
  }
};

type InterfaceListProps = {};
export const InterfaceList: FunctionComponent<InterfaceListProps> = () => {
  const interfaces = useInterfaceDisplayStateStore((s) =>
    Object.entries(s.interfaces).map(([interfaceId, iface]) => ({
      interfaceId,
      brokerType: iface.brokerType,
    }))
  );

  return (
    <ul>
      {interfaces.map(({ interfaceId, brokerType }) => (
        <li key={interfaceId} className="my-2">
          <InterfaceListEntry interfaceId={interfaceId} brokerType={brokerType}></InterfaceListEntry>
        </li>
      ))}
    </ul>
  );
};
