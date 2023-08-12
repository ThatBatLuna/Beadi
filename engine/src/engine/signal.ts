import create from "zustand";

export type SignalEmission<T> = {
  timestamp: Date;
  arguments: T;
};
export type SignalEmissions<T> = SignalEmission<T>[];
export type ImpulseEmissions = SignalEmissions<undefined>[];

type SignalBus = {
  /** NodeId -> HandleId -> SignalEmissions */
  nodeSignals: Record<string, Record<string, SignalEmissions<any>>>;

  emit: (nodeId: string, handleId: string, data?: any) => void;
  //   pop: (nodeId: string, handleId: string) => SignalEmissions<any>;
  popAll: () => Record<string, Record<string, SignalEmissions<any>>>;
};

export const useSignalBus = create<SignalBus>()((set, get) => ({
  nodeSignals: {},
  emit: (nodeId, handleId, data) => {
    set((signals) => ({
      nodeSignals: {
        ...signals.nodeSignals,
        [nodeId]: {
          ...signals.nodeSignals[nodeId],
          [handleId]: [...(signals.nodeSignals[nodeId]?.[handleId] || []), data ?? null],
        },
      },
    }));
  },
  popAll: () => {
    const signals = get().nodeSignals;
    set({
      nodeSignals: {},
    });
    return signals;
  },
  //   pop: (nodeId, handleId) => {
  //     const signals = get().nodeSignals[nodeId]?.[handleId];
  //     set((signals) => ({
  //       nodeSignals: {
  //         ...signals.nodeSignals,
  //         [nodeId]: {
  //           ...signals.nodeSignals[nodeId],
  //           [handleId]: [],
  //         },
  //       },
  //     }));
  //     return signals;
  //   },
}));

/** Solely exists to make the code more readable when returning impulses from executors */
export function emitImpulse(times?: number): number {
  return times ?? 1;
}
