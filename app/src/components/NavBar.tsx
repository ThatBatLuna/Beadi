import { EDITOR_ROOT_URL } from "@beadi/engine";
import clsx from "clsx";
import { FunctionComponent, ReactNode } from "react";
import { MdChevronRight } from "react-icons/md";
import { NavLink, To } from "react-router-dom";

type NavBarItemProps = {
  to: To;
  children?: ReactNode;
  highlight?: boolean;
};
const NavBarItem: FunctionComponent<NavBarItemProps> = ({ to, children, highlight = false }) => {
  return (
    <li className="contents">
      <NavLink
        to={to}
        className={({ isActive }) =>
          clsx("px-12 pb-4 pt-5 text-lg font-bold border-b-purple-500 hover:text-white flex flex-row items-center", {
            "border-b-8": isActive,
            "border-b": !isActive,
            "text-purple-100": !isActive,
            // "bg-purple-1000 shadow-purple-100 transition-all": !isActive && highlight,
          })
        }
      >
        {children}
      </NavLink>
    </li>
  );
};

export const NavBar: FunctionComponent = () => {
  return (
    <nav className="w-full flex flex-row">
      <div className="grow border-b-purple-500 border-b"></div>
      <ul className="flex flex-row px-4">
        <NavBarItem to="/">Home</NavBarItem>
        <NavBarItem to="/guide">Guide</NavBarItem>
        <NavBarItem to="/changelog">Changelog</NavBarItem>
        <NavBarItem to={EDITOR_ROOT_URL} highlight={true}>
          <span className="inline-flex flex-row bg-purple-700 text-white items-center pl-4 py-1 rounded-md">
            Editor
            <MdChevronRight className="w-8 h-8" />
          </span>
        </NavBarItem>
      </ul>
      <div className="grow border-b-purple-500 border-b"></div>
    </nav>
  );
};
