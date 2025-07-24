import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    // Main container
    cardContainer: {
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
      borderRadius: theme.borderRadius?.lg || 16,
      padding: theme.spacing[5],
      marginBottom: theme.spacing[4],
      borderWidth: 1,
      borderColor:
        theme.colors.interactive?.border?.primary ||
        theme.colors.border?.primary,
      ...theme.shadows?.md,
    },

    // Main content row
    contentRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
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
    },

    logoText: {
      fontSize: 16,
      fontWeight: '700',
    },

    // Job details section
    jobDetailsContainer: {
      flex: 1,
      paddingRight: theme.spacing[3],
    },

    // Job title
    jobTitle: {
      fontSize: theme.typography?.h5?.fontSize || 18,
      fontWeight: '700',
      color: theme.colors.text?.primary || '#212121',
      marginBottom: theme.spacing[1],
      lineHeight: theme.typography?.h5?.lineHeight || 24,
    },

    // Company name
    companyName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text?.secondary || '#666666',
      marginBottom: theme.spacing[2],
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
      color: theme.colors.primary?.main || '#3B82F6',
    },

    // Bottom row (salary and action)
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    salaryText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.accent?.green || '#10B981',
    },

    applyButton: {
      backgroundColor: theme.colors.primary?.main || '#3B82F6',
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

// Theme-based company logo colors
export const getCompanyLogoColors = theme => ({
  backgrounds: [
    `${theme.colors.accent?.blue}30` || '#E3F2FD',
    `${theme.colors.accent?.green}30` || '#E8F5E9',
    `${theme.colors.accent?.purple}30` || '#F3E5F5',
    `${theme.colors.accent?.orange}30` || '#FFF3E0',
  ],
  textColors: [
    theme.colors.accent?.blue || '#1976D2',
    theme.colors.accent?.green || '#388E3C',
    theme.colors.accent?.purple || '#7B1FA2',
    theme.colors.accent?.orange || '#F57C00',
  ],
});
