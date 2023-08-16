import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import Drawer from "./components/Drawer";
import { MobileView } from "./components/mobile/MobileView";
import { Settings } from "./components/Settings";
import { ViewportWrapper } from "./components/Viewport";

type GlobalSettings = {
  mobileView: boolean;

  setMobileView: (mobile: boolean) => void;
};
export const useGlobalSettings = create(
  immer<GlobalSettings>((set) => ({
    mobileView: window.innerWidth < 768,
    setMobileView: (mobile) => {
      set((state) => {
        state.mobileView = mobile;
      });
    },
  }))
);

function App() {
  const mobile = useGlobalSettings((s) => s.mobileView);

  return (
    <div className="flex flex-row w-full h-full text-white bg-black overflow-x-hidden">
      {mobile ? (
        <MobileView></MobileView>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Drawer />
          <ViewportWrapper />
          <Settings />
        </DndProvider>
      )}
    </div>
  );
}

export default App;
