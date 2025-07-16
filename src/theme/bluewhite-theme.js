// BlueWhite Theme - Modern glassmorphic design inspired by Builder-cosmos-heaven
// Primary: Deep Blue (#3C4FE0), Secondary: Soft Blue (#F3F6FD), Accent: Green (#2ED47A)

export const bluewhiteTheme = {
  colors: {
    // Background colors
    background: {
      primary: '#FFFFFF', // Pure white main background
      secondary: '#F8FAFC', // Very light gray for cards/sections
      tertiary: '#F1F5F9', // Slightly darker for subtle contrast
      overlay: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white overlay
    },

    // Text colors
    text: {
      primary: '#1E293B', // Dark slate for main text
      secondary: '#475569', // Medium slate for secondary text
      tertiary: '#94A3B8', // Light slate for hints/placeholders
      inverse: '#FFFFFF', // White text for dark backgrounds
      white: '#FFFFFF', // Pure white text
      disabled: '#CBD5E1', // Disabled text color
    },

    // Primary colors
    primary: {
      main: '#3B82F6', // Updated to match PR color scheme
      light: '#6366F1', // Lighter blue
      dark: '#1E40AF', // Darker blue
      foreground: '#FFFFFF',
      cyan: '#3B82F6', // Use primary blue as cyan for compatibility
    },

    // Secondary colors
    secondary: {
      main: '#E2E8F0', // Light gray
      light: '#F1F5F9', // Very light gray
      dark: '#94A3B8', // Darker gray
      foreground: '#1E293B',
    },

    // Accent colors
    accent: {
      blue: '#3B82F6', // Updated primary blue
      green: '#10B981', // Emerald green
      orange: '#F59E0B', // Amber orange
      purple: '#8B5CF6', // Violet purple
      red: '#EF4444', // Red
      yellow: '#F59E0B', // Yellow (same as orange)
    },

    // Interactive colors
    interactive: {
      hover: '#F1F5F9', // Light hover state
      pressed: '#E2E8F0', // Pressed state
      focus: '#6366F1', // Focus ring color
      disabled: '#F8FAFC', // Disabled background
      border: {
        primary: '#E2E8F0', // Default border
        secondary: '#CBD5E1', // Secondary border
        focus: '#6366F1', // Focus border
        error: '#EF4444', // Error border
      },
    },

    // Status colors
    status: {
      success: '#10B981', // Green for success
      warning: '#F59E0B', // Amber for warnings
      error: '#EF4444', // Red for errors
      info: '#3B82F6', // Blue for info
    },

    // Shadows
    shadows: {
      soft: 'rgba(59, 130, 246, 0.08)',
      medium: 'rgba(59, 130, 246, 0.12)',
      strong: 'rgba(59, 130, 246, 0.16)',
      glow: 'rgba(59, 130, 246, 0.25)',
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
      xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
      },
    },

    // Shadow colors
    shadow: {
      primary: 'rgba(0, 0, 0, 0.1)',
      secondary: 'rgba(0, 0, 0, 0.05)',
    },

    // Add border property for compatibility with theme usage in App.jsx
    border: {
      primary: '#E2E8F0', // matches interactive.border.primary
      secondary: '#3B82F6',
      inactive: '#CBD5E1',
      focus: '#6366F1',
    },

    // Surface colors for cards and elevated elements
    surface: {
      card: '#FFFFFF', // White card background
      elevated: '#F8FAFC', // Slightly elevated surface
      overlay: 'rgba(255, 255, 255, 0.9)', // Overlay surface
      glass: 'rgba(255, 255, 255, 0.8)', // Glass surface
    },

    // Error color for compatibility
    error: '#EF4444',

    // Gradients for compatibility
    gradients: {
      neon: ['#3B82F6', '#6366F1'],
      cyber: ['#10B981', '#3B82F6'],
      accent: ['#F59E0B', '#EF4444'],
      background: ['#FFFFFF', '#F8FAFC'],
    },
  },

  // Spacing scale
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    // Named spacing for compatibility
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Typography scale
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 22,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: 'normal',
      lineHeight: 26,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    labelSmall: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
    },
  },

  // Border radius scale
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },

  // Layout properties
  layout: {
    touchTarget: {
      minHeight: 44, // Minimum touch target size for accessibility
    },
  },

  // Component-specific styles
  components: {
    button: {
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      height: 44,
      minHeight: 44,
    },
    card: {
      borderRadius: 12,
      padding: 16,
    },
    input: {
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      height: 44,
    },
  },
};

export default bluewhiteTheme;
