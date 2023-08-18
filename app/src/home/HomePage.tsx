import { FunctionComponent, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Logo } from "@beadi/components";
import { BeadiContext, BeadiContextProvider, Viewport, ViewportFlowProvider } from "@beadi/engine";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { previewSave } from "./beadiPreviewSave";

export const PreviewBeadi: FunctionComponent = () => {
  const context = useMemo(() => {
    const context = new BeadiContext({
      plugins: [],
      initialData: previewSave,
    });
    context.finalize();
    return context;
  }, []);

  return (
    <BeadiContextProvider context={context}>
      <ViewportFlowProvider>
        <Viewport />
      </ViewportFlowProvider>
    </BeadiContextProvider>
  );
};

export const Hero: FunctionComponent = () => {
  return (
    <div className="h-[90vh] w-screen flex flex-col justify-center items-center relative  bg-gradient-to-br from-primary-900 to-purple-900">
      <div className="inset-0 absolute flex flex-row justify-center items-center">
        <div className="w-full h-full overflow-hidden opacity-30">
          <PreviewBeadi />
          <div className="pointer-events-auto absolute inset-0"></div>
        </div>
      </div>
      <div className="z-10">
        <div className="text-white drop-shadow-primary">
          <Logo size={"hero"} />
        </div>
        <div className="flex flex-col items-center justify-center mt-12 gap-8 bg-purple-1000 border-primary-1000 border p-8 text-white rounded-lg">
          <p className="font-bold">Next Generation Customization for Remote Sex Toy Control</p>
          {/* <Link
            to={"/edit"}
            className="bg-purple-700 text-xl text-white font-bold pl-8 py-3 z-10 rounded-md flex flex-row items-center outline outline-purple-400 outline-4 "
          >
            Start Creating
            <MdChevronRight className="w-8 h-8 mr-4" />
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export const HomePage: FunctionComponent = () => {
  return (
    <div className="w-full min-h-full overflow-x-hidden flex flex-col text-white">
      <Hero />
      <div className="bg-primary-900 grow flex flex-col pb-16">
        <NavBar />
        <div className="w-[1024px] mx-auto pt-8">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};
