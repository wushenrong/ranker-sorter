import { defineConfig, type PluginOption } from 'vite'

import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'

import autoprefixer from 'autoprefixer'
import postcssMixins from 'postcss-mixins'
import postcssSimpleVars from 'postcss-simple-vars'
import postcssNesting from 'postcss-nesting'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    [visualizer({ gzipSize: true, brotliSize: true }) as PluginOption]
  ],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    },
    postcss: {
      plugins: [
        postcssMixins(),
        postcssSimpleVars(),
        postcssNesting(),
        autoprefixer()
      ]
    }
  }
})
