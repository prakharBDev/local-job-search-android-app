// Electric Cyber Theme Colors - Improved for Readability & Contrast

export const colors = {
  // Primary colors - Electric Cyber neon
  primary: {
    cyan: '#00f5ff', // Electric cyan - Primary brand color
    dark: '#00b8cc', // Darker cyan for pressed states
    light: '#4df7ff', // Lighter cyan for highlights
    pink: '#ff006e', // Electric pink accent
    purple: '#8338ec', // Deep purple accent
  },

  // Background colors
  background: {
    primary: '#0a0a0a', // Very dark background
    secondary: '#1a1a1a', // Slightly lighter dark
    tertiary: '#2a2a2a', // Card backgrounds
    modal: 'rgba(0, 0, 0, 0.9)', // Modal overlay
    glass: 'rgba(255, 255, 255, 0.05)', // Glass effect
  },

  // Text colors - Fixed for better contrast
  text: {
    primary: '#ffffff', // White text for dark backgrounds
    secondary: '#e0e0e0', // Light gray for secondary text
    tertiary: '#b0b0b0', // Medium gray for less important text
    inverse: '#1a1a1a', // Dark text for light backgrounds
    accent: '#00f5ff', // Cyan for accent text
    pink: '#ff006e', // Pink for special text
    muted: '#808080', // Muted gray text
    white: '#ffffff', // Legacy white text reference
  },

  // Status colors
  status: {
    success: '#00ff88', // Bright green
    error: '#ff3366', // Bright red
    warning: '#ffaa00', // Bright orange
    info: '#00f5ff', // Cyan
  },

  // Interactive elements
  interactive: {
    button: {
      primary: '#00f5ff', // Cyan button
      secondary: '#ff006e', // Pink button
      tertiary: '#8338ec', // Purple button
      disabled: '#404040', // Gray for disabled
      text: '#000000', // Black text on bright buttons
      textSecondary: '#ffffff', // White text on dark buttons
    },
    border: {
      primary: '#00f5ff',
      secondary: '#ff006e',
      inactive: '#404040',
      focus: '#4df7ff',
    },
  },

  // Legacy border colors for backward compatibility
  border: {
    primary: '#404040', // Default border color
    secondary: '#00f5ff', // Accent border
    focus: '#4df7ff', // Focus border
    inactive: '#2a2a2a', // Inactive border
  },

  // Legacy accent colors for backward compatibility
  accent: {
    orange: '#ffaa00', // Orange accent
    purple: '#8338ec', // Purple accent
    blue: '#00f5ff', // Blue accent
    green: '#00ff88', // Green accent
  },

  // Card and surface colors
  surface: {
    card: '#1a1a1a', // Dark card background
    elevated: '#2a2a2a', // Elevated surfaces
    overlay: 'rgba(0, 245, 255, 0.1)', // Cyan overlay
    glass: 'rgba(255, 255, 255, 0.05)', // Glass effect
  },

  // Gradients - All with good contrast
  gradients: {
    neon: ['#00f5ff', '#ff006e'], // Cyan to pink
    cyber: ['#8338ec', '#00f5ff'], // Purple to cyan
    dark: ['#1a1a1a', '#0a0a0a'], // Dark gradient
    accent: ['#ff006e', '#8338ec'], // Pink to purple
    glow: ['rgba(0, 245, 255, 0.3)', 'rgba(255, 0, 110, 0.3)'], // Glowing effect
    card: ['rgba(26, 26, 26, 0.9)', 'rgba(42, 42, 42, 0.9)'], // Card gradient
    background: ['#0a0a0a', '#1a1a1a', '#2a2a2a'], // Main background gradient (dark)
  },

  // Semantic colors for specific use cases
  semantic: {
    // Job/hiring related
    jobSeeker: '#00ff88', // Green for job seekers
    employer: '#ff006e', // Pink for employers
    
    // Priority levels
    high: '#ff3366', // Red
    medium: '#ffaa00', // Orange
    low: '#00ff88', // Green
    
    // Categories
    tech: '#00f5ff', // Cyan
    design: '#ff006e', // Pink
    business: '#8338ec', // Purple
    marketing: '#ffaa00', // Orange
  },

  // Shadow and border colors
  shadow: {
    light: 'rgba(0, 245, 255, 0.2)',
    medium: 'rgba(0, 245, 255, 0.4)',
    heavy: 'rgba(0, 0, 0, 0.8)',
    glow: 'rgba(0, 245, 255, 0.6)',
  },

  // Opacity variants
  opacity: {
    10: 'rgba(255, 255, 255, 0.1)',
    20: 'rgba(255, 255, 255, 0.2)',
    30: 'rgba(255, 255, 255, 0.3)',
    50: 'rgba(255, 255, 255, 0.5)',
    70: 'rgba(255, 255, 255, 0.7)',
    90: 'rgba(255, 255, 255, 0.9)',
  },

  // Glass morphism colors (for Input component and others)
  glass: {
    white10: 'rgba(255, 255, 255, 0.1)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white30: 'rgba(255, 255, 255, 0.3)',
    white50: 'rgba(255, 255, 255, 0.5)',
    white90: 'rgba(255, 255, 255, 0.9)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
    black30: 'rgba(0, 0, 0, 0.3)',
    black50: 'rgba(0, 0, 0, 0.5)',
    black90: 'rgba(0, 0, 0, 0.9)',
    cyan10: 'rgba(0, 245, 255, 0.1)',
    cyan20: 'rgba(0, 245, 255, 0.2)',
    pink10: 'rgba(255, 0, 110, 0.1)',
    pink20: 'rgba(255, 0, 110, 0.2)',
  },
};

// Export default theme
export const theme = {
  colors,
  // Dark mode (current)
  mode: 'dark',
  
  // Quick access to commonly used colors
  primary: colors.primary.cyan,
  secondary: colors.primary.pink,
  background: colors.background.primary,
  text: colors.text.primary,
  card: colors.surface.card,
};
