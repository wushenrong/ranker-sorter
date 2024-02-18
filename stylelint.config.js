// ts-check

import cssModules from 'stylelint-css-modules'
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
    cssModules,
    useNesting,
    remOverPx,
  ],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    '@stylistic/max-line-length': 80,
    'css-modules/composed-class-names': true,
    'css-modules/css-variables': true,
    'csstools/use-nesting': 'always',
    'declaration-property-value-no-unknown': true,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],
    'rem-over-px/rem-over-px': true,
  },
}
