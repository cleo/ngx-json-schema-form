module.exports = {
  root: true,
  extends: [
    'eslint:recommended'
  ],
  reportUnusedDisableDirectives: true,
  overrides: [
    {
      files: '*.js',
      parserOptions: {
        ecmaVersion: 2015
      },
      env: {
        node: true
      }
    },
    {
      files: '*.ts',
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      parserOptions: {
        project: 'tsconfig.lint.json'
      },
      plugins: [
        '@angular-eslint'
      ],
      rules: {
        'comma-dangle': 'error',
        'constructor-super': 'error',
        // 'curly': 'error',
        'eol-last': 'off',
        'eqeqeq': [
          'error',
          'smart'
        ],
        'guard-for-in': 'off',
        'id-match': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-console': [
          'error',
          {
            allow: [
              'dir',
              'timeLog',
              'assert',
              'clear',
              'count',
              'countReset',
              'group',
              'groupEnd',
              'table',
              'dirxml',
              'groupCollapsed',
              'Console',
              'profile',
              'profileEnd',
              'timeStamp',
              'context'
            ]
          }
        ],
        'no-debugger': 'error',
        'no-eval': 'error',
        'no-fallthrough': 'error',
        'no-irregular-whitespace': 'error',
        'no-multiple-empty-lines': 'error',
        'no-new-wrappers': 'error',
        // 'no-redeclare': 'error',
        'no-restricted-imports': 'error',
        // 'no-shadow': [
        //   'error',
        //   {
        //     'hoist': 'all'
        //   }
        // ],
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        // 'no-underscore-dangle': 'error',
        'no-unused-labels': 'error',
        'no-var': 'error',
        // 'one-var': [
        //   'error',
        //   'never'
        // ],
        'padding-line-between-statements': [
          'off',
          {
            blankLine: 'always',
            prev: '*',
            next: 'return'
          }
        ],
        'prefer-template': 'error',
        'quote-props': [
          'error',
          'as-needed'
        ],
        // 'radix': 'error',
        'space-before-function-paren': [
          'error',
          {
            anonymous: 'always',
            asyncArrow: 'always',
            named: 'never'
          }
        ],
        'space-in-parens': [
          'error',
          'never'
        ],
        'spaced-comment': [
          'off',
          'always',
          {
            markers: [
              '/'
            ]
          }
        ],
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/dot-notation': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
          'off',
          {
            accessibility: 'explicit'
          }
        ],
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/quotes': [
          'error',
          'single',
          {
            allowTemplateLiterals: true,
            avoidEscape: true
          }
        ],
        '@typescript-eslint/semi': [
          'error',
          'always'
        ],
        '@typescript-eslint/unified-signatures': 'error',

        '@angular-eslint/contextual-lifecycle': 'error',
        '@angular-eslint/no-conflicting-lifecycle': 'error',
        '@angular-eslint/no-host-metadata-property': 'error',
        '@angular-eslint/no-input-rename': 'error',
        '@angular-eslint/no-inputs-metadata-property': 'error',
        '@angular-eslint/no-output-rename': 'error',
        '@angular-eslint/no-outputs-metadata-property': 'error',
        '@angular-eslint/use-lifecycle-interface': 'error',
        '@angular-eslint/use-pipe-transform-interface': 'error',

        'no-case-declarations': 'off',
        'no-empty': 'off',
        'no-extra-boolean-cast': 'off',
        'no-prototype-builtins': 'off',
        'no-useless-escape': 'off',
        'prefer-const': 'off',
        'use-isnan': 'off',

        '@typescript-eslint/adjacent-overload-signatures': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-for-in-array': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/unbound-method': 'off'
      }
    },
    {
      files: '*.component.html',
      extends: 'plugin:@angular-eslint/template/recommended'
    },
    {
      files: '*.js',
      rules: {
        'no-unused-vars': 'off'
      }
    },
    {
      files: '*.component.html',
      rules: {
        '@angular-eslint/template/no-negated-async': 'off'
      }
    }
  ]
};
