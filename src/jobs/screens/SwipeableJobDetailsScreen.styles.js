import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background?.primary || '#F3F4F6',
    },

    // Top Header with Purple Back Button
    topHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
    },
    purpleBackButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: theme?.colors?.primary?.main || '#6475f8',
      justifyContent: 'center',
      alignItems: 'center',
    },
    helpButton: {
      padding: 8,
    },

    // Error state styles
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme?.colors?.text?.primary || '#1F2937',
      marginTop: 16,
      marginBottom: 8,
      fontFamily: 'Inter',
    },
    errorText: {
      fontSize: 16,
      color: theme?.colors?.text?.secondary || '#6B7280',
      textAlign: 'center',
      marginBottom: 24,
      fontFamily: 'System',
    },
    backButton: {
      backgroundColor: theme?.colors?.primary?.main || '#6475f8',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    backButtonText: {
      color: theme?.colors?.primary?.foreground || '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },

    // Loading state
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Main content container
    contentContainer: {
      flex: 1,
      backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
    },

    // Company section - centered with logo
    companySection: {
      alignItems: 'center',
      paddingTop: 24,
      paddingBottom: 20,
    },
    companyLogo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 16,
    },
    companyName: {
      fontSize: 22,
      fontWeight: '700',
      color: theme?.colors?.text?.primary || '#1F2937',
      marginBottom: 8,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      fontSize: 14,
      color: theme?.colors?.text?.secondary || '#6B7280',
      marginLeft: 4,
    },

    // Job title - more prominent
    jobTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: theme?.colors?.text?.primary || '#1F2937',
      textAlign: 'center',
      marginHorizontal: 20,
      marginBottom: 20,
      lineHeight: 36,
    },

    // Job tags - pill-shaped UI with proper purple coloring
    jobTags: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: 20,
      marginBottom: 32,
      gap: 12,
    },
    tag: {
      backgroundColor: '#6475f8', // Fixed purple color like JobDetailsScreen
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    tagText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF', // White text on purple background
    },

    // Navigation tabs
    tabContainer: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 24,
      backgroundColor: theme?.colors?.background?.tertiary || '#F1F5F9',
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
      ...(theme?.shadows?.md || {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }),
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme?.colors?.text?.secondary || '#6B7280',
    },
    activeTabText: {
      color: theme?.colors?.text?.primary || '#1F2937',
      fontWeight: '600',
    },

    // Tab content
    tabContent: {
      paddingHorizontal: 20,
      paddingBottom: 100, // Space for apply button
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme?.colors?.text?.primary || '#1F2937',
      marginBottom: 20,
    },
    descriptionText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme?.colors?.text?.secondary || '#6B7280',
      marginBottom: 16,
    },
    requirementItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
      paddingLeft: 8,
    },
    requirementBullet: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme?.colors?.primary?.main || '#6475f8',
      marginRight: 16,
      marginTop: 8,
    },
    requirementText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme?.colors?.text?.secondary || '#6B7280',
      flex: 1,
    },

    // Apply button container - fixed at bottom
    applyContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: theme?.colors?.interactive?.border?.primary || '#E2E8F0',
    },
    applyButton: {
      backgroundColor: theme?.colors?.cta?.primary || '#2ECC71',
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: 'center',
      ...(theme?.shadows?.lg || {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      }),
    },
    appliedButton: {
      backgroundColor: theme?.colors?.status?.success || '#10B981',
    },
    applyButtonText: {
      color: theme?.colors?.cta?.primaryText || '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
    },
  });
