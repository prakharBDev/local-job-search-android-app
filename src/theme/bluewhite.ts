// BlueWhite Theme - Clean, modern glassmorphic design for Android
// Optimized for React Native with styled-components

export interface BlueWhiteTheme {
  colors: {
    // Background colors
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      overlay: string;
    };

    // Text colors
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      white: string;
      disabled: string;
    };

    // Primary colors
    primary: {
      main: string;
      light: string;
      dark: string;
      foreground: string;
      cyan: string;
    };

    // Secondary colors
    secondary: {
      main: string;
      light: string;
      dark: string;
      foreground: string;
    };

    // Accent colors
    accent: {
      blue: string;
      green: string;
      orange: string;
      purple: string;
      red: string;
      yellow: string;
    };

    // Interactive colors
    interactive: {
      hover: string;
      pressed: string;
      focus: string;
      disabled: string;
      border: {
        primary: string;
        secondary: string;
        focus: string;
        error: string;
      };
    };

    // Status colors
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };

    // Border colors
    border: {
      primary: string;
      secondary: string;
      inactive: string;
      focus: string;
    };

    // Surface colors
    surface: {
      card: string;
      elevated: string;
      overlay: string;
      glass: string;
    };

    // Error color for compatibility
    error: string;

    // Gradients
    gradients: {
      neon: string[];
      cyber: string[];
      accent: string[];
      background: string[];
    };
  };

  spacing: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    12: number;
    16: number;
    20: number;
    24: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };

  typography: {
    h1: { fontSize: number; fontWeight: string; lineHeight: number };
    h2: { fontSize: number; fontWeight: string; lineHeight: number };
    h3: { fontSize: number; fontWeight: string; lineHeight: number };
    h4: { fontSize: number; fontWeight: string; lineHeight: number };
    h5: { fontSize: number; fontWeight: string; lineHeight: number };
    h6: { fontSize: number; fontWeight: string; lineHeight: number };
    body: { fontSize: number; fontWeight: string; lineHeight: number };
    bodyLarge: { fontSize: number; fontWeight: string; lineHeight: number };
    bodySmall: { fontSize: number; fontWeight: string; lineHeight: number };
    caption: { fontSize: number; fontWeight: string; lineHeight: number };
    label: { fontSize: number; fontWeight: string; lineHeight: number };
    labelSmall: { fontSize: number; fontWeight: string; lineHeight: number };
    button: { fontSize: number; fontWeight: string; lineHeight: number };
    buttonSmall: { fontSize: number; fontWeight: string; lineHeight: number };
  };

  shadows: {
    soft: string;
    medium: string;
    strong: string;
    glow: string;
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    xl: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };

  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    full: number;
  };

  layout: {
    touchTarget: {
      minHeight: number;
    };
  };

  components: {
    button: {
      borderRadius: number;
      paddingHorizontal: number;
      paddingVertical: number;
      height: number;
      minHeight: number;
    };
    card: {
      borderRadius: number;
      padding: number;
    };
    input: {
      borderRadius: number;
      paddingHorizontal: number;
      paddingVertical: number;
      borderWidth: number;
      height: number;
    };
  };
}

export const bluewhiteTheme: BlueWhiteTheme = {
  colors: {
    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      overlay: 'rgba(255, 255, 255, 0.95)',
    },

    // Text colors
    text: {
      primary: '#1E293B',
      secondary: '#475569',
      tertiary: '#94A3B8',
      inverse: '#FFFFFF',
      white: '#FFFFFF',
      disabled: '#CBD5E1',
    },

    // Primary colors
    primary: {
      main: '#3C4FE0',
      light: '#6366F1',
      dark: '#1E40AF',
      foreground: '#FFFFFF',
      cyan: '#3C4FE0',
    },

    // Secondary colors
    secondary: {
      main: '#E2E8F0',
      light: '#F1F5F9',
      dark: '#94A3B8',
      foreground: '#1E293B',
    },

    // Accent colors
    accent: {
      blue: '#3C4FE0',
      green: '#10B981',
      orange: '#F59E0B',
      purple: '#8B5CF6',
      red: '#EF4444',
      yellow: '#F59E0B',
    },

    // Interactive colors
    interactive: {
      hover: '#F1F5F9',
      pressed: '#E2E8F0',
      focus: '#6366F1',
      disabled: '#F8FAFC',
      border: {
        primary: '#E2E8F0',
        secondary: '#CBD5E1',
        focus: '#6366F1',
        error: '#EF4444',
      },
    },

    // Status colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3C4FE0',
    },

    // Border colors
    border: {
      primary: '#E2E8F0',
      secondary: '#3C4FE0',
      inactive: '#CBD5E1',
      focus: '#6366F1',
    },

    // Surface colors
    surface: {
      card: '#FFFFFF',
      elevated: '#F8FAFC',
      overlay: 'rgba(255, 255, 255, 0.9)',
      glass: 'rgba(255, 255, 255, 0.8)',
    },

    // Error color for compatibility
    error: '#EF4444',

    // Gradients
    gradients: {
      neon: ['#3C4FE0', '#6366F1'],
      cyber: ['#10B981', '#3C4FE0'],
      accent: ['#F59E0B', '#EF4444'],
      background: ['#FFFFFF', '#F8FAFC'],
    },
  },

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
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  typography: {
    h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
    h2: { fontSize: 28, fontWeight: 'bold', lineHeight: 36 },
    h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
    h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    h5: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    h6: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
    body: { fontSize: 16, fontWeight: 'normal', lineHeight: 24 },
    bodyLarge: { fontSize: 18, fontWeight: 'normal', lineHeight: 26 },
    bodySmall: { fontSize: 14, fontWeight: 'normal', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: 'normal', lineHeight: 16 },
    label: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
    labelSmall: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    buttonSmall: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  },

  shadows: {
    soft: 'rgba(60, 79, 224, 0.08)',
    medium: 'rgba(60, 79, 224, 0.12)',
    strong: 'rgba(60, 79, 224, 0.16)',
    glow: 'rgba(60, 79, 224, 0.25)',
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

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },

  layout: {
    touchTarget: {
      minHeight: 44,
    },
  },

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
