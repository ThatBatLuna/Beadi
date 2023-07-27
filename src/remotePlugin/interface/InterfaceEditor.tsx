import { FunctionComponent } from "react";
import { useInterfaceFileStore } from "./stores";

type InterfaceEditorProps = {
  interfaceId: string;
};

export const InterfaceEditor: FunctionComponent<InterfaceEditorProps> = ({ interfaceId }) => {
  const iface = useInterfaceFileStore((s) => s.interfaces[interfaceId]);

  return <div>Editor for "{iface.name}"</div>;
};
