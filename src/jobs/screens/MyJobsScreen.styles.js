import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background?.primary || '#F3F4F6', // Off-white for depth contrast
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
      fontWeight: '700', // font-bold for section headings
      color: theme.colors.text?.primary || '#111827', // High contrast black
      marginBottom: theme.spacing[1] || 6,
      textAlign: 'center',
      fontFamily: 'Inter',
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: theme.typography?.body?.fontSize || 16,
      color: theme.colors.text?.secondary || '#6B7280',
      fontWeight: '500',
      textAlign: 'center',
      fontFamily: 'System',
      letterSpacing: -0.2,
    },

    // Search Styles - Enhanced with better spacing
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[6] || 24,
      paddingVertical: theme.spacing[4] || 16,
      gap: theme.spacing[3] || 12,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
      borderRadius: theme.borderRadius?.xl || 20,
      paddingHorizontal: theme.spacing[4] || 16,
      paddingVertical: theme.spacing[3] || 12,
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.secondary || '#E5E7EB',
      ...theme.shadows?.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.typography?.body?.fontSize || 16,
      color: theme.colors.text?.primary || '#1F2937',
      marginLeft: theme.spacing[2] || 8,
      fontFamily: 'System',
    },
    filterButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.secondary || '#E5E7EB',
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
    browseButton: {
      backgroundColor: theme.colors.primary?.main || '#6475f8',
      paddingHorizontal: theme.spacing[6] || 24,
      paddingVertical: theme.spacing[3] || 12,
      borderRadius: theme.borderRadius?.lg || 16,
      marginTop: theme.spacing[4] || 16,
      ...theme.shadows?.md,
    },
    browseButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography?.body?.fontSize || 16,
      fontWeight: '600',
      textAlign: 'center',
      fontFamily: 'System',
    },

    // Section Styles - Enhanced soft typography
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[5] || 22,
    },
    sectionTitle: {
      fontSize: 20, // text-xl equivalent
      fontWeight: '700', // font-bold as requested
      color: theme.colors.text?.primary || '#111827', // High contrast black
      fontFamily: 'Inter',
      letterSpacing: -0.5,
      marginTop: 24, // mt-6 spacing for sections
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

    // Stats Container for Seeker View
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing[3] || 12,
      marginTop: theme.spacing[4] || 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
      borderRadius: theme.borderRadius?.lg || 16,
      padding: theme.spacing[4] || 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.secondary || '#E5E7EB',
      ...theme.shadows?.sm,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.background?.secondary || '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[2] || 8,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text?.primary || '#1F2937',
      marginBottom: theme.spacing[1] || 4,
      fontFamily: 'Inter',
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.text?.secondary || '#6B7280',
      textAlign: 'center',
      fontFamily: 'System',
    },

    // Actions Container for Seeker View
    actionsContainer: {
      flexDirection: 'row',
      gap: theme.spacing[4] || 16,
      marginTop: theme.spacing[4] || 16,
    },
    actionCard: {
      flex: 1,
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
      borderRadius: theme.borderRadius?.lg || 16,
      padding: theme.spacing[4] || 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.secondary || '#E5E7EB',
      ...theme.shadows?.sm,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.background?.secondary || '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[3] || 12,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text?.primary || '#1F2937',
      marginBottom: theme.spacing[1] || 4,
      textAlign: 'center',
      fontFamily: 'Inter',
    },
    actionSubtitle: {
      fontSize: 12,
      fontWeight: '400',
      color: theme.colors.text?.secondary || '#6B7280',
      textAlign: 'center',
      fontFamily: 'System',
    },
  });
