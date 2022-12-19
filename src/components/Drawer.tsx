import _ from "lodash";
import { FunctionComponent, useCallback, useMemo } from "react";
import { nodeDefs } from "../engine/node";
import { useDisplayStore } from "../engine/store";
import { Typo } from "./Typo";

const Drawer: FunctionComponent<{}> = (a) => {
  const nodes = useMemo(() => {
    return _.chain(Object.values(nodeDefs))
      .groupBy((it) => it.category.label)
      .map((value, key) => ({
        name: key,
        color: value[0].category.color,
        items: value,
      }))
      .value();
  }, []);

  const addNode = useDisplayStore((state) => state.addNode);

  const handleClick = useCallback(
    (type: string) => {
      addNode(type);
    },
    [addNode]
  );

  return (
    <div className="bg-primary-900 w-60">
      <ul>
        {nodes.map((category, index) => (
          <li key={category.name} className="mb-2">
            <h2
              className="px-2 py-1 font-bold text-black"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </h2>
            <ul>
              {category.items.map((node, index) => (
                <li
                  key={index}
                  draggable
                  className="p-1 px-4 text-white cursor-pointer"
                  onClick={() => handleClick(node.type)}
                >
                  {node.label}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Drawer;
