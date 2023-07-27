import { FunctionComponent, useState } from "react";
import { useInterfaceDisplayStateStore } from "./stores";
import { Interface } from "./Interface";
import { InterfaceEditor } from "./InterfaceEditor";
import { Button } from "../../components/input/Button";

type InterfaceListEntryProps = {
  interfaceId: string;
  brokerType: string;
};
export const InterfaceListEntry: FunctionComponent<InterfaceListEntryProps> = ({ interfaceId, brokerType }) => {
  const [editing, setEditing] = useState(false);
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
      <div className="p-2">
        {canEdit && <Button onClick={() => setEditing(true)}>Edit</Button>}
        <Interface key={interfaceId} interfaceId={interfaceId}></Interface>
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
