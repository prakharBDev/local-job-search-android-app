import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F9FC',
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 40,
    },

    // Header Styles - Ultra soft and premium
    headerContainer: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 16, // Reduced from 28 to 16
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      shadowColor: '#8B9DC3',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 4,
      borderWidth: 0.5,
      borderColor: '#F1F5F9',
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
      backgroundColor: '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#CBD5E1',
      shadowOffset: { width: -2, height: -2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 2,
      // Neumorphism inner shadow effect
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: '600', // Reduced from '800' to '600' for softer appearance
      color: '#1E293B',
      marginBottom: 6,
      textAlign: 'center',
      fontFamily: 'System',
      letterSpacing: -0.5, // Reduced letter spacing for softer look
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#64748B',
      fontWeight: '500',
      textAlign: 'center',
      fontFamily: 'System',
      letterSpacing: -0.3,
      lineHeight: 22,
      opacity: 0.8,
    },
    logoutButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FEF7F7',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#F87171',
      shadowOffset: { width: -2, height: -2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },

    // Search Styles - Ultra soft and premium
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16, // Reduced from 24 to 16
      gap: 18,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      paddingHorizontal: 22,
      height: 58,
      shadowColor: '#8B9DC3',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 20,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#F1F5F9',
      gap: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 17,
      color: '#1F2937',
      fontWeight: '500',
      fontFamily: 'System',
      letterSpacing: -0.3,
    },
    filterButton: {
      width: 58,
      height: 58,
      borderRadius: 24,
      backgroundColor: '#F0F7FF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#3B82F6',
      shadowOffset: { width: -2, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#E0F2FE',
    },

    // Section Styles - Enhanced soft typography
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 22,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600', // Reduced from '800' to '600' for softer appearance
      color: '#1E293B',
      fontFamily: 'System',
      letterSpacing: -0.5, // Reduced letter spacing for softer look
    },
    seeAllText: {
      fontSize: 16,
      color: '#3B82F6',
      fontWeight: '700',
      fontFamily: 'System',
      letterSpacing: -0.3,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: '#F0F7FF',
      overflow: 'hidden',
    },

    // Popular Jobs Styles - Enhanced soft spacing and curves
    popularJobsContainer: {
      paddingBottom: 36,
      paddingHorizontal: 24,
    },
    popularJobsScroll: {
      paddingLeft: 0,
      paddingRight: 20,
    },

    // Recent Jobs Styles - Enhanced soft spacing
    recentJobsContainer: {
      paddingHorizontal: 24,
      paddingBottom: 36,
    },
    recentJobsList: {
      gap: 20,
    },
  });
