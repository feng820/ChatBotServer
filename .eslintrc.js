"use strict"

module.exports = {
  // Stop ESLint from looking for a configuration file in parent folders
  root: true,

  env: {
    es2020: true,
    node: true,
  },

  extends: [
    "eslint:recommended",
    // sets up both the prettier plugin and eslint-config-prettier in one go
    // more info on https://github.com/prettier/eslint-plugin-prettier
    "plugin:prettier/recommended",
    "plugin:import/recommended",
  ],

  parserOptions: {
    ecmaVersion: 2020,
    parser: "@babel/eslint-parser",
  },

  rules: {
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
      },
    ],
    "prettier/prettier": ["error", { semi: false }],
  },
}
