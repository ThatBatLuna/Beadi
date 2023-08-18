import _ from "lodash";
import { Model } from "./compiler";
import { useFileStore } from "./store";
import { useSignalBus } from "./signal";
import { NodeContext } from "./node";
import { usePreviewStore } from "../storage";
import { BeadiInstance } from "..";

/** NodeId -> HandleId -> Value */
type HandleValues = Record<string, Record<string, any>>;
/** NodeId -> Data */
type NodePersistData = Record<string, any>;

const timestep = 1000 / 60;

let timeout: number | null = null;

function runEngineLoop(model: Model, beadi: BeadiInstance) {
  // let last = Date.now();

  const persistentData: NodePersistData = Object.assign(
    {},
    ...model.executionPlan.map((it) => ({ [it.nodeId]: beadi.context.nodeDefs[it.type].executor.initialPersistence }))
  );

  function update() {
    //Prepopulate HandleValues Dictionary with signal data
    const handleValues: HandleValues = {};
    const signals = useSignalBus.getStateWith(beadi).popAll();
    if (!_.isEmpty(signals)) {
      console.log("Signals: ", signals);
    }
    // tempPopSignalBuffer();
    beadi.runHooks("postPrepareSignals");

    // const delta = Date.now() - last;
    // last = Date.now();
    // console.log(1000 / delta);
    //

    //Exeucte all independent outputs before the executionPlan commences

    for (const step of model.preprocessIndependent) {
      const nodeType = beadi.context.nodeDefs[step.type];
      if (nodeType.executor.independentExecutor !== undefined) {
        const persistent = persistentData[step.nodeId];
        const outputs = nodeType.executor.independentExecutor(persistent);
        handleValues[step.nodeId] = outputs.outputs;
      }
    }

    for (const step of model.executionPlan) {
      const nodeContext: NodeContext<any> = {
        id: step.nodeId,
        settings: step.settings,
      };

      const nodeType = beadi.context.nodeDefs[step.type];
      // const inputs = step.dependencies.map((it) => (it.convert ? it.convert(data[it.id]) : data[it.id]));
      const inputs = _.mapValues(step.dependencies, (dependency, handleId) => {
        if (beadi.getNodeInputs(step.type, step.settings)[handleId].type === "impulse") {
          if (dependency !== null) {
            return signals[dependency.nodeId]?.[dependency.handleId] || [];
          } else {
            //There can be signals fired directly to handle inputs (e.g through the ImpulseHandleInput)
            return signals[step.nodeId]?.[handleId] || [];
          }
        } else {
          if (dependency !== null) {
            return handleValues[dependency.nodeId][dependency.handleId];
          } else {
            return useFileStore.getStateWith(beadi).getHandleValue(step.nodeId, handleId);
          }
        }
      });

      const persistent = persistentData[step.nodeId];
      const driverInputs = nodeType.executor.inputDriver?.(nodeContext, beadi);
      // const committedData =
      const outputs = nodeType.executor.executor(inputs, _.cloneDeep(persistent), driverInputs ?? {});

      const nodeTypeOutputs = beadi.getNodeOutputs(step.type, step.settings);
      for (const outputId in nodeTypeOutputs) {
        if (nodeTypeOutputs[outputId].type === "impulse") {
          for (let i = 0; i < (outputs.outputs[outputId] as number); i++) {
            useSignalBus.getStateWith(beadi).emit(step.nodeId, outputId);
          }
          delete outputs.outputs[outputId];
        }
      }

      //Merge new outputs into old outputs to preserve the independently evalutated outputs
      handleValues[step.nodeId] = _.merge({}, handleValues[step.nodeId], outputs.outputs);
      persistentData[step.nodeId] = outputs.persistentData;
      nodeType.executor.outputDriver?.(outputs.driverOutputs, nodeContext, beadi);
    }

    usePreviewStore.setStateWith(beadi, { outputHandlePreviews: handleValues });
    usePreviewStore.getStateWith(beadi).pushSignals(signals);
    timeout = setTimeout(update, timestep) as any;
  }
  timeout = setTimeout(update, timestep) as any;
}

export function restartLoopWithModel(model: Model | null, beadi: BeadiInstance) {
  console.log("UU");
  if (timeout !== null) {
    console.log("Stopping old Engine Loop");
    clearTimeout(timeout);
  }
  if (model !== null) {
    runEngineLoop(model, beadi);
  }
}
