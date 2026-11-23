import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const require = createRequire(import.meta.url);
const reactVersion = (require("react/package.json") as { version: string }).version;
const reactDomVersion = (require("react-dom/package.json") as { version: string }).version;

if (reactDomVersion !== reactVersion) {
    throw new Error("The shared React browser build requires matching React and React DOM versions.");
}

export default defineConfig({
    define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
    },
    build: {
        outDir: "workspace/release/pilot/shared-react",
        emptyOutDir: false,
        lib: {
            entry: fileURLToPath(new URL("./browser.ts", import.meta.url)),
            name: "ReactEdgeSharedReact",
            fileName: () => `react-shared@${reactVersion}.iife.js`,
            formats: ["iife"],
        },
    },
});
