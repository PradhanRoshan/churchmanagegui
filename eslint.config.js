// @ts-check
const eslint = require("@eslint/js");
const angularPlugin = require("@angular-eslint/eslint-plugin");

module.exports = [
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      "plugin:@angular-eslint/recommended",
    ],
    processor: angularPlugin.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      "plugin:@angular-eslint/template/recommended",
      "plugin:@angular-eslint/template/accessibility",
    ],
    rules: {},
  },
];
