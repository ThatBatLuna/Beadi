import _ from "lodash";
import { FunctionComponent, useMemo } from "react";
import { Entry } from "./drawer/Entry";
import Logo from "./Logo";
import { useBeadi } from "../context";
import { Link } from "react-router-dom";

const Drawer: FunctionComponent = () => {
  const beadi = useBeadi();

  const nodes = useMemo(() => {
    return _.chain(Object.values(beadi.nodeDefs))
      .groupBy((it) => it.category.label)
      .map((value, key) => ({
        name: key,
        color: value[0].category.color,
        items: value,
      }))
      .value();
  }, [beadi.nodeDefs]);

  return (
    <div className="bg-primary-900 w-60 min-h-full flex flex-col">
      <div className="bg-primary-900 w-60 overflow-y-scroll flex flex-col grow">
        <div>
          <Logo></Logo>
        </div>
        <ul>
          {nodes.map((category) => (
            <li key={category.name} className="mb-2">
              <h2 className="px-2 py-1 font-bold text-black" style={{ backgroundColor: category.color }}>
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
      </div>
      <div className="text-xs text-slate-500 pt-1">
        <div className="">©Mona Mayrhofer, 2023 Linz, Austria</div>
        <div className="text-center">
          <Link to={"/imprint"} className="px-2 inline-block">
            Impressum/Imprint
          </Link>
          <span>|</span>
          <Link to={"/privacy"} className="px-2 inline-block">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
