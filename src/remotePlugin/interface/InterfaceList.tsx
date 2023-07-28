import { FunctionComponent, useState } from "react";
import { useInterfaceDisplayStateStore } from "./stores";
import { Interface } from "./Interface";
import { InterfaceEditor } from "./InterfaceEditor";
import { Button } from "../../components/input/Button";
import { MdDeviceHub, MdEdit, MdExpandLess, MdExpandMore, MdMore } from "react-icons/md";

type InterfaceListEntryProps = {
  interfaceId: string;
  brokerType: string;
};
export const InterfaceListEntry: FunctionComponent<InterfaceListEntryProps> = ({ interfaceId, brokerType }) => {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const canEdit = brokerType === "local";

  if (editing && canEdit) {
    return (
      <div className="p-2">
        <Button onClick={() => setEditing(false)}>Exit Editor</Button>
        <InterfaceEditor interfaceId={interfaceId}></InterfaceEditor>;
      </div>
    );
  } else {
    return (
      <div className="p-2 bg-primary-1000 rounded-md my-2">
        <div className="flex flex-row">
          {!canEdit && <MdDeviceHub></MdDeviceHub>}
          {canEdit && <span>L</span>}
          <div className="grow"></div>
          {canEdit && <Button onClick={() => setEditing(true)} icon={<MdEdit />}></Button>}
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
