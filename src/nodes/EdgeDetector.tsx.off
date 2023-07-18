import { FunctionComponent, useCallback } from "react";
import { Button } from "../components/input/Button";
import { TextInput } from "../components/input/TextInput";
import { MobileViewProps, NodeDef, NodeHeaderProps } from "../engine/node";
import { usePushEphermalData, useSetNodeName } from "../engine/store";
import { categories } from "./category";

const Mobile: FunctionComponent<MobileViewProps> = ({ id, data }) => {
  return <></>;
};

const Header: FunctionComponent<NodeHeaderProps> = ({ id, data }) => {
  return <></>;
};

export const RAISING_EDGE_DETECTOR_TYPE = "edgeDetector";
export const edgeDetectorNodeDef: NodeDef = {
  label: "On Raising Edge",
  category: categories["control"],
  type: RAISING_EDGE_DETECTOR_TYPE,
  header: Header,
  inputs: [
    {
      id: "value",
      label: "Value",
      type: "boolean",
      default: false,
    },
  ],
  outputs: [
    {
      id: "signal",
      label: "Signal",
      type: "impulse",
    },
  ],
  executor: ([v], { commit, committed }) => {
    const last = committed["last"] ?? false;
    commit("last", v);
    return [v && !last];
  },
};
