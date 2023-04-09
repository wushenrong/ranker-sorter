import { defineConfig, type PluginOption } from 'vite'

import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'

import autoprefixer from 'autoprefixer'
import postcssMixins from 'postcss-mixins'
import postcssNesting from 'postcss-nesting'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    optimizeCssModules(),
    [visualizer({ gzipSize: true, brotliSize: true }) as PluginOption]
  ],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    },
    postcss: {
      plugins: [
        postcssMixins(),
        postcssNesting(),
        autoprefixer()
      ]
    }
  }
})
