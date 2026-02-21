// eslint.config.js
// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');

module.exports = [
  { ignores: ['dist/**', '.angular/**', 'node_modules/**'] },

  eslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      globals: {
        console: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        window: 'readonly',
        document: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        alert: 'readonly',
        navigator: 'readonly',
      },
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.spec.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@angular-eslint': angular,
      // ✅ register template plugin so processor exists
      '@angular-eslint/template': angularTemplate,
    },
    // ✅ now ESLint can find it
    processor: '@angular-eslint/template/extract-inline-html',
    rules: {
      ...angular.configs.recommended.rules,
      // project uses constructor injection widely; disable auto-migration rule for now
      '@angular-eslint/prefer-inject': 'off',
      // Many files currently have unused constructor params; silence until refactor
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Allow empty lifecycle methods in some components for now
      '@angular-eslint/no-empty-lifecycle-method': 'off',

      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },

  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      ...angularTemplate.configs.accessibility.rules,
      // Turn off some strict template accessibility rules that are noisy in this repo
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      // Allow non-strict equality in templates for now
      '@angular-eslint/template/eqeqeq': 'off',
    },
  },

  // Provide Jasmine globals for spec files so lint doesn't flag test helpers
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        spyOn: 'readonly',
        jasmine: 'readonly',
      },
    },
  },
  // Lint environment files without type-aware parserOptions.project to avoid parse errors
  {
    files: ['**/environments/*.ts', 'src/environments/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        // clear any type-aware project setting for these files so the typescript parser
        // doesn't attempt to use the global `parserOptions.project` and fail.
        project: [],
        sourceType: 'module',
      },
    },
  },
];