module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    ecmaFeatures: {
      // Allows for the parsing of TSX ???
      tsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'import', 'react-hooks', 'prefer-arrow', 'prettier'],
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
    'prettier',
  ],
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    /* AirBnb rules */
    'import/extensions': [0, 'never'],
    // 'no-shadow': ['warn'],
    'no-shadow': ['error', { allow: ['done', 'error'] }],
    'react/jsx-filename-extension': [0, { extensions: ['.tsx', '.jsx'] }],
    // "import/no-unresolved": 1,
    // "import/no-unresolved": [2, { "caseSensitiveStrict": true }],
    // "no-restricted-imports": [
    //   "error",
    //   {
    //     "patterns": ["src/*"]
    //   }
    // ],
    // "no-restricted-imports": [
    //   "error",
    //   {
    //     "patterns": [".*"]
    //   }
    // ],
    /* React Hooks rules */
    // Checks rules of Hooks
    'react-hooks/rules-of-hooks': 'error',
    // Checks effect dependencies
    'react-hooks/exhaustive-deps': 'error',
    /* Functions rules */
    'consistent-return': 0,
    'import/prefer-default-export': 0,

    // ["error", { "treatUndefinedAsUnspecified": false }],
    // "func-style": ["error", "declaration", { "allowArrowFunctions": true }],
    // "func-style": ["error", "expression"],
    // "prefer-arrow-callback": ["error", { "allowUnboundThis": false }],
    // "prefer-arrow/prefer-arrow-functions": [
    //   "warn",
    //   {
    //     "disallowPrototype": true,
    //     "singleReturnOnly": false,
    //     "classPropertiesAllowed": false
    //   }
    // ],
    /* Comments rules */
    'no-warning-comments': [1, { terms: ['todo', 'fixme', 'to do', 'fix me'], location: 'start' }],
    'no-inline-comments': 'error',
    /* Console rules */
    'no-console': 0,
    /* Typescript rules */
    'prettier/prettier': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // "@typescript-eslint/no-var-requires": "off",
    /* Special chars rules */
    'react/no-unescaped-entities': 1,
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
  // "linters": {
  //   "eslint": {
  //     "args": ["--stdin-filename", "@"]
  //   }
  // },
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
    // "import/resolver": {
    //   "webpack": {
    //     "config": "webpack.config.js"
    //   }
    // }
    // "import/parsers": [".ts", ".tsx", ".js", ".jsx"]
    // "import/parsers": [".ts", ".tsx", ".js", ".jsx"]
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
}
