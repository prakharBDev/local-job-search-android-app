import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
    },

    // Error State
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#374151',
      marginTop: 16,
      marginBottom: 8,
    },
    errorText: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 24,
    },
    backButton: {
      minWidth: 120,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
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
      marginLeft: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1F2937',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
    },

    // Scroll Content
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },

    // Status Card
    statusCard: {
      marginBottom: 20,
      padding: 24,
      backgroundColor: '#FFFFFF',
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    statusIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    statusInfo: {
      flex: 1,
    },
    statusText: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    statusDate: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
    },

    // Congratulations Section
    congratsSection: {
      backgroundColor: '#F0FDF4',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#BBF7D0',
    },
    congratsText: {
      fontSize: 14,
      color: '#15803D',
      lineHeight: 20,
      fontWeight: '500',
    },

    // Rejection Section
    rejectionSection: {
      backgroundColor: '#FEF2F2',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#FECACA',
    },
    rejectionText: {
      fontSize: 14,
      color: '#DC2626',
      lineHeight: 20,
      fontWeight: '500',
    },

    // Job Card
    jobCard: {
      marginBottom: 20,
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    jobHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    companyIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: '#EFF6FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    jobInfo: {
      flex: 1,
    },
    jobTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4,
    },
    companyName: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
    },
    jobMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      marginBottom: 8,
    },
    metaText: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
      marginLeft: 6,
    },
    viewJobButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#F0F9FF',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#BAE6FD',
    },
    viewJobText: {
      fontSize: 14,
      color: '#3B82F6',
      fontWeight: '600',
    },

    // Message Card
    messageCard: {
      marginBottom: 20,
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    messageTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 12,
    },
    messageText: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20,
      fontStyle: 'italic',
    },

    // Timeline Card
    timelineCard: {
      marginBottom: 24,
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    timelineTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 20,
    },
    timelineItem: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    timelineDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      marginTop: 4,
    },
    timelineContent: {
      flex: 1,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    timelineEventTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: 4,
    },
    timelineEventDate: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '500',
      marginBottom: 6,
    },
    timelineEventDesc: {
      fontSize: 12,
      color: '#9CA3AF',
      lineHeight: 16,
    },

    // Actions Container
    actionsContainer: {
      gap: 12,
    },
    actionButton: {
      flex: 1,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#3B82F6',
      marginLeft: 8,
    },
  });