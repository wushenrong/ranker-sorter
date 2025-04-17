import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import postcssPresetEnv from 'postcss-preset-env'

export default defineConfig({
  base: '/ranker-sorter/',
  css: {
    postcss: {
      plugins: [postcssPresetEnv({ minimumVendorImplementations: 2 })],
    },
  },
  plugins: [reactRouter(), tsconfigPaths(), optimizeCssModules()],
})
