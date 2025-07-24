import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: theme.spacing[10] || 40,
    },

    // Header Styles - Ultra soft and premium
    headerContainer: {
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
      paddingHorizontal: theme.spacing[6] || 24,
      paddingTop: theme.spacing[5] || 20,
      paddingBottom: theme.spacing[4] || 16,
      borderBottomLeftRadius: theme.borderRadius?.xxl || 32,
      borderBottomRightRadius: theme.borderRadius?.xxl || 32,
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.primary || '#F5F5F5',
      ...theme.shadows?.md,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.background?.secondary || '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.primary || '#F0F0F0',
      ...theme.shadows?.sm,
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: theme.spacing[5] || 20,
    },
    headerTitle: {
      fontSize: theme.typography?.h2?.fontSize || 26,
      fontWeight: '600',
      color: theme.colors.text?.primary || '#212121',
      marginBottom: theme.spacing[1] || 6,
      textAlign: 'center',
      fontFamily: 'System',
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: theme.typography?.body?.fontSize || 16,
      color: theme.colors.text?.tertiary || '#9E9E9E',
      fontWeight: '500',
      textAlign: 'center',
      fontFamily: 'System',
      letterSpacing: -0.3,
      lineHeight: 22,
    },
    logoutButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${theme.colors.status?.error}10` || '#FEF7F7',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.primary || '#F0F0F0',
      ...theme.shadows?.sm,
    },

    // Search Styles - Ultra soft and premium
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[6] || 24,
      paddingVertical: theme.spacing[4] || 16,
      gap: theme.spacing[4] || 18,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background?.tertiary || '#F1F3F4',
      borderRadius: theme.spacing[6] || 24,
      paddingHorizontal: theme.spacing[5] || 22,
      height: 58,
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.primary || '#F0F0F0',
      gap: theme.spacing[4] || 16,
      ...theme.shadows?.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography?.body?.fontSize || 17,
      color: theme.colors.text?.primary || '#212121',
      fontWeight: '500',
      fontFamily: 'System',
      letterSpacing: -0.3,
    },
    filterButton: {
      width: 58,
      height: 58,
      borderRadius: 24,
      backgroundColor: `${theme.colors.primary?.main}20` || '#E3F2FD',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${theme.colors.primary?.main}30` || '#E0F2FE',
      ...theme.shadows?.sm,
    },

    // Error Styles
    errorContainer: {
      backgroundColor: `${theme.colors.status?.error}10` || '#FEF2F2',
      borderWidth: 1,
      borderColor: `${theme.colors.status?.error}30` || '#FECACA',
      borderRadius: theme.borderRadius?.lg || 16,
      paddingHorizontal: theme.spacing[5] || 20,
      paddingVertical: theme.spacing[4] || 16,
      marginHorizontal: theme.spacing[6] || 24,
      marginBottom: theme.spacing[5] || 20,
      ...theme.shadows?.sm,
    },
    errorText: {
      fontSize: theme.typography?.body?.fontSize || 16,
      color: theme.colors.status?.error || '#DC2626',
      fontWeight: '500',
      textAlign: 'center',
      fontFamily: 'System',
    },

    // No Results Styles
    noResultsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[6] || 24,
      paddingVertical: theme.spacing[16] || 60,
    },
    noResultsText: {
      fontSize: theme.typography?.h4?.fontSize || 20,
      color: theme.colors.text?.primary || '#212121',
      fontWeight: '600',
      textAlign: 'center',
      marginTop: theme.spacing[4] || 16,
      marginBottom: theme.spacing[2] || 8,
      fontFamily: 'System',
      letterSpacing: -0.3,
    },
    noResultsSubtext: {
      fontSize: theme.typography?.body?.fontSize || 16,
      color: theme.colors.text?.tertiary || '#9E9E9E',
      fontWeight: '400',
      textAlign: 'center',
      fontFamily: 'System',
      letterSpacing: -0.2,
    },

    // Section Styles - Enhanced soft typography
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[5] || 22,
    },
    sectionTitle: {
      fontSize: theme.typography?.h3?.fontSize || 24,
      fontWeight: '600',
      color: theme.colors.text?.primary || '#212121',
      fontFamily: 'System',
      letterSpacing: -0.5,
    },
    seeAllText: {
      fontSize: theme.typography?.body?.fontSize || 16,
      color: theme.colors.primary?.main || '#3949AB',
      fontWeight: '600',
      fontFamily: 'System',
      letterSpacing: -0.3,
      paddingHorizontal: theme.spacing[3] || 12,
      paddingVertical: theme.spacing[1] || 6,
      borderRadius: theme.borderRadius?.lg || 16,
      backgroundColor: `${theme.colors.primary?.main}20` || '#E3F2FD',
      overflow: 'hidden',
    },

    // Popular Jobs Styles - Enhanced soft spacing and curves
    popularJobsContainer: {
      paddingBottom: theme.spacing[9] || 36,
      paddingHorizontal: theme.spacing[6] || 24,
    },
    popularJobsScroll: {
      paddingLeft: 0,
      paddingRight: theme.spacing[5] || 20,
    },

    // Recent Jobs Styles - Enhanced soft spacing
    recentJobsContainer: {
      paddingHorizontal: theme.spacing[6] || 24,
      paddingBottom: theme.spacing[9] || 36,
    },
    recentJobsList: {
      gap: theme.spacing[5] || 20,
    },
  });
