import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../../components/elements';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const DashboardScreen = () => {
  const { user, userRecord, logout } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('This Week');
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  // Use actual user data from auth context - prioritize userRecord name
  const userName = useMemo(
    () =>
      userRecord?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'User',
    [userRecord?.name, user?.user_metadata?.full_name, user?.email],
  );

  const handleProfilePress = useCallback(() => {
    // TODO: Navigate to profile screen
  }, []);

  const handleLogout = useCallback(async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoggingOut(true);
            await logout();

            // Reset navigation to ensure clean state
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert(
              'Logout Failed',
              'There was an error logging out. Please try again.',
              [{ text: 'OK' }],
            );
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  }, [logout, navigation]);



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />

      {/* App Header */}
      <AppHeader
        title="Dashboard"
        subtitle={`Welcome back, ${userName}!`}
        rightIcon={<Text style={styles.iconText}>👤</Text>}
        onRightPress={handleProfilePress}
        background="#F7F9FC"
        centered={true}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs Section */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            {['Today', 'This Week', 'This Month'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Recent Activity Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Cards Grid - Improved Layout */}
          <View style={styles.cardsGrid}>
            {/* Card 1: Job Applications */}
            <View style={styles.activityCard}>
              <View style={styles.cardTopSection}>
                <View style={styles.iconContainer}>
                  <Text style={styles.cardIcon}>✈️</Text>
                </View>
                <Text style={styles.cardLabel}>
                  Applied to Senior Developer
                </Text>
              </View>
              <View style={styles.cardValueSection}>
                <Text style={styles.cardValue}>24</Text>
              </View>
              <View style={styles.cardBottomSection}>
                <Text style={styles.cardSubtext}>2 hours ago</Text>
              </View>
            </View>

            {/* Card 2: Profile Views */}
            <View style={styles.activityCard}>
              <View style={styles.cardTopSection}>
                <View style={[styles.iconContainer, styles.iconContainerBlue]}>
                  <Text style={styles.cardIcon}>👁️</Text>
                </View>
                <Text style={styles.cardLabel}>Profile Views</Text>
              </View>
              <View style={styles.cardValueSection}>
                <Text style={styles.cardValue}>
                  156 <Text style={styles.trendPositive}>+12%</Text>
                </Text>
              </View>
              <View style={styles.cardBottomSection}>
                <Text style={styles.cardSubtext}>This week</Text>
              </View>
            </View>

            {/* Card 3: Interviews Scheduled */}
            <View style={styles.activityCard}>
              <View style={styles.cardTopSection}>
                <View style={[styles.iconContainer, styles.iconContainerGreen]}>
                  <Text style={styles.cardIcon}>📅</Text>
                </View>
                <Text style={styles.cardLabel}>Interviews Scheduled</Text>
              </View>
              <View style={styles.cardValueSection}>
                <Text style={styles.cardValue}>3</Text>
              </View>
              <View style={styles.cardBottomSection}>
                <Text style={styles.cardSubtext}>1 day ago</Text>
              </View>
            </View>

            {/* Card 4: Job Matches */}
            <View style={styles.activityCard}>
              <View style={styles.cardTopSection}>
                <View
                  style={[styles.iconContainer, styles.iconContainerPurple]}
                >
                  <Text style={styles.cardIcon}>🎯</Text>
                </View>
                <Text style={styles.cardLabel}>Job Matches</Text>
              </View>
              <View style={styles.cardValueSection}>
                <Text style={styles.cardValue}>
                  89 <Text style={styles.trendPositive}>+2%</Text>
                </Text>
              </View>
              <View style={styles.cardBottomSection}>
                <Text style={styles.cardSubtext}>New matches</Text>
              </View>
            </View>
          </View>

          {/* Daily Goal Progress Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Goal Progress</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Job Applications</Text>
                <Text style={styles.progressValue}>3/5 completed</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: '60%' }]} />
              </View>
            </View>

            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Profile Updates</Text>
                <Text style={styles.progressValue}>1/2 completed</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarOrange, { width: '50%' }]} />
              </View>
            </View>
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // Header Styles - More attractive and refined
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  welcomeSection: {
    flex: 1,
    paddingRight: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  userName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  headerActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,
  },
  profileCard: {
    backgroundColor: '#6174f9',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#6174f9',
  },
  profileName: {
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  logoutBtn: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoutText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },

  // Tabs Styles - Enhanced with better spacing
  tabsContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    minWidth: 90,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6174f9',
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    color: '#6174f9',
    fontWeight: '500',
    fontSize: 15,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Content Styles - Better organization
  contentContainer: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 20,
    color: '#1E293B',
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  viewAllText: {
    color: '#6174f9',
    fontWeight: '500',
    fontSize: 15,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },

  // Improved Activity Cards Grid Layout
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    width: '48%',
    minHeight: 140,
    marginBottom: 16,
    shadowColor: bluewhiteTheme.colors.text.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5EAF1',
    justifyContent: 'space-between',
  },

  // Card Top Section - Icon + Label
  cardTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  iconContainer: {
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerBlue: {
    backgroundColor: '#DBEAFE',
  },
  iconContainerGreen: {
    backgroundColor: '#DCFCE7',
  },
  iconContainerPurple: {
    backgroundColor: '#F3E8FF',
  },
  cardIcon: {
    fontSize: 16,
  },
  cardLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    letterSpacing: -0.1,
    lineHeight: 18,
  },

  // Card Value Section - Main Number
  cardValueSection: {
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'System',
    letterSpacing: -0.4,
  },
  trendPositive: {
    color: '#22C55E',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'System',
  },

  // Card Bottom Section - Subtext
  cardBottomSection: {
    marginTop: 'auto',
  },
  cardSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },

  // Progress Styles - Enhanced with better visual hierarchy
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: bluewhiteTheme.colors.text.tertiary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: bluewhiteTheme.colors.background.tertiary,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontWeight: '500',
    color: '#1E293B',
    fontSize: 16,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  progressValue: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
  },
  progressBarContainer: {
    backgroundColor: '#F1F5F9',
    height: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: '#6174f9',
    height: 8,
    borderRadius: 8,
  },
  progressBarOrange: {
    backgroundColor: '#F59E0B',
    height: 8,
    borderRadius: 8,
  },


});

export default memo(DashboardScreen);
