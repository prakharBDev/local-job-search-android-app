// Main theme export combining all design tokens

import { colors } from './colors.js';
import typography from './typography.js';
import spacing from './spacing.js';

// Main theme object
export const theme = {
  colors,
  typography,
  spacing: spacing.spacing,
  borderRadius: spacing.borderRadius,
  shadows: spacing.shadows,
  layout: spacing.layout,
  // Additional theme properties
  primary: colors.primary.cyan,
  secondary: colors.primary.pink,
  background: colors.background.primary,
  text: colors.text.primary,
  card: colors.surface.card,
  mode: 'dark',
};

// Export individual modules
export { colors };
export { typography };
export { spacing };

export default theme;
