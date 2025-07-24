import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    // Main container
    cardContainer: {
      width: 240,
      marginRight: theme.spacing[4],
      borderRadius: theme.borderRadius?.xl || 20,
      padding: theme.spacing[5],
      borderWidth: 1,
      borderColor:
        theme.colors.interactive?.border?.primary ||
        theme.colors.border?.primary,
      ...theme.shadows?.lg,
    },

    // Header section
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },

    logoContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor:
        theme.colors.surface?.glass || 'rgba(255, 255, 255, 0.8)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.surface?.overlay || 'rgba(255, 255, 255, 0.9)',
    },

    companyInfoContainer: {
      flex: 1,
    },

    companyName: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text?.primary || '#212121',
      marginBottom: theme.spacing[1],
    },

    featuredContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1],
    },

    featuredText: {
      fontSize: 12,
      color: theme.colors.text?.tertiary || '#9E9E9E',
      fontWeight: '500',
    },

    // Job title
    jobTitle: {
      fontSize: theme.typography?.h5?.fontSize || 18,
      fontWeight: '700',
      color: theme.colors.text?.primary || '#212121',
      marginBottom: theme.spacing[2],
      lineHeight: theme.typography?.h5?.lineHeight || 24,
    },

    // Salary section
    salaryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
      gap: theme.spacing[1],
    },

    salaryText: {
      fontSize: 16,
      color: theme.colors.accent?.green || '#388E3C',
      fontWeight: '600',
    },

    // Tags section
    tagsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
      flexWrap: 'wrap',
    },

    jobTypeTag: {
      backgroundColor:
        theme.colors.surface?.overlay || 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius?.md || 12,
      borderWidth: 1,
      borderColor: theme.colors.surface?.glass || 'rgba(255, 255, 255, 0.95)',
    },

    jobTypeText: {
      color: theme.colors.primary?.main || '#3949AB',
      fontWeight: '600',
      fontSize: 12,
    },

    timeTag: {
      backgroundColor:
        theme.colors.surface?.glass || 'rgba(255, 255, 255, 0.7)',
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[2],
      borderRadius: theme.borderRadius?.md || 12,
      borderWidth: 1,
      borderColor: theme.colors.surface?.elevated || 'rgba(255, 255, 255, 0.8)',
    },

    timeText: {
      color: theme.colors.text?.tertiary || '#9E9E9E',
      fontWeight: '500',
      fontSize: 12,
    },
  });

// Theme-based gradient colors for job types
export const getJobTypeGradients = theme => ({
  'Full Time': [
    `${theme.colors.accent?.blue}40` || '#E3F2FD',
    `${theme.colors.accent?.blue}60` || '#BBDEFB',
  ],
  'Part Time': [
    `${theme.colors.accent?.green}40` || '#E8F5E9',
    `${theme.colors.accent?.green}60` || '#C8E6C9',
  ],
  Contract: [
    `${theme.colors.accent?.purple}40` || '#F3E5F5',
    `${theme.colors.accent?.purple}60` || '#E1BEE7',
  ],
  Freelance: [
    `${theme.colors.accent?.orange}40` || '#FFF3E0',
    `${theme.colors.accent?.orange}60` || '#FFCC02',
  ],
});

// Theme-based icon colors for job types
export const getJobTypeIconColors = theme => ({
  'Full Time': theme.colors.accent?.blue || '#1976D2',
  'Part Time': theme.colors.accent?.green || '#388E3C',
  Contract: theme.colors.accent?.purple || '#7B1FA2',
  Freelance: theme.colors.accent?.orange || '#F57C00',
});
