// Spacing system matching the web app's 4px grid system

// Base spacing unit (4px)
const BASE_UNIT = 4;

// Spacing scale matching Tailwind's system but with exact measurements
export const spacing = {
  0: 0,
  1: BASE_UNIT * 1, // 4px
  2: BASE_UNIT * 2, // 8px
  3: BASE_UNIT * 3, // 12px
  4: BASE_UNIT * 4, // 16px
  5: BASE_UNIT * 5, // 20px
  6: BASE_UNIT * 6, // 24px
  7: BASE_UNIT * 7, // 28px
  8: BASE_UNIT * 8, // 32px
  9: BASE_UNIT * 9, // 36px
  10: BASE_UNIT * 10, // 40px
  11: BASE_UNIT * 11, // 44px (minimum touch target)
  12: BASE_UNIT * 12, // 48px
  14: BASE_UNIT * 14, // 56px
  16: BASE_UNIT * 16, // 64px
  18: 72, // Custom spacing from web (4.5rem)
  20: BASE_UNIT * 20, // 80px
  24: BASE_UNIT * 24, // 96px
  28: BASE_UNIT * 28, // 112px
  32: BASE_UNIT * 32, // 128px
  36: BASE_UNIT * 36, // 144px
  40: BASE_UNIT * 40, // 160px
  44: BASE_UNIT * 44, // 176px
  48: BASE_UNIT * 48, // 192px
  52: BASE_UNIT * 52, // 208px
  56: BASE_UNIT * 56, // 224px
  60: BASE_UNIT * 60, // 240px
  64: BASE_UNIT * 64, // 256px
  72: BASE_UNIT * 72, // 288px
  80: BASE_UNIT * 80, // 320px
  88: 352, // Custom spacing from web (22rem)
  96: BASE_UNIT * 96, // 384px
  128: 512, // Custom spacing from web (32rem)
};

// Border radius values matching the web app
export const borderRadius = {
  none: 0,
  sm: 10, // calc(14px - 4px) - Small radius
  md: 12, // calc(14px - 2px) - Medium radius
  lg: 14, // Base radius from CSS variable
  xl: 18, // calc(14px + 4px) - Extra large
  '2xl': 22, // calc(14px + 8px) - 2x large
  '3xl': 26, // calc(14px + 12px) - 3x large
  full: 9999, // Fully rounded
};

// Shadow configurations for iOS and Android
export const shadows = {
  // Small shadows
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // Default shadows
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  // Large shadows
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  // Extra large shadows
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  // Brand shadows with emerald tint
  brand: {
    shadowColor: '#66BB6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Layout dimensions
export const layout = {
  // Touch targets (minimum 44px as per Apple/Google guidelines)
  touchTarget: {
    minWidth: 44,
    minHeight: 44,
  },

  // Container max widths (mobile-first)
  container: {
    sm: 320, // Small mobile
    md: 375, // Medium mobile
    lg: 414, // Large mobile
    xl: 768, // Tablet
  },

  // Screen breakpoints
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  },
};

export default {
  spacing,
  borderRadius,
  shadows,
  layout,
};
