import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    BEADI_CHANGELOG: JSON.stringify("Hi"),
  },
  plugins: [react()],
});
