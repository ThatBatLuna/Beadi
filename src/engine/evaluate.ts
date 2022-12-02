import { Model } from ".";

export type EvaluateResult = {
  toCommit: Record<string, any>;
};

export function evaluate(
  model: Model,
  data: Record<string, any>
): EvaluateResult {
  if (model === null) {
    return { toCommit: {} };
  }

  let commit: Record<string, any> = {};

  for (const step of model.executionPlan) {
    const inputs = step.dependencies.map((it) => data[it]);
    const doCommit = (handle: string, value: any) => {
      commit[`${step.nodeId}__commit__${handle}`] = value;
    };
    const outputs = step.func(inputs, doCommit);
    for (let i = 0; i < step.outpus.length; i++) {
      data[step.outpus[i]] = outputs[i];
    }
  }
  return {
    toCommit: commit,
  };
}
