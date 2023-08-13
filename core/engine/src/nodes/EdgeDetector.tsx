import { FunctionComponent } from "react";
import { NodeHeaderProps, nodeDef } from "../engine/node";
import { categories } from "./category";
import { useFileStore } from "../storage";
import { emitImpulse } from "../engine/signal";

type EdgeDetectorNodeSettings = {
  raising: boolean;
};

const EdgeDetectorWaveNode: FunctionComponent<NodeHeaderProps<{}, EdgeDetectorNodeSettings, any>> = ({ id, data }) => {
  // const [positive, setPositive] = useInputHandleData<boolean>(id, "positive");
  const updateNode = useFileStore((s) => s.updateNode);

  const setPositive = (p: boolean) => {
    updateNode(id, (r) => {
      (r.data.settings as EdgeDetectorNodeSettings).raising = p;
    });
  };

  return (
    <div className="px-2">
      <label>
        <input type="checkbox" checked={data.settings.raising ?? true} onChange={(e) => setPositive(e.target.checked)} />
        <span className="pl-2">Raising Edge</span>
      </label>
    </div>
  );
};

export const RAISING_EDGE_DETECTOR_TYPE = "edgeDetector";
export const edgeDetectorNodeDef = nodeDef<EdgeDetectorNodeSettings>()({
  label: "Boolean Edge",
  category: categories["control"],
  type: RAISING_EDGE_DETECTOR_TYPE,
  header: EdgeDetectorWaveNode,
  inputs: {
    value: {
      id: "value",
      label: "Value",
      type: "boolean",
      default: false,
    },
  },
  outputs: {
    signal: {
      id: "signal",
      label: "Edge",
      type: "impulse",
    },
  },
  executor: {
    initialPersistence: {
      last: null as boolean | null,
    },
    inputDriver: (context) => {
      return {
        raising: context.settings.raising ?? true,
      };
    },

    executor: ({ value }, { last }, { raising }) => {
      const detected = raising ? last === false && value === true : last === true && value === false;
      return {
        driverOutputs: {},
        persistentData: {
          last: value,
        },
        outputs: {
          signal: emitImpulse(detected ? 1 : 0),
        },
      };
    },
  },
});
