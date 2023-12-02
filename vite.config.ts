/**
 * SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: CC0-1.0
 */

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

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
