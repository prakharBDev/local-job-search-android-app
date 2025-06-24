// Main theme export combining all design tokens

import colors, { darkColors } from './colors';
import typography from './typography';
import spacing from './spacing';

// Main theme object
export const theme = {
  colors,
  typography,
  spacing: spacing.spacing,
  borderRadius: spacing.borderRadius,
  shadows: spacing.shadows,
  layout: spacing.layout,
};

// Dark theme variant
export const darkTheme = {
  ...theme,
  colors: darkColors,
};

// Export individual modules
export { colors, darkColors };
export { typography };
export { spacing };

// Theme type for TypeScript
export type Theme = typeof theme;

export default theme;