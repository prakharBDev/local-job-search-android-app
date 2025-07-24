// BlueWhite Theme - Modern glassmorphic design inspired by Builder-cosmos-heaven
// Primary: Deep Blue (#3C4FE0), Secondary: Soft Blue (#F3F6FD), Accent: Green (#2ED47A)

export const bluewhiteTheme = {
  colors: {
    // Background colors - Updated for vibrant design
    background: {
      primary: '#F3F4F6', // Slightly off-white for depth contrast
      secondary: '#FFFFFF', // Clean white for cards with shadows
      tertiary: '#F1F5F9', // Slightly darker for subtle contrast
      overlay: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white overlay
    },

    // Text colors - Updated for high contrast design matching reference
    text: {
      primary: '#1F2937', // text-dark as specified in action plan
      secondary: '#6B7280', // text-muted as specified
      tertiary: '#4B4B4B', // At least #4B4B4B for better contrast as requested
      muted: '#6B7280', // Using the same as secondary for consistency
      inverse: '#FFFFFF', // White text for dark backgrounds
      white: '#FFFFFF', // Pure white text
      disabled: '#D1D5DB', // Disabled text color
    },

    // Primary colors - Updated with new purple color
    primary: {
      main: '#6475f8', // New purple as requested
      secondary: '#5c6bf7', // Darker purple for hover states
      light: '#7c88f9', // Lighter purple for info tags
      dark: '#4c5bf6', // Dark purple for contrast
      foreground: '#FFFFFF', // White text on primary buttons
      brand: '#6475f8', // Main brand color - new purple
    },

    // Secondary colors
    secondary: {
      main: '#E2E8F0', // Light gray
      light: '#F1F5F9', // Very light gray
      dark: '#94A3B8', // Darker gray
      foreground: '#1E293B',
    },

    // Accent colors - Updated with vibrant solid colors from reference
    accent: {
      blue: '#6475f8', // Updated to new purple
      green: '#3DD598', // Vibrant green for job categories
      pink: '#FF647C', // Vibrant pink for job categories
      purple: '#8B5CF6', // Violet purple for job categories
      orange: '#F59E0B', // Amber orange
      red: '#FF647C', // Using pink-red as specified
      yellow: '#F59E0B', // Yellow notifications
      success: '#2ECC71', // Success green for buttons
    },

    // Interactive colors
    interactive: {
      hover: '#F1F5F9', // Light hover state
      pressed: '#E2E8F0', // Pressed state
      focus: '#6475f8', // Focus ring color
      disabled: '#F8FAFC', // Disabled background
      border: {
        primary: '#E2E8F0', // Default border
        secondary: '#CBD5E1', // Secondary border
        focus: '#6475f8', // Focus border
        error: '#EF4444', // Error border
      },
    },

    // Status colors
    status: {
      success: '#10B981', // Green for success
      warning: '#F59E0B', // Amber for warnings
      error: '#EF4444', // Red for errors
      info: '#6475f8', // Purple for info
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 8,
      },
      xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 40,
        elevation: 12,
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
      secondary: '#6475f8', // Updated to match new purple
      inactive: '#CBD5E1',
      focus: '#6475f8', // Updated to match new purple
    },

    // CTA and special colors - Updated with reference colors
    cta: {
      primary: '#2ECC71', // Success green as specified
      primaryHover: '#27AE60', // Darker green for hover
      primaryText: '#FFFFFF', // White text on green CTA
    },

    // Job category colors - Updated with specific user-requested colors
    jobCategories: {
      primary: {
        background: '#6475f8', // User requested purple
        text: '#FFFFFF', // Light text for contrast on dark background
        iconBg: 'rgba(255, 255, 255, 0.2)', // Light overlay for icons
      },
      secondary: {
        background: '#75ce9b', // User requested green
        text: '#FFFFFF', // Light text for contrast on dark background
        iconBg: 'rgba(255, 255, 255, 0.2)', // Light overlay for icons
      },
      // Legacy categories for backward compatibility
      tech: {
        background: '#6475f8', // User requested purple
        text: '#FFFFFF',
        iconBg: 'rgba(255, 255, 255, 0.2)',
      },
      design: {
        background: '#75ce9b', // User requested green
        text: '#FFFFFF',
        iconBg: 'rgba(255, 255, 255, 0.2)',
      },
      marketing: {
        background: '#6475f8', // User requested purple
        text: '#FFFFFF',
        iconBg: 'rgba(255, 255, 255, 0.2)',
      },
      finance: {
        background: '#75ce9b', // User requested green
        text: '#FFFFFF',
        iconBg: 'rgba(255, 255, 255, 0.2)',
      },
    },

    // Company colors - Updated with user-requested colors
    company: {
      apple: {
        background: '#6475f8', // User requested purple
        accent: '#4F46E5', // Darker purple accent for icons
        text: '#FFFFFF', // White text for contrast
      },
      dribbble: {
        background: '#75ce9b', // User requested green
        accent: '#059669', // Darker green accent for icons
        text: '#FFFFFF', // White text for contrast
      },
      netflix: {
        background: '#6475f8', // User requested purple
        accent: '#4F46E5', // Darker purple accent for icons
        text: '#FFFFFF', // White text for contrast
      },
      spotify: {
        background: '#75ce9b', // User requested green
        accent: '#059669', // Darker green accent for icons
        text: '#FFFFFF', // White text for contrast
      },
      google: {
        background: '#6475f8', // User requested purple
        accent: '#4F46E5', // Darker purple accent for icons
        text: '#FFFFFF', // White text for contrast
      },
      microsoft: {
        background: '#75ce9b', // User requested green
        accent: '#059669', // Darker green accent for icons
        text: '#FFFFFF', // White text for contrast
      },
    },

    // Updated button tag styles for meta information with better contrast
    buttonTags: {
      salary: {
        background: '#F3F4F6', // Light gray background
        text: '#4B4B4B', // Darker text for better contrast as requested
      },
      fullTime: {
        background: '#F3F4F6', // Light gray background
        text: '#4B4B4B', // Darker text for better contrast
      },
      partTime: {
        background: '#F3F4F6', // Light gray background
        text: '#4B4B4B', // Darker text for better contrast
      },
      remote: {
        background: '#F3F4F6', // Light gray background
        text: '#4B4B4B', // Darker text for better contrast
      },
      daysLeft: {
        background: '#F56342', // Colored text for urgent as mentioned in comparison
        text: '#FFFFFF', // White text for better contrast
      },
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
      neon: ['#6475f8', '#7c88f9'],
      cyber: ['#10B981', '#6475f8'],
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
    fontFamily: {
      heading: 'Inter', // Updated to Inter for headings as requested
      body: 'Inter', // Using Inter for body text as well
      label: 'Manrope', // Using Manrope for labels as requested
    },
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
      fontFamily: 'Inter',
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 36,
      fontFamily: 'Inter',
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      fontFamily: 'Inter',
    },
    // Job card title styles - Updated font hierarchy
    jobTitle: {
      fontSize: 16, // 16-18px bold as specified
      fontWeight: '700', // font-bold for titles
      lineHeight: 24,
      fontFamily: 'Inter',
    },
    // Company subtitle styles
    companyName: {
      fontSize: 14, // 14px medium as specified
      fontWeight: '500', // font-medium for subtitles
      lineHeight: 20,
      fontFamily: 'Inter',
    },
    // Meta info styles (time, experience, etc)
    metaInfo: {
      fontSize: 12, // 12-13px regular as specified
      fontWeight: '400', // font-normal for meta info
      lineHeight: 16,
      fontFamily: 'Inter',
    },
    // Time stamp styles (2 hours ago, etc)
    timeStamp: {
      fontSize: 12, // 12-13px regular for timestamps
      fontWeight: '400', // font-normal
      lineHeight: 16,
      fontFamily: 'Inter',
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      fontFamily: 'Inter',
    },
    h5: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      fontFamily: 'Inter',
    },
    h6: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 22,
      fontFamily: 'Inter',
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
      fontFamily: 'Manrope',
    },
    labelSmall: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
      fontFamily: 'Manrope',
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
    '2xl': 20, // Updated to match expert feedback for cards and inputs
    '3xl': 24,
    full: 9999,
  },

  // Layout properties
  layout: {
    touchTarget: {
      minHeight: 44, // Minimum touch target size for accessibility
    },
  },

  // Component-specific styles - Updated for vibrant design
  components: {
    button: {
      borderRadius: 12, // rounded-xl for buttons
      paddingHorizontal: 16,
      paddingVertical: 12,
      height: 44,
      minHeight: 44,
    },
    // CTA Button (Apply Now)
    ctaButton: {
      borderRadius: 12, // rounded-xl
      paddingHorizontal: 24,
      paddingVertical: 12,
      height: 48,
      minHeight: 48,
      width: '100%', // Full width
    },
    // Job Cards - Updated for new layout requirements
    jobCard: {
      borderRadius: 12, // 12px as specified
      paddingHorizontal: 12, // 12px inner padding
      paddingVertical: 12, // 12px inner padding
      marginVertical: 8, // gap-4 between cards
      marginHorizontal: 16, // 16px horizontal margin (85-90% width)
      backgroundColor: '#FFFFFF',
      ...{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2, // Subtle shadow
      },
    },
    // Meta Pills/Tags
    metaPill: {
      borderRadius: 9999, // rounded-full
      paddingHorizontal: 12, // px-3
      paddingVertical: 4, // py-1
    },
    // Company Brand Pills
    companyPill: {
      borderRadius: 8, // rounded-lg
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    input: {
      borderRadius: 20, // Updated to rounded-2xl as requested
      paddingHorizontal: 16, // Increased horizontal padding
      paddingVertical: 12, // Increased vertical padding
      borderWidth: 1,
      height: 44,
    },
    // Container/Section Padding
    container: {
      paddingHorizontal: 24, // px-6
      paddingTop: 16, // pt-4
    },
    section: {
      marginTop: 24, // mt-6 for section headings
    },
  },
};

export default bluewhiteTheme;
