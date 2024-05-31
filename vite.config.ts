import posthtml from '@vituum/vite-plugin-posthtml'
import cssNano from 'cssnano'
import htmlNano from 'htmlnano'
import postcssPresetEnv from 'postcss-preset-env'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/ranker-sorter',
  build: {
    minify: 'terser',
    sourcemap: true,
  },
  css: {
    postcss: {
      map: true,
      plugins: [
        postcssPresetEnv(),
        cssNano({ preset: 'advanced' }),
      ],
    },
  },
  plugins: [
    posthtml({
      plugins: [
        htmlNano({
          collapseWhitespace: 'aggressive',
        }),
      ],
    }),
    visualizer(),
  ],
})
