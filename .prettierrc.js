module.exports = {
  arrowParens: 'avoid',
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  printWidth: 80,
  bracketSpacing: true,
  bracketSameLine: false,
  endOfLine: 'lf', // Cross-platform compatibility
  overrides: [
    {
      files: '*.{js,jsx}',
      options: {
        parser: 'babel',
      },
    },
  ],
};
