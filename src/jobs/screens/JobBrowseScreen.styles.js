import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },

    // Loading States
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#6B7280',
      fontWeight: '500',
    },

    // Header
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      backgroundColor: '#FFFFFF',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#6B7280',
      fontWeight: '400',
    },

    // Search Section
    searchSection: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#1F2937',
      fontWeight: '400',
    },
    clearButton: {
      padding: 4,
      borderRadius: 12,
      backgroundColor: '#E5E7EB',
    },

    // Filters
    filtersContainer: {
      maxHeight: 44,
    },
    filtersContent: {
      paddingRight: 20,
    },
    filterPill: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      marginRight: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    filterPillSelected: {
      backgroundColor: theme.colors.primary.main,
      borderColor: theme.colors.primary.main,
    },
    filterPillText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#6B7280',
    },
    filterPillTextSelected: {
      color: '#FFFFFF',
    },

    // Filters Section
    filtersSection: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },

    // Popular Jobs Section
    popularJobsSection: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1F2937',
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary.main,
    },
    popularJobsContainer: {
      paddingRight: 0,
    },

    // Jobs List
    jobsList: {
      flex: 1,
    },
    jobsListContent: {
      paddingBottom: 100,
    },

    // Job Card
    jobCard: {
      marginBottom: 16,
      marginHorizontal: 20,
      padding: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },

    // Company Header
    companyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    companyIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: `${theme.colors.primary.light}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    companyInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 2,
    },
    verifiedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    verifiedText: {
      fontSize: 12,
      color: '#10B981',
      fontWeight: '500',
      marginLeft: 4,
    },

    // Job Details
    jobTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 8,
      lineHeight: 26,
    },
    jobDescription: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20,
      marginBottom: 12,
    },

    // Job Meta
    jobMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      marginBottom: 4,
    },
    metaText: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
      marginLeft: 4,
    },

    // Skills
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    skillTag: {
      backgroundColor: `${theme.colors.primary.light}20`,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: `${theme.colors.primary.light}40`,
    },
    skillText: {
      fontSize: 12,
      color: theme.colors.primary.dark,
      fontWeight: '500',
    },

    // Apply Section
    applySection: {
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      paddingTop: 16,
      alignItems: 'flex-end',
    },
    applyButton: {
      minWidth: 120,
    },
    saveButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#F3F4F6',
      marginLeft: 8,
    },
    cardActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 16,
    },
    appliedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D1FAE5',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    appliedText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#065F46',
      marginLeft: 4,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    applyButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 6,
    },
    appliedButtonText: {
      color: '#6B7280',
    },

    // Empty State
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
      paddingHorizontal: 40,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#374151',
      marginTop: 16,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
    },

    // Filter Modal Styles
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1F2937',
    },
    modalSearchSection: {
      marginBottom: 24,
    },
    modalSection: {
      marginBottom: 24,
    },
    modalSectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 12,
    },
    modalSearchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    modalSearchInput: {
      flex: 1,
      fontSize: 16,
      color: '#1F2937',
      marginLeft: 12,
    },
    modalOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    modalOption: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    modalOptionSelected: {
      backgroundColor: theme.colors.primary.main,
      borderColor: theme.colors.primary.main,
    },
    modalOptionText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#6B7280',
    },
    modalOptionTextSelected: {
      color: '#FFFFFF',
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    modalClearButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
    },
    modalClearButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#6B7280',
    },
    modalApplyButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.primary.main,
      alignItems: 'center',
    },
    modalApplyButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#FFFFFF',
    },
  });
