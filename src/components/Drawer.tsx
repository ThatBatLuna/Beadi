import _ from "lodash";
import { FunctionComponent, useMemo } from "react";
import { nodeDefs } from "../nodes/nodes";
import { Entry } from "./drawer/Entry";
import Logo from "./Logo";

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

  return (
    <div className="bg-primary-900 w-60 overflow-y-scroll min-h-full flex flex-col">
      <div>
        <Logo></Logo>
      </div>
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
                <Entry key={index} nodeDef={node}></Entry>
              ))}
            </ul>
          </li>
        ))}
      </ul>
        <div className="mt-auto text-xs text-center text-slate-500">
          ©Mona Mayrhofer, 2023 Linz, Austria
        </div>
    </div>
  );
};

export default Drawer;
