import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    BEADI_CHANGELOG: JSON.stringify(fs.readFileSync("../CHANGELOG.md").toString()),
  },
  plugins: [react()],
});
