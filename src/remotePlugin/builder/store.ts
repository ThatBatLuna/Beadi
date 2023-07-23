import { Draft } from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type WidgetInstance<TSettings> = {
  type: string;
  id: string;
  settings: TSettings | null;
};
export type RemoteFileData = {
  widgets: WidgetInstance<any>[];
};
export type RemoteFileStore = {
  data: RemoteFileData;

  addWidget: (widget: WidgetInstance<any>) => void;
  updateWidget: (id: string, recipe: (draft: Draft<WidgetInstance<any>>) => void) => void;

  exportJson: () => any;
  importJson: (data: any) => void;
  //   reset: () => void;
};
export const useRemoteFileStore = create<RemoteFileStore>()(
  immer(
    // persist(
    (set, get) => ({
      data: {
        widgets: [],
      },
      addWidget: (instance) => {
        set((draft) => {
          draft.data.widgets.push(instance);
        });
      },
      updateWidget: (id, recipe) => {
        set((draft) => {
          const index = draft.data.widgets.findIndex((it) => it.id === id);
          recipe(draft.data.widgets[index]);
        });
      },
      exportJson: () => {},
      importJson: (data) => {},
    })
    //   {
    //     name: "remotePlugin",

    //   }
    // )
  )
);
