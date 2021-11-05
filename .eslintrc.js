// require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    // project: './tsconfig.json',
    // tsconfigRootDir: __dirname,
    ecmaFeatures: {
      // Allows for the parsing of TSX ???
      tsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'import', 'react-hooks', 'prefer-arrow', 'import', 'jsx-a11y', 'prettier'],
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'next',
    'next/core-web-vitals',
    'plugin:@next/next/recommended',
    'prettier',
  ],
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    /* AirBnb rules */
    'import/extensions': [0, 'never'],
    'no-shadow': ['error', { allow: ['done', 'error', 'theme', 'value'] }],
    'react/jsx-filename-extension': [0, { extensions: ['.tsx', '.jsx'] }],
    // 'no-unused-vars': 2,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-nested-ternary': 0,
    'react/jsx-props-no-spreading': 0,
    'jsx-a11y/anchor-is-valid': 1,
    '@typescript-eslint/ban-types': 1,
    /* START TMP : Need to be set to 0 before going to production */
    'react/require-default-props': 1,
    'react/prop-types': 1,
    'react/no-unused-prop-types': 1,
    'react/forbid-prop-types': 1,
    '@typescript-eslint/no-empty-function': 1,
    'react/default-props-match-prop-types': 1,
    'react/display-name': 1,
    'react/jsx-key': 1,
    'react/no-array-index-key': 1,
    'import/no-anonymous-default-export': 0,
    /* END TMP : Need to be set to 0 before going to production */
    /* React Hooks rules */
    // Checks rules of Hooks
    'react-hooks/rules-of-hooks': 2,
    // Checks effect dependencies
    'react-hooks/exhaustive-deps': 2,
    /* Functions rules */
    'consistent-return': 0,
    'import/prefer-default-export': 0,
    /* Comments rules */
    'no-warning-comments': [1, { terms: ['todo', 'fixme', 'to do', 'fix me'], location: 'start' }],
    'no-inline-comments': 2,
    /* Console rules */
    'no-console': 0,
    /* Typescript rules */
    'prettier/prettier': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // "@typescript-eslint/no-var-requires": "off",
    /* Special chars rules */
    'react/no-unescaped-entities': 0,
    /* Disallow imports from src/server/ in src/pages/ except for src/pages/api */
    /* (see the "overrides" section for the exception) */
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './src/pages',
            from: './src/server',
          },
        ],
      },
    ],
  },
  settings: {
    react: {
      // React version. "detect" automatically picks the version you have installed.
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['./'],
      },
    },
    // 'import/parsers': {
    //   [require.resolve('@typescript-eslint/parser')]: ['.ts', '.tsx', '.d.ts'],
    // },
    // 'import/resolver': {
    //   [require.resolve('eslint-import-resolver-node')]: {
    //     extensions: ['.js', '.jsx', '.ts', '.tsx'],
    //   },
    //   [require.resolve('eslint-import-resolver-typescript')]: {
    //     alwaysTryTypes: true,
    //   },
    // },
  },
  overrides: [
    {
      files: ['next.config.js'],
      // "rules": {
      //   "@typescript-eslint/no-var-requires": "off"
      // }
    },
    {
      // Allow imports from src/server/ in src/pages/api
      files: ['src/pages/api/**/*'],
      rules: {
        'import/no-restricted-paths': [
          'error',
          {
            zones: [
              {
                target: './src/pages/api',
                from: './src/client/',
              },
            ],
          },
        ],
      },
    },
  ],
  // ignorePatterns: ['src/client/components/formik-material-ui/*', 'src/client/graphql/generated/', 'next.config.js'],
}
