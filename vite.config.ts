import react from '@vitejs/plugin-react-swc'
import cssNano from 'cssnano'
import postcssPresetEnv from 'postcss-preset-env'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type PluginOption } from 'vite'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'

export default defineConfig({
  base: '/ranker-sorter',
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    postcss: {
      map: true,
      plugins: [
        postcssPresetEnv(),
        cssNano({ preset: 'default' }),
      ],
    },
  },
  plugins: [
    react(),
    optimizeCssModules(),
    [visualizer() as PluginOption],
  ],
})
