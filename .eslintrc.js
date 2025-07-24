module.exports = {
  root: true,
  extends: ['@react-native'],
  rules: {
    // Production code quality - allow console statements for debugging
    'no-console': 'off',
    'no-debugger': 'error',

    // React/React Native specific
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',

    // Code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'no-unused-vars': 'error',
  },
};
