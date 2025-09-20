import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  {
    ignores: ['dist', 'node_modules', '**/dist']
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-prettier'
  ),
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'never',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ]
    }
  }
];
