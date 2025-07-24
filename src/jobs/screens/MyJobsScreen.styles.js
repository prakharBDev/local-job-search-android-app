import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background?.primary || '#F8FAFC', // Lighter background for better contrast
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
      fontSize: 22, // text-xl equivalent
      fontWeight: '700', // font-bold as requested
      color: theme.colors.text?.primary || '#0F172A', // Darker for better contrast
      fontFamily: 'System',
      letterSpacing: -0.4,
      marginBottom: 4,
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

    // Application Components Styles
    sectionSubtitle: {
      fontSize: 15,
      color: theme.colors.text?.secondary || '#475569',
      fontWeight: '500',
      marginTop: theme.spacing[1] || 4,
      letterSpacing: -0.1,
      fontFamily: 'System',
    },
    filterSection: {
      marginTop: theme.spacing[4] || 16,
      marginBottom: theme.spacing[4] || 16,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: theme.spacing[2] || 8,
    },
    filterButtons: {
      flexDirection: 'row',
      gap: theme.spacing[2] || 8,
    },
    filterButton: {
      paddingHorizontal: theme.spacing[3] || 12,
      paddingVertical: theme.spacing[2] || 8,
      borderRadius: theme.borderRadius?.md || 12,
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.primary || '#E2E8F0',
    },
    filterButtonText: {
      fontSize: 12,
      fontWeight: '500',
    },
    applicationsList: {
      gap: theme.spacing[4] || 16,
    },
    applicationCard: {
      marginBottom: theme.spacing[3] || 12,
    },
    applicationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing[3] || 12,
    },
    jobInfo: {
      flex: 1,
    },
    jobTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: theme.spacing[1] || 4,
    },
    companyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[1] || 4,
    },
    companyName: {
      fontSize: 14,
      fontWeight: '400',
    },
    applicationDetails: {
      marginBottom: theme.spacing[3] || 12,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[2] || 8,
      gap: theme.spacing[2] || 8,
    },
    detailText: {
      fontSize: 14,
      fontWeight: '400',
    },
    statusMessage: {
      padding: theme.spacing[3] || 12,
      borderRadius: theme.borderRadius?.md || 12,
      marginBottom: theme.spacing[3] || 12,
    },
    statusMessageText: {
      fontSize: 14,
      fontWeight: '400',
      textAlign: 'center',
    },
    applicationActions: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[4] || 16,
      paddingVertical: theme.spacing[2] || 8,
      borderRadius: theme.borderRadius?.md || 12,
      gap: theme.spacing[2] || 8,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing[8] || 32,
      marginTop: theme.spacing[8] || 32,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: theme.spacing[4] || 16,
      marginBottom: theme.spacing[2] || 8,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: theme.spacing[6] || 24,
      lineHeight: 24,
    },
    emptyButton: {
      paddingHorizontal: theme.spacing[6] || 24,
      paddingVertical: theme.spacing[3] || 12,
      borderRadius: theme.borderRadius?.md || 12,
    },
    emptyButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
