import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    // Main container - Updated for better width and visibility
    cardContainer: {
      backgroundColor: theme.colors.background?.secondary || '#FFFFFF',
      borderRadius: 16, // Increased for better visual appeal
      paddingHorizontal: 20, // Increased padding for better spacing
      paddingVertical: 20, // Increased padding for better spacing
      marginRight: theme.spacing[4], // Space between cards
      marginBottom: theme.spacing[2],
      borderWidth: 0,
      width: 280, // Fixed width for consistent card size
      minHeight: 200, // Minimum height to ensure content fits
      ...{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    },

    // Header container
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[3],
      width: '100%',
    },

    // Logo container
    logoContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius?.lg || 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[3],
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
      borderWidth: 1,
      borderColor: '#FFFFFF', // White outline
      flexShrink: 0, // Prevent logo from shrinking
    },

    // Company info container
    companyInfoContainer: {
      flex: 1,
      minWidth: 0, // Allow text to wrap properly
    },

    // Company name
    companyName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text?.primary || '#1F2937',
      marginBottom: theme.spacing[1],
      flexWrap: 'wrap', // Allow text to wrap
    },

    // Featured container
    featuredContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },

    featuredText: {
      fontSize: 11,
      fontWeight: '500',
      fontFamily: 'Inter',
    },

    // Job title - Updated for high contrast with better spacing
    jobTitle: {
      fontSize: theme.typography?.jobTitle?.fontSize || 16, // Slightly smaller as requested
      fontWeight: theme.typography?.jobTitle?.fontWeight || '600', // font-semibold
      color: theme.colors.text?.primary || '#1F2937', // High contrast black
      marginBottom: theme.spacing[2], // Better vertical spacing
      lineHeight: theme.typography?.jobTitle?.lineHeight || 24,
      fontFamily: theme.typography?.jobTitle?.fontFamily || 'Inter',
      flexWrap: 'wrap', // Allow text to wrap
    },

    // Salary section - Updated styling
    salaryContainer: {
      marginBottom: theme.spacing[3], // Better vertical spacing between pay and tags
      width: '100%',
    },

    salaryText: {
      fontSize: 16, // Increased from 14 for better visibility
      color: '#FFFFFF', // White color as requested
      fontWeight: '700', // Made bold for better visibility
      fontFamily: 'Inter',
      flexWrap: 'wrap', // Allow text to wrap
    },

    // Meta information section (salary, job type, days left)
    metaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      flexWrap: 'wrap',
      marginBottom: theme.spacing[4],
    },

    // Salary pill
    salaryPill: {
      backgroundColor: theme.colors.buttonTags?.salary?.background || '#F3F4F6',
      paddingHorizontal: 12, // px-3
      paddingVertical: 4, // py-1
      borderRadius: 9999, // rounded-full
    },

    salaryPillText: {
      color: theme.colors.buttonTags?.salary?.text || '#374151',
      fontSize: 12, // text-xs
      fontWeight: '500', // font-medium
      fontFamily: 'Inter',
    },

    // Job type pill
    jobTypePill: {
      backgroundColor: theme.colors.buttonTags?.fullTime?.background || '#F3F4F6',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 9999,
    },

    jobTypePillText: {
      color: theme.colors.buttonTags?.fullTime?.text || '#374151',
      fontSize: 12,
      fontWeight: '500',
      fontFamily: 'Inter',
    },

    // Days left pill
    daysLeftPill: {
      backgroundColor: theme.colors.buttonTags?.daysLeft?.background || '#FEF3C7',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 9999,
    },

    daysLeftPillText: {
      color: theme.colors.buttonTags?.daysLeft?.text || '#92400E',
      fontSize: 12,
      fontWeight: '500',
      fontFamily: 'Inter',
    },

  });

// Function to get alternating purple/green colors for job cards
export const getJobCategoryColors = (theme, jobType, company, index = 0) => {
  // Define the two alternating color schemes
  const colorSchemes = [
    {
      background: theme.colors.jobCategories?.primary?.background || '#6475f8', // User requested purple
      text: theme.colors.jobCategories?.primary?.text || '#1F2937',
      accent: '#8B5CF6', // Purple accent for icons
      iconBg: 'rgba(139, 92, 246, 0.1)',
    },
    {
      background: theme.colors.jobCategories?.secondary?.background || '#E4FCE5', // Light parrot green
      text: theme.colors.jobCategories?.secondary?.text || '#1F2937',
      accent: '#22C55E', // Green accent for icons
      iconBg: 'rgba(34, 197, 94, 0.1)',
    }
  ];

  // Alternate between the two color schemes based on index
  return colorSchemes[index % 2];
};

// Theme-based icon colors for job types
export const getJobTypeIconColors = theme => ({
  'Full Time': theme.colors.accent?.blue || '#1976D2',
  'Part Time': theme.colors.accent?.green || '#388E3C',
  Contract: theme.colors.accent?.purple || '#7B1FA2',
  Freelance: theme.colors.accent?.orange || '#F57C00',
});
