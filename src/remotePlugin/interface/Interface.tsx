import { FunctionComponent } from "react";
import { useInterfaceDisplayStateStore } from "./stores";

type InterfaceProps = {
  interfaceId: string;
};
export const Interface: FunctionComponent<InterfaceProps> = ({ interfaceId }) => {
  const interfaceState = useInterfaceDisplayStateStore((s) => s.interfaces[interfaceId]);

  return <div>{JSON.stringify(interfaceState)}</div>;
};
