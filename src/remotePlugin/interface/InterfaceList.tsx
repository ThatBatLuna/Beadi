import { FunctionComponent, useState } from "react";
import { useInterfaceDisplayStateStore, useInterfaceDisplayStore, useInterfaceFileStore } from "./stores";
import { Interface } from "./Interface";
import { InterfaceEditor } from "./InterfaceEditor";
import { Button } from "../../components/input/Button";
import { MdDelete, MdDeviceHub, MdEdit, MdEditOff, MdExpandLess, MdExpandMore, MdMore } from "react-icons/md";

type InterfaceListEntryProps = {
  interfaceId: string;
  brokerType: string;
};
export const InterfaceListEntry: FunctionComponent<InterfaceListEntryProps> = ({ interfaceId, brokerType }) => {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const deleteLocalInterface = useInterfaceFileStore((s) => s.deleteInterface);
  const deleteRemoteInterface = useInterfaceDisplayStore((s) => s.removeRemoteInterface);
  const isLocal = brokerType === "local";

  if (editing && isLocal) {
    return (
      <div className="p-2 bg-primary-1000 rounded-md my-2">
        <div className="flex flex-row">
          {!isLocal && <MdDeviceHub></MdDeviceHub>}
          {isLocal && <span>L</span>}
          <div className="grow"></div>
          <Button onClick={() => setEditing(false)} icon={<MdEditOff />}></Button>
          <Button onClick={() => deleteLocalInterface(interfaceId)} icon={<MdDelete />}></Button>
        </div>
        <InterfaceEditor interfaceId={interfaceId}></InterfaceEditor>
      </div>
    );
  } else {
    return (
      <div className="p-2 bg-primary-1000 rounded-md my-2">
        <div className="flex flex-row">
          {!isLocal && <MdDeviceHub></MdDeviceHub>}
          {isLocal && <span>L</span>}
          <div className="grow"></div>
          <Button onClick={() => deleteRemoteInterface(interfaceId)} icon={<MdDelete />}></Button>
          {isLocal && <Button onClick={() => setEditing(true)} icon={<MdEdit />}></Button>}
          {!expanded && <Button onClick={() => setExpanded(true)} icon={<MdExpandMore />}></Button>}
          {expanded && <Button onClick={() => setExpanded(false)} icon={<MdExpandLess />}></Button>}
        </div>
        {expanded && <Interface key={interfaceId} interfaceId={interfaceId}></Interface>}
      </div>
    );
  }
};

type InterfaceListProps = {};
export const InterfaceList: FunctionComponent<InterfaceListProps> = ({}) => {
  const interfaces = useInterfaceDisplayStateStore((s) =>
    Object.entries(s.interfaces).map(([interfaceId, iface]) => ({
      interfaceId,
      brokerType: iface.brokerType,
    }))
  );

  return (
    <ul>
      {interfaces.map(({ interfaceId, brokerType }) => (
        <li key={interfaceId}>
          <InterfaceListEntry interfaceId={interfaceId} brokerType={brokerType}></InterfaceListEntry>
        </li>
      ))}
    </ul>
  );
};
