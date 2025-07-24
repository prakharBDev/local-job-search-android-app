import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    // Main container - Updated for better width and visibility
    cardContainer: {
      backgroundColor: theme.colors.background?.secondary || '#FFFFFF',
      borderRadius: 12, // 12px as specified
      paddingHorizontal: 16, // Increased from 12px for better spacing
      paddingVertical: 16, // Increased from 12px for better spacing
      marginBottom: theme.spacing[3], // Reduced margin
      marginHorizontal: 8, // Reduced from 16px to give more width to cards
      borderWidth: 0, // Remove border for cleaner look
      width: '95%', // Ensure cards take up most of the available width
      alignSelf: 'center', // Center the cards
      ...{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2, // Subtle shadow
      },
    },

    // Main content row
    contentRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%', // Ensure full width usage
    },

    // Company logo
    logoContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius?.md || 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[4],
      borderWidth: 1,
      borderColor:
        theme.colors.interactive?.border?.secondary ||
        theme.colors.border?.secondary,
      flexShrink: 0, // Prevent logo from shrinking
    },

    logoText: {
      fontSize: 16,
      fontWeight: '700',
    },

    // Job details section
    jobDetailsContainer: {
      flex: 1,
      paddingRight: theme.spacing[2], // Reduced padding to give more space
      minWidth: 0, // Allow text to wrap properly
    },

    // Job title
    jobTitle: {
      fontSize: theme.typography?.h5?.fontSize || 18,
      fontWeight: '700',
      color: theme.colors.text?.primary || '#212121',
      marginBottom: theme.spacing[1],
      lineHeight: theme.typography?.h5?.lineHeight || 24,
      flexWrap: 'wrap', // Allow text to wrap
    },

    // Company name
    companyName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text?.secondary || '#666666',
      marginBottom: theme.spacing[2],
      flexWrap: 'wrap', // Allow text to wrap
    },

    // Salary text - Updated for better visibility
    salaryText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.accent?.green || '#10B981',
      marginBottom: theme.spacing[2], // Add bottom margin for spacing
      flexWrap: 'wrap', // Allow text to wrap
    },

    // Info row (location and time)
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[3],
      gap: theme.spacing[3],
    },

    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },

    locationText: {
      fontSize: 12,
      color: theme.colors.text?.tertiary || '#9E9E9E',
      fontWeight: '500',
    },

    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },

    timeText: {
      fontSize: 12,
      color: theme.colors.text?.tertiary || '#9E9E9E',
      fontWeight: '500',
    },

    // Tags section
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[3],
    },

    tag: {
      backgroundColor: theme.colors.background?.secondary || '#F8FAFC',
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius?.sm || 8,
      borderWidth: 1,
      borderColor:
        theme.colors.interactive?.border?.primary ||
        theme.colors.border?.primary,
    },

    tagText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.primary?.main || '#6475f8',
    },

    // Bottom row (salary and action)
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    applyButton: {
      backgroundColor: theme.colors.primary?.main || '#6475f8',
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius?.md || 12,
      ...theme.shadows?.sm,
    },

    applyButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary?.foreground || '#FFFFFF',
    },
  });

// Function to get alternating colors for recent job cards
export const getRecentJobColors = (theme, index = 0) => {
  const colorSchemes = [
    {
      background: theme.colors.jobCategories?.primary?.background || '#6475f8', // User requested purple
      text: theme.colors.jobCategories?.primary?.text || '#FFFFFF',
      accent: '#4F46E5', // Darker purple accent for icons
      iconBg: 'rgba(255, 255, 255, 0.2)',
    },
    {
      background: theme.colors.jobCategories?.secondary?.background || '#75ce9b', // User requested green
      text: theme.colors.jobCategories?.secondary?.text || '#FFFFFF',
      accent: '#059669', // Darker green accent for icons
      iconBg: 'rgba(255, 255, 255, 0.2)',
    }
  ];

  return colorSchemes[index % 2];
};

// Theme-based company logo colors
export const getCompanyLogoColors = theme => ({
  backgrounds: [
    '#6475f8', // User requested purple
    '#75ce9b', // User requested green
    '#6475f8', // User requested purple
    '#75ce9b', // User requested green
  ],
  textColors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
});
