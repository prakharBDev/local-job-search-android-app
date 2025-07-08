import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.userName}>{user.name}!</Text>
          <Text style={styles.subtitle}>Here’s your job search progress</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileCard} onPress={handleProfilePress} activeOpacity={0.7}>
            <Text style={styles.profileName}>{user.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['Today', 'This Week', 'This Month'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsGrid}>
        <View style={styles.cardBox}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✈️</Text>
          </View>
          <Text style={styles.cardTitle}>Applied to{"\n"}Senior Developer</Text>
          <Text style={styles.cardCount}>24</Text>
          <Text style={styles.cardTime}>2 hours ago</Text>
        </View>
        <View style={styles.cardBox}>
          <View style={styles.iconCircleBlue}>
            <Text style={styles.iconText}>👁️</Text>
          </View>
          <Text style={styles.cardTitle}>Profile Views</Text>
          <Text style={styles.cardCount}>156 <Text style={styles.percentUp}>+12%</Text></Text>
        </View>
      </View>
      <View style={styles.cardsGrid}>
        <View style={styles.cardBox}>
          <View style={styles.iconCircleGreen}>
            <Text style={styles.iconText}>📅</Text>
          </View>
          <Text style={styles.cardTitle}>Interviews Scheduled</Text>
          <Text style={styles.cardCount}>3</Text>
          <Text style={styles.cardTime}>1 day ago</Text>
        </View>
        <View style={styles.cardBox}>
          <View style={styles.iconCirclePurple}>
            <Text style={styles.iconText}>🎯</Text>
          </View>
          <Text style={styles.cardTitle}>Job Matches</Text>
          <Text style={styles.cardCount}>89 <Text style={styles.percentUp}>+2%</Text></Text>
        </View>
      </View>

      {/* Daily Goal Progress */}
      <Text style={styles.sectionTitle}>Daily Goal Progress</Text>
      <View style={styles.progressCard}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Job Applications</Text>
          <Text style={styles.progressValue}>3/5 completed</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: '60%' }]} />
        </View>
        <View style={[styles.progressRow, { marginTop: 16 }]}> 
          <Text style={styles.progressLabel}>Profile Updates</Text>
          <Text style={styles.progressValue}>1/2 completed</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarOrange, { width: '50%' }]} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#F7FAFF',
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: '#F7FAFF',
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#181C32',
    marginBottom: 0,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#181C32',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    marginBottom: 0,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginRight: 8,
  },
  profileName: {
    fontWeight: '600',
    color: '#181C32',
    fontSize: 17,
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  logoutText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#EEF4FF',
    borderRadius: 20,
    padding: 6,
    marginTop: 8,
    marginBottom: 24,
    width: 320,
    justifyContent: 'center',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#0076FF',
  },
  tabText: {
    color: '#0076FF',
    fontWeight: '600',
    fontSize: 17,
  },
  activeTabText: {
    color: '#fff',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginTop: 24,
    marginBottom: 8,
  },
  viewAll: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 15,
  },
  cardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'flex-start',
  },
  iconCircle: {
    backgroundColor: '#EAF0FF',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircleBlue: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircleGreen: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCirclePurple: {
    backgroundColor: '#E9D5FF',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 18,
  },
  cardTitle: {
    fontWeight: '600',
    color: '#222',
    fontSize: 15,
    marginBottom: 4,
  },
  cardCount: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
    marginBottom: 2,
  },
  cardTime: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 2,
  },
  percentUp: {
    color: '#22C55E',
    fontWeight: '600',
    fontSize: 15,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontWeight: '600',
    color: '#222',
    fontSize: 15,
  },
  progressValue: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarBg: {
    backgroundColor: '#E5E7EB',
    height: 8,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 2,
    width: '100%',
  },
  progressBar: {
    backgroundColor: '#3B82F6',
    height: 8,
    borderRadius: 8,
  },
  progressBarOrange: {
    backgroundColor: '#F59E42',
    height: 8,
    borderRadius: 8,
  },
});

export default DashboardScreen;
