import { FunctionComponent } from "react";
import { Logo } from "../Logo";
import { Link } from "react-router-dom";
import { EDITOR_ROOT_URL } from "../../startBeadi";
import { MdChevronRight } from "react-icons/md";

type HomePageProps = {};
export const HomePage: FunctionComponent<HomePageProps> = ({}) => {
  return (
    <div className="w-full min-h-full overflow-x-hidden bg-gradient-to-br from-primary-900 to-purple-900">
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <div>
          <div className="text-white drop-shadow-primary">
            <Logo size={"hero"} />
          </div>
          <div className="flex flex-col items-center justify-center mt-12 gap-8 bg-primary-800/50 border-primary-1000 border p-6 text-white rounded-lg">
            <p className="font-bold">Next Generation Customization for Remote Sex Toy Control</p>
            <Link
              to={EDITOR_ROOT_URL}
              className="bg-purple-700 text-xl text-white font-bold pl-8 py-3 z-10 rounded-md flex flex-row items-center outline outline-purple-400 outline-4 "
            >
              Enter Editor
              <MdChevronRight className="w-8 h-8 mr-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
