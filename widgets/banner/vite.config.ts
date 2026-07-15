import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import pkg from './package.json'
import { manifestPlugin } from './manifestPlugin'
import { visualizer } from 'rollup-plugin-visualizer';

const isAnalyze = process.env.ANALYZE === 'true';

const widgetName = pkg.name.replace(/^widget-/, '');

export default defineConfig({
  plugins: [
    react(),
    isAnalyze && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'stats.html'
    }),
    manifestPlugin({ widgetName }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: `../../workspace/release/source/${widgetName}/`,
    cssCodeSplit: false,
    emptyOutDir: false,
    lib: {
      entry: "src/widget.ts",
      name: `ReactEdge_${widgetName}`,
      fileName: () => `widget-${widgetName}@${pkg.version}.iife.js`,
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: `widget-${widgetName}.[ext]`,
      },
    },
    minify: true,
    sourcemap: false
  }
})