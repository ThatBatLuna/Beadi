import { plugin } from "@beadi/engine";
import { WelcomeNode } from "./WelcomeNode";

export const beadiAppPlugin = plugin({
  id: "beadiApp",
  extraNodeRenderers: {
    welcome: WelcomeNode,
  },
});
