import { reactRouter } from '@react-router/dev/vite'
import postcssPresetEnv from 'postcss-preset-env'
import { defineConfig } from 'vite'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/ranker-sorter/',
  css: {
    postcss: {
      plugins: [postcssPresetEnv({ minimumVendorImplementations: 2 })],
    },
  },
  plugins: [reactRouter(), tsconfigPaths(), optimizeCssModules()],
})
