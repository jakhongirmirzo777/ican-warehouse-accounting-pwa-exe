/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true,
      },
    ],
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'after-used',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
  },
}
