// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/consistent-generic-constructors": "warn",
      "@typescript-eslint/prefer-for-of": "warn",
      
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: ["app", "jsf"],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: ["app", "jsf"],
          style: "kebab-case",
        },
      ],
      "@angular-eslint/no-output-native": "warn",
      "@angular-eslint/no-input-rename": "warn",
      
      // ESLint core rules
      "no-useless-escape": "warn",
      "no-extra-boolean-cast": "warn",
      "no-case-declarations": "off",
      "no-empty": "warn",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/alt-text": "warn",
      "@angular-eslint/template/click-events-have-key-events": "warn",
      "@angular-eslint/template/interactive-supports-focus": "warn",
      "@angular-eslint/template/label-has-associated-control": "warn",
    },
  },
  {
    ignores: [
      ".idea/",
      ".vscode/",
      "coverage/",
      "dist/",
      "target/",
      "node_modules/",
      "**/*.js",
      "**/*.mjs",
    ],
  }
);
