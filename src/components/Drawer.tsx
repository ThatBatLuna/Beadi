import { FunctionComponent, useCallback, useMemo } from "react";
import { useReactFlow } from "reactflow";
import { nodeDefs } from "../engine/node";
import { useDataStore } from "../engine/store";

const Drawer: FunctionComponent<{}> = (a) => {
  const nodes = useMemo(() => {
    return Object.values(nodeDefs);
  }, []);

  const addNode = useDataStore((state) => state.addNode);

  const handleClick = useCallback(
    (type: string) => {
      addNode(type);
    },
    [addNode]
  );

  return (
    <div className="bg-slate-800 w-60">
      <ul>
        {nodes.map((node) => (
          <li onClick={() => handleClick(node.type)}>{node.type}</li>
        ))}
      </ul>
    </div>
  );
};

export default Drawer;
