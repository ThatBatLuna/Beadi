import create from "zustand";

type PreviewStore = {
  outputHandlePreviews: Record<string, Record<string, any>>;
};
export const usePreviewStore = create<PreviewStore>()(() => ({
  outputHandlePreviews: {},
}));
