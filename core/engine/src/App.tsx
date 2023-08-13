import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import Drawer from "./components/Drawer";
import { MobileView } from "./components/mobile/MobileView";
import { Settings } from "./components/Settings";
import Viewport from "./components/Viewport";

type GlobalSettings = {
  mobileView: boolean;

  setMobileView: (mobile: boolean) => void;
};
export const useGlobalSettings = create(
  immer<GlobalSettings>((set, get) => ({
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
    <div className="flex flex-row w-full h-full text-white bg-black">
      {mobile ? (
        <MobileView></MobileView>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Drawer />
          <Viewport />
          <Settings />
        </DndProvider>
      )}
    </div>
  );
}

export default App;
