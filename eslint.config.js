// @ts-check

import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
// import compat from "eslint-plugin-compat"
import perfectionist from 'eslint-plugin-perfectionist/configs/recommended-natural'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  unicorn.configs['flat/recommended'],
  // compat.configs['flat/recommended'],
  perfectionist,
  stylistic.configs.customize({
    braceStyle: '1tbs',
    jsx: false,
  }),
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      '@stylistic/max-len': [
        'warn',
        {
          code: 120,
        },
      ],
    },
  },
  {
    files: ['*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
)
