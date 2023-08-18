import { BeadiEdge, BeadiPersistentData, UnknownBeadiNode } from "@beadi/engine";
import _ from "lodash";

export const previewSave: BeadiPersistentData = {
  nodes: {
    nodes: _.keyBy(
      [
        {
          id: "waveA",
          position: {
            x: 100,
            y: 100,
          },
          type: "wave",
          data: {
            displaySettings: {},
            handles: {
              amplitude: {
                value: 1.0,
                preview: false,
              },
              frequency: {
                value: 0.2,
                preview: false,
              },
              phase: {
                value: 0.0,
                preview: false,
              },
            },
            settings: {},
            name: "Wave",
          },
        } satisfies UnknownBeadiNode,
        {
          id: "waveB",
          position: {
            x: 120,
            y: 500,
          },
          type: "wave",
          data: {
            displaySettings: {},
            handles: {
              amplitude: {
                value: 1.0,
                preview: false,
              },
              frequency: {
                value: 0.2,
                preview: false,
              },
              phase: {
                value: 0.0,
                preview: false,
              },
            },
            settings: {},
            name: "Wave",
          },
        } satisfies UnknownBeadiNode,
        {
          id: "mix",
          position: {
            x: 400,
            y: 250,
          },
          type: "math",
          data: {
            displaySettings: {},
            handles: {
              result: {
                preview: true,
                value: 0.0,
              },
            },
            settings: {
              operation: "mix",
            },
          },
        } satisfies UnknownBeadiNode,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
      (it) => it.id
    ),
    edges: _.keyBy(
      [
        {
          id: "waveA_mix",
          source: "waveA",
          sourceHandle: "value",
          target: "mix",
          targetHandle: "a",
        },
        {
          id: "waveB_mix",
          source: "waveB",
          sourceHandle: "value",
          target: "mix",
          targetHandle: "b",
        },
      ] satisfies BeadiEdge[],
      (it) => it.id
    ),
  },
};
