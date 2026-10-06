import { defineConfig} from "vite";
import type { BuildOptions } from "vite"
import react from "@vitejs/plugin-react-swc";
import pkg from "./package.json" with { type: "json" };
import {dirname, resolve} from "node:path";
import {createNpmBuildDefaults} from "../../packages/widget-build/shared-resources/widget-preset/createReactEdgeConfig.ts";
import {fileURLToPath} from "node:url";

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
  publicDir: resolve(import.meta.dirname, "public"),
  plugins: [react(), ],
  define: {
    __REACTEDGE_MODE__: JSON.stringify(
        process.env.REACTEDGE_MODE ?? "render"
    ),
  },
  build: createNpmBuildDefaults<BuildOptions>({
    widgetName
  }),
});