// Typography system for Electric Cyber theme - Modern, tech-inspired fonts

// Font family with cyber-aesthetic fonts
export const fontFamily = {
  regular: 'System', // Use system font for better compatibility
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  system: 'System',
};

// Font weights matching Inter
export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Font sizes matching the web app exactly
export const fontSize = {
  '2xs': 10, // 0.625rem - Very small text
  xs: 12, // 0.75rem  - Small text
  sm: 14, // 0.875rem - Small text
  base: 16, // 1rem     - Base text
  lg: 18, // 1.125rem - Large text
  xl: 20, // 1.25rem  - Extra large
  '2xl': 24, // 1.5rem   - 2x large
  '3xl': 30, // 1.875rem - 3x large (custom from web)
  '4xl': 36, // 2.25rem  - 4x large (custom from web)
  '5xl': 48, // 3rem     - 5x large (custom from web)
  '6xl': 60, // 3.75rem  - 6x large
  '7xl': 72, // 4.5rem   - 7x large
};

// Line heights for optimal readability
export const lineHeight = {
  tight: 1.1,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

// Typography styles matching the web app
export const typography = {
  // Headings
  h1: {
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['5xl'] * lineHeight.tight,
    fontFamily: fontFamily.bold,
  },
  h2: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: fontSize['4xl'] * lineHeight.tight,
    fontFamily: fontFamily.bold,
  },
  h3: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize['3xl'] * lineHeight.tight,
    fontFamily: fontFamily.semibold,
  },
  h4: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize['2xl'] * lineHeight.normal,
    fontFamily: fontFamily.semibold,
  },
  h5: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xl * lineHeight.normal,
    fontFamily: fontFamily.medium,
  },
  h6: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.lg * lineHeight.normal,
    fontFamily: fontFamily.medium,
  },

  // Body text - Use system fonts for better readability
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.base * lineHeight.normal,
    fontFamily: fontFamily.system, // System font for readability
  },
  bodyLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.relaxed,
    fontFamily: fontFamily.system,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
    fontFamily: fontFamily.system,
  },

  // Cyber-styled text for special elements
  cyber: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.base * lineHeight.normal,
    fontFamily: fontFamily.regular, // Monospace cyber font
    letterSpacing: 1,
  },
  cyberLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * lineHeight.tight,
    fontFamily: fontFamily.bold,
    letterSpacing: 1.5,
  },

  // Caption and labels
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
    fontFamily: fontFamily.regular,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    fontFamily: fontFamily.medium,
  },
  labelSmall: {
    fontSize: fontSize['2xs'],
    fontWeight: fontWeight.medium,
    lineHeight: fontSize['2xs'] * lineHeight.normal,
    fontFamily: fontFamily.medium,
  },

  // Button text
  button: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.base * lineHeight.tight,
    fontFamily: fontFamily.semibold,
  },
  buttonSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.tight,
    fontFamily: fontFamily.medium,
  },
  buttonLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.lg * lineHeight.tight,
    fontFamily: fontFamily.semibold,
  },
};

export default typography;
