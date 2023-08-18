import { BeadiEditor, BeadiInstance, useBeadi } from "@beadi/engine";
import { FunctionComponent, useMemo } from "react";

export const EditorPage: FunctionComponent = () => {
  const beadiContext = useBeadi();
  const instance = useMemo(() => {
    return new BeadiInstance({
      beadiContext,
      initialData: {},
    });
  }, [beadiContext]);
  return <BeadiEditor instance={instance}></BeadiEditor>;
};
