import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative assets make the build work both locally and on GitHub Pages
  // without requiring the repository name to be hard-coded.
  base: "/ceneo-widget",
});