module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['/node_modules/**', '/src/images/**', '/docs/**', '/public/**', '/build/**'],
  plugins: ['react', 'jsdoc'],
  rules: {
    'no-unused-vars': ['warn', { args: 'none', argsIgnorePattern: 'req|res|next|val' }],
    'react/prop-types': 'off',
    'react/jsx-no-undef': 'warn',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-key': 'warn',
    'prettier/prettier': 'warn',
    'react-hooks/exhaustive-deps': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-property-description': 'off',
  },
};
