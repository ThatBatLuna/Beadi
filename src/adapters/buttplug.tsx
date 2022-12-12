import { FunctionComponent, ReactNode, useCallback, useEffect } from "react";

type Buttplug = any;
type OnButtplugLoaded = (buttplug: Buttplug) => void;

let onLoaded: OnButtplugLoaded | null = null;
let buttplug: Buttplug | null = null;

export function setOnButtplugLoaded(callback: OnButtplugLoaded) {
  if (buttplug !== null) {
    callback(buttplug);
  } else {
    onLoaded = callback;
  }
}

export function setButtplugInstance(instance: Buttplug) {
  if (buttplug !== null) {
    throw new Error("Buttplug instance was already set.");
  } else {
    buttplug = instance;
    instance.buttplugInit().then(() => {
      onLoaded?.(instance);
    });
  }
}

type ButtplugProviderProps = {
  children: ReactNode;
};
export const ButtplugProvider: FunctionComponent<ButtplugProviderProps> = ({
  children,
}) => {
  const onLoaded = useCallback((instance: Buttplug) => {
    console.log("YAYY", instance);

    let connector = new instance.ButtplugWebsocketConnectorOptions();
    connector.address = "ws://localhost:12345";
    let client = new instance.ButtplugClient("Websocket Connection Example");
    client.connect("Developer Guide Example", connector).then((it: any) => {
      console.log("YAYY", it);
    });
  }, []);

  useEffect(() => {
    setOnButtplugLoaded(onLoaded);
  }, [onLoaded]);

  return <>{children}</>;
};
