module.exports = {
  root: true,
  env: { node: true, es2022: true, jest: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
  ignorePatterns: ['node_modules', 'data', 'coverage'],
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'no-constant-condition': ['error', { checkLoops: false }],
  },
};
