import { FunctionComponent, useCallback } from "react";
import { Button } from "../components/input/Button";
import { TextInput } from "../components/input/TextInput";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { useFileStore } from "../engine/store";
import { categories } from "./category";
import { emitImpulse, useSignalBus } from "../engine/signal";

// const ButtonMobile: FunctionComponent<MobileViewProps> = ({ id, data }) => {
//   const push = usePushEphermalData(id, "signal");

//   return (
//     <Button onClick={() => push(true)} className="w-full text-lg">
//       {data.name || "Button"}
//     </Button>
//   );
// };

const ButtonNode: FunctionComponent<NodeHeaderProps<{}, {}, any>> = ({ id, data }) => {
  const emit = useSignalBus((s) => s.emit);

  const updateNode = useFileStore((s) => s.updateNode);

  const setNodeName = useCallback(
    (name: string) => {
      updateNode(id, (node) => {
        node.data.name = name;
      });
    },
    [updateNode, id]
  );

  return (
    <div className="flex flex-col gap-2 px-2 ">
      <TextInput label="Label" onChange={setNodeName} value={data.name || ""} id={`${id}__mobile_label`}></TextInput>
      <Button onClick={() => emit(id, "signal")}>Send Signal</Button>
    </div>
  );
};

export const BUTTON_NODE_TYPE = "button";
export const buttonNodeDef = nodeDef()({
  label: "Button",
  category: categories["ui"],
  publishable: true,
  type: BUTTON_NODE_TYPE,
  header: ButtonNode,
  inputs: {
    id: {
      label: "Press",
      type: "impulse",
      default: false,
    },
  },
  outputs: {
    signal: {
      label: "Signal",
      type: "impulse",
    },
  },
  executor: {
    initialPersistence: undefined,
    executor: () => {
      return {
        driverOutputs: {},
        outputs: {
          signal: emitImpulse(0),
        },
        persistentData: {},
      };
    },
  },
});
