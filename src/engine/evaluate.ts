import _ from "lodash";
import { Model } from ".";

export type EvaluateResult = {
  toCommit: Record<string, Record<string, any>>;
};

export function evaluate(
  model: Model,
  data: Record<string, any>,
  committedData: Record<string, Record<string, any>>,
  ephermalData: Record<string, Record<string, any>>
): EvaluateResult {
  if (model === null) {
    return { toCommit: {} };
  }

  let commit: Record<string, Record<string, any>> = {};

  for (const step of model.executionPlan) {
    const inputs = step.dependencies.map((it) =>
      it.convert ? it.convert(data[it.id]) : data[it.id]
    );

    let nodeCommit: Record<string, any> = {};
    const doCommit = (handle: string, value: any) => {
      nodeCommit[handle] = value;
    };
    // const committedData =
    const outputs = step.func(inputs, {
      commit: doCommit,
      committed: committedData[step.nodeId] || {},
      ephermal: ephermalData[step.nodeId] || {},
    });
    for (let i = 0; i < step.outpus.length; i++) {
      data[step.outpus[i]] = outputs[i];
    }

    if (!_.isEmpty(nodeCommit)) {
      commit[step.nodeId] = nodeCommit;
    }
  }
  return {
    toCommit: commit,
  };
}
