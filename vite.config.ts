/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT-0
 */

import { reactRouter } from "@react-router/dev/vite";
import OpenProps from "open-props";
import postcssJitProps from "postcss-jit-props";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/ranker-sorter/",
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({ minimumVendorImplementations: 2 }),
        postcssJitProps(OpenProps),
      ],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
