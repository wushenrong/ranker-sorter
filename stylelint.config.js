// ts-check

import remOverPx from 'stylelint-rem-over-px'
import useNesting from 'stylelint-use-nesting'

/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    '@stylistic/stylelint-config',
  ],
  plugins: [
    useNesting,
    remOverPx,
  ],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    '@stylistic/max-line-length': 80,
    'csstools/use-nesting': 'always',
    'declaration-property-value-no-unknown': true,
    'rem-over-px/rem-over-px': true,
  },
}
