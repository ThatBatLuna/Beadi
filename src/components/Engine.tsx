import _ from "lodash";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Edge, Node } from "reactflow";
import { buildModel } from "../engine";
import { evaluate } from "../engine/evaluate";
import { useDataStore, useDisplayStore } from "../engine/store";
import { useDeepDebounced } from "../hooks/useDeepDebounced";

const timestep = 1000 / 60;

type EngineProps = {
  nodes: Node<any>[];
  edges: Edge<any>[];
};
export const Engine: FunctionComponent<EngineProps> = ({ nodes, edges }) => {
  const [model, setModel] = useState<any>(null);

  const data = useDisplayStore((store) => store.handles);
  const commit = useDataStore((store) => store.commitData);
  const committedData = useDataStore((store) => store.committed, _.isEqual);

  const nodeTypeDataI = useMemo(() => {
    return nodes.map((it) => ({ type: it.type, id: it.id, data: undefined }));
  }, [nodes]);

  const nodeTypeData = useDeepDebounced(nodeTypeDataI);

  useEffect(() => {
    let model = buildModel(nodeTypeData, edges);
    setModel(model);
  }, [nodeTypeData, edges]);

  useEffect(() => {
    let timeout: number | null = null;
    // let last = Date.now();
    function update() {
      // const delta = Date.now() - last;
      // last = Date.now();
      // console.log(1000 / delta);

      const result = evaluate(model, data, committedData);
      commit(result.toCommit);

      timeout = setTimeout(() => update(), timestep) as any;
    }
    // console.log("Starting Updating Loop");
    timeout = setTimeout(() => update(), timestep) as any;
    return () => {
      if (timeout !== null) {
        // console.log("Clearing Updating Loop");
        clearTimeout(timeout);
      }
    };
  }, [model, data, commit, committedData]);
  return <></>;
};
