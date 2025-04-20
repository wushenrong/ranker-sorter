/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT-0
 */

import react from '@vitejs/plugin-react-swc'
import postcssPresetEnv from 'postcss-preset-env'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/ranker-sorter/',
  css: {
    postcss: {
      plugins: [postcssPresetEnv({ minimumVendorImplementations: 2 })],
    },
  },
  plugins: [react()],
})
