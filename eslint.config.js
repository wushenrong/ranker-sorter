// @ts-check

import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
// eslint-disable-next-line @stylistic/max-len -- Plugin Name Too Long
import perfectionist from 'eslint-plugin-perfectionist/configs/recommended-alphabetical'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsx from 'eslint-plugin-react/configs/jsx-runtime.js'
import react from 'eslint-plugin-react/configs/recommended.js'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  resolvePluginsRelativeTo: import.meta.dirname,
})

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  react,
  jsx,
  unicorn.configs['flat/recommended'],
  ...compat.extends(
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ),
  perfectionist,
  stylistic.configs.customize({
    arrowParens: true,
    braceStyle: '1tbs',
  }),
  {
    ignores: ['dist'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      '@stylistic/max-len': [
        'error',
        {
          code: 80,
        },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'unicorn/filename-case': 'off',
    },
    settings: {
      react: {
        version: '18.2',
      },
    },
  },
  {
    files: ['*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
)
