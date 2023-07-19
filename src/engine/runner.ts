import _ from "lodash";
import { Model, modelState } from "./compiler";
import { useFileStore } from "./store";
import { useSignalBus } from "./signal";
import { NodeContext, OutputTypeOf, nodeDef } from "./node";
import { nodeDefs } from "../registries";
import { usePreviewStore } from "./preview";

/** NodeId -> HandleId -> Value */
type HandleValues = Record<string, Record<string, any>>;
/** NodeId -> Data */
type NodePersistData = Record<string, any>;

const timestep = 1000 / 60;

let timeout: number | null = null;

function runEngineLoop(model: Model) {
  // let last = Date.now();

  const persistentData: NodePersistData = Object.assign(
    {},
    ...model.executionPlan.map((it) => ({ [it.nodeId]: nodeDefs[it.type].executor.initialPersistence }))
  );

  function update() {
    //Prepopulate HandleValues Dictionary with signal data
    const handleValues: HandleValues = {};
    const signals = useSignalBus.getState().popAll();

    // const delta = Date.now() - last;
    // last = Date.now();
    // console.log(1000 / delta);
    //
    for (const step of model.executionPlan) {
      const nodeContext: NodeContext<any> = {
        id: step.nodeId,
        settings: step.settings,
      };

      const nodeType = nodeDefs[step.type];
      // const inputs = step.dependencies.map((it) => (it.convert ? it.convert(data[it.id]) : data[it.id]));
      const inputs = _.mapValues(step.dependencies, (dependency, handleId) => {
        if (nodeType.inputs[handleId].type === "impulse") {
          if (dependency !== null) {
            return signals[dependency.nodeId]?.[dependency.handleId] || [];
          } else {
            return [];
          }
        } else {
          if (dependency !== null) {
            return handleValues[dependency.nodeId][dependency.handleId];
          } else {
            return useFileStore.getState().getHandle(step.nodeId, handleId);
          }
        }
      });

      const persistent = persistentData[step.nodeId];
      const driverInputs = nodeType.executor.inputDriver?.(nodeContext);
      // const committedData =
      const outputs = nodeType.executor.executor(inputs, persistent, driverInputs ?? {});

      for (const outputId in nodeType.outputs) {
        if (nodeType.outputs[outputId].type === "impulse") {
          for (let i = 0; i < (outputs.outputs[outputId] as number); i++) {
            useSignalBus.getState().emit(step.nodeId, outputId);
          }
          delete outputs.outputs[outputId];
        }
      }

      handleValues[step.nodeId] = outputs.outputs;
      persistentData[step.nodeId] = outputs.persistentData;
      nodeType.executor.outputDriver?.(outputs.driverOutputs, nodeContext);
    }

    usePreviewStore.setState({ outputHandlePreviews: handleValues });
    timeout = setTimeout(update, timestep) as any;
  }
  timeout = setTimeout(update, timestep) as any;
}

export function restartLoopWithModel(model: Model | null) {
  if (timeout !== null) {
    console.log("Stopping old Engine Loop");
    clearTimeout(timeout);
  }
  if (model !== null) {
    runEngineLoop(model);
  }
}
