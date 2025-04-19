/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT-0
 */

import { reactRouter } from '@react-router/dev/vite'
import postcssPresetEnv from 'postcss-preset-env'
import type { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default {
  css: {
    postcss: {
      plugins: [postcssPresetEnv({ minimumVendorImplementations: 2 })],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
} satisfies UserConfig
