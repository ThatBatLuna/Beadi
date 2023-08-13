import { useFileStore } from "./store";
import _ from "lodash";
import { ModelSources, buildModel, useModelState } from "./compiler";
import { restartLoopWithModel } from "./runner";
import { BeadiContext } from "../context";

export function watchForChanges(beadi: BeadiContext) {
  useFileStore.subscribeWith(beadi, (store) => {
    const newNodes = _.mapValues(store.data.nodes, (it) => ({
      id: it.id,
      type: it.type,
      settings: it.data.settings,
    }));
    const newEdges = _.sortBy(
      Object.values(store.data.edges).map((it) => ({
        id: it.id,
        source: it.source,
        target: it.target,
        sourceHandle: it.sourceHandle,
        targetHandle: it.targetHandle,
      })),
      (it) => it.id
    );
    const newState: ModelSources = {
      nodes: newNodes,
      edges: newEdges,
    };
    if (!_.isEqual(newState, useModelState.getStateWith(beadi).sources)) {
      useModelState.setStateWith(beadi, {
        sources: newState,
        model: buildModel(newState, beadi),
      });
    }
  });

  useModelState.subscribeWith(beadi, (state) => {
    restartLoopWithModel(state.model, beadi);
  });
}

/*

Constant 2 --->  Add 1 --\
           \->             ->  Add 4 ---> Display 5
                           -> 
          Constant 3 -----/


//Execution Plan
[
  2,
  1,
  3,
  4,
  5
]

//Nodes
{
  1: {
    inputs: [2_value, 2_value],
    exec: [FUNCTION, adds both inputs and writes 1_sum]
  }
  2: {
    inputs: [2_ivalue],
    exec: [FUNCTION, forwards input to 2_value]
  }
  3: {
    inputs: [2_ivalue],
    exec: [FUNCTION, forwards input to 2_value]
  }
  4: {
    inputs: [1_sum, 3_value],
    exec: [FUNCTION, adds both inputs and writes 4_sum]
  }
  5: {
    inputs: [4_sum],
    exec: [FUNCTION, displays 4_sum]
  }
}

//Datas
{
  2_ivalue: 1,
  3_ivalue: 2
}


*/
