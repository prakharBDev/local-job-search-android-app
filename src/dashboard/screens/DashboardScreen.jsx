import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const user = {
  name: 'John Doe',
};

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState('This Week');

  // Handler stubs
  const handleProfilePress = () => {
    // TODO: Navigate to profile screen
  };
  const handleLogout = () => {
    // TODO: Implement logout logic
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{user.name}!</Text>
              <Text style={styles.subtitle}>
                Here's your job search progress
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.profileCard}
                onPress={handleProfilePress}
                activeOpacity={0.8}
              >
                <Text style={styles.profileName}>{user.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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

          {/* Activity Cards Grid */}
          <View style={styles.cardsContainer}>
            <View style={styles.cardRow}>
              <View style={[styles.activityCard, styles.cardLeft]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>✈️</Text>
                  </View>
                  <Text style={styles.cardTitle}>
                    Applied to{'\n'}Senior Developer
                  </Text>
                </View>
                <View style={styles.cardMainContent}>
                  <Text style={styles.cardCount}>24</Text>
                </View>
                <View style={styles.cardBottomInfo}>
                  <Text style={styles.cardTime}>2 hours ago</Text>
                </View>
              </View>
              <View style={[styles.activityCard, styles.cardRight]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircleBlue}>
                    <Text style={styles.iconText}>👁️</Text>
                  </View>
                  <Text style={styles.cardTitle}>Profile Views</Text>
                </View>
                <View style={styles.cardMainContent}>
                  <Text style={styles.cardCount}>
                    156 <Text style={styles.percentUp}>+12%</Text>
                  </Text>
                </View>
                <View style={styles.cardBottomInfo}>
                  <Text style={styles.cardSubtext}>This week</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardRow}>
              <View style={[styles.activityCard, styles.cardLeft]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircleGreen}>
                    <Text style={styles.iconText}>📅</Text>
                  </View>
                  <Text style={styles.cardTitle}>Interviews Scheduled</Text>
                </View>
                <View style={styles.cardMainContent}>
                  <Text style={styles.cardCount}>3</Text>
                </View>
                <View style={styles.cardBottomInfo}>
                  <Text style={styles.cardTime}>1 day ago</Text>
                </View>
              </View>
              <View style={[styles.activityCard, styles.cardRight]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCirclePurple}>
                    <Text style={styles.iconText}>🎯</Text>
                  </View>
                  <Text style={styles.cardTitle}>Job Matches</Text>
                </View>
                <View style={styles.cardMainContent}>
                  <Text style={styles.cardCount}>
                    89 <Text style={styles.percentUp}>+2%</Text>
                  </Text>
                </View>
                <View style={styles.cardBottomInfo}>
                  <Text style={styles.cardSubtext}>New matches</Text>
                </View>
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
    shadowColor: '#3B82F6',
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
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#2563EB',
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
    shadowColor: '#3B82F6',
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
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    color: '#3B82F6',
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
    color: '#3B82F6',
    fontWeight: '500',
    fontSize: 15,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },

  // Cards Styles - Fixed alignment issues
  cardsContainer: {
    marginBottom: 32,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    minHeight: 160,
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'space-between',
  },
  cardLeft: {
    marginRight: 8,
  },
  cardRight: {
    marginLeft: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    marginBottom: 16,
  },
  iconCircle: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconCircleBlue: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconCircleGreen: {
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconCirclePurple: {
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontWeight: '500',
    color: '#1E293B',
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: 'System',
    letterSpacing: -0.2,
    minHeight: 40,
  },
  cardMainContent: {
    marginBottom: 8,
  },
  cardCount: {
    fontWeight: '600',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.4,
  },
  cardBottomInfo: {
    marginTop: 'auto',
  },
  cardTime: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'System',
  },
  cardSubtext: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'System',
    marginTop: 4,
  },
  percentUp: {
    color: '#22C55E',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'System',
  },

  // Progress Styles - Enhanced with better visual hierarchy
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    backgroundColor: '#3B82F6',
    height: 8,
    borderRadius: 8,
  },
  progressBarOrange: {
    backgroundColor: '#F59E0B',
    height: 8,
    borderRadius: 8,
  },
});

export default DashboardScreen;
