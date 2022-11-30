import { FunctionComponent } from "react";

const Drawer: FunctionComponent<{}> = (a) => {
  return (
    <div className="bg-slate-800 w-60" onMouseDown={(e) => console.log(e)}>
      Hi
    </div>
  );
};

export default Drawer;
