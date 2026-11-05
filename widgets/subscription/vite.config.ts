import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import pkg from "./package.json" with { type: "json" };
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { manifestPlugin } from "../../packages/widget-build/shared-resources/widget-preset/manifestPlugin.ts";
import { createWidgetBuildDefaults } from "../../packages/widget-build/shared-resources/widget-preset/createReactEdgeConfig.ts";
import { reactEdgeVisualizer } from "../../packages/widget-build/shared-resources/widget-preset/reactEdgeVisualizer.ts";

const isAnalyze = process.env.ANALYZE === "true";
const widgetName = pkg.name.replace(/^widget-/, "");
const widgetDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@reactedge": resolve(
          widgetDir,
          "../../packages/widget-build/shared-resources"
      ),
    },
  },

  plugins: [
    react(),
    reactEdgeVisualizer(isAnalyze),
    manifestPlugin({
      widgetName,
      version: pkg.version,
    }),
  ],

  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },

  build: createWidgetBuildDefaults({
    widgetName,
    version: pkg.version,
    entry: resolve(widgetDir, "api/runtime-shadow-widget.tsx"),
    outDir: resolve(
        widgetDir,
        `../../workspace/release/source/${widgetName}`
    ),
    emitCss: false,
    sourcemap: false
  }),
});