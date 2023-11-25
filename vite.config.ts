import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import autoprefixer from 'autoprefixer'
import postcssNesting from 'postcss-nesting'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ranker-sorter',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [postcssNesting(), autoprefixer()],
    },
  },
})
