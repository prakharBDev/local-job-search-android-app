import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';
import { seekerService, companyService } from '../../services';

const ProfileScreen = ({ navigation }) => {
  const { user, userRecord, logout } = useContext(AuthContext);
  const { currentMode, toggleMode } = useContext(UserContext);

  const handleLogout = async () => {
    await logout();
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleViewApplications = () => {
    // TODO: Navigate to applications screen
    console.log('View Applications pressed');
  };

  const handleViewResume = () => {
    // TODO: Navigate to resume screen
    console.log('View Resume pressed');
  };

  const handleModeSwitch = async () => {
    const newMode = currentMode === 'seeker' ? 'poster' : 'seeker';
    Alert.alert(
      'Switch User Mode',
      `Are you sure you want to switch to ${
        newMode === 'seeker' ? 'Job Seeker' : 'Job Poster'
      } mode?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Switch',
          onPress: async () => {
            await toggleMode();
            // Check if profile exists for the new mode
            const { data: seekerProfile } = await seekerService.getSeekerProfile(user.id);
            const { data: companyProfile } = await companyService.getCompanyProfile(user.id);

            if (newMode === 'seeker' && !seekerProfile) {
              navigation.navigate('SeekerProfileSetup');
            } else if (newMode === 'poster' && !companyProfile) {
              navigation.navigate('CompanyProfileSetup');
            } else {
              navigation.navigate('Dashboard');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Profile</Text>
              <Text style={styles.headerSubtitle}>
                Manage your account & preferences
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={handleSettings}
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {(user?.name || 'User').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'John Doe'}</Text>
              <Text style={styles.userEmail}>
                {user?.email || 'john.doe@example.com'}
              </Text>
              <View style={styles.modeContainer}>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeText}>
                    {currentMode === 'seeker'
                      ? '👤 Job Seeker'
                      : '💼 Job Poster'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {currentMode === 'seeker' ? (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>24</Text>
                <Text
                  style={styles.statLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Applications
                </Text>
                <Text style={styles.statSubtext}>This month</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>8</Text>
                <Text
                  style={styles.statLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Interviews
                </Text>
                <Text style={styles.statSubtext}>Scheduled</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>156</Text>
                <Text
                  style={styles.statLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Profile Views
                </Text>
                <Text style={styles.statSubtext}>This week</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text
                  style={styles.statLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Jobs Posted
                </Text>
                <Text style={styles.statSubtext}>This month</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>48</Text>
                <Text
                  style={styles.statLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Applications
                </Text>
                <Text style={styles.statSubtext}>Received</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>6</Text>
                <Text
                  style={styles.statLabel}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Candidates
                </Text>
                <Text style={styles.statSubtext}>Hired</Text>
              </View>
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {currentMode === 'seeker' ? (
              <>
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={handleViewApplications}
                >
                  <View style={styles.actionIcon}>
                    <Text style={styles.actionEmoji}>📋</Text>
                  </View>
                  <Text style={styles.actionTitle}>My Applications</Text>
                  <Text style={styles.actionSubtitle}>
                    View all applications
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={handleViewResume}
                >
                  <View style={styles.actionIcon}>
                    <Text style={styles.actionEmoji}>📄</Text>
                  </View>
                  <Text style={styles.actionTitle}>Resume</Text>
                  <Text style={styles.actionSubtitle}>Update your resume</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => navigation.navigate('CreateJob')}
                >
                  <View style={styles.actionIcon}>
                    <Text style={styles.actionEmoji}>➕</Text>
                  </View>
                  <Text style={styles.actionTitle}>Post Job</Text>
                  <Text style={styles.actionSubtitle}>
                    Create new job posting
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => navigation.navigate('MyJobs')}
                >
                  <View style={styles.actionIcon}>
                    <Text style={styles.actionEmoji}>💼</Text>
                  </View>
                  <Text style={styles.actionTitle}>My Jobs</Text>
                  <Text style={styles.actionSubtitle}>Manage job postings</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.settingsGrid}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🔔</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Manage your alerts</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🔒</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy</Text>
                <Text style={styles.settingSubtitle}>Control your data</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingEmoji}>🌙</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Theme</Text>
                <Text style={styles.settingSubtitle}>Light mode</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode Switch */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>User Mode</Text>
          <TouchableOpacity
            style={styles.modeSwitchCard}
            onPress={handleModeSwitch}
          >
            <View style={styles.modeSwitchContent}>
              <Text style={styles.modeSwitchTitle}>
                Switch to{' '}
                {currentMode === 'seeker' ? 'Job Poster' : 'Job Seeker'}
              </Text>
              <Text style={styles.modeSwitchSubtitle}>
                {currentMode === 'seeker'
                  ? 'Start posting jobs for your company'
                  : 'Start searching for your next opportunity'}
              </Text>
            </View>
            <View style={styles.modeSwitchIcon}>
              <Text style={styles.modeSwitchEmoji}>🔄</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.supportGrid}>
            <TouchableOpacity style={styles.supportItem} onPress={handleAbout}>
              <View style={styles.supportIcon}>
                <Text style={styles.supportEmoji}>💡</Text>
              </View>
              <Text style={styles.supportTitle}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportIcon}>
                <Text style={styles.supportEmoji}>❓</Text>
              </View>
              <Text style={styles.supportTitle}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportIcon}>
                <Text style={styles.supportEmoji}>📞</Text>
              </View>
              <Text style={styles.supportTitle}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Header Styles
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  settingsButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsIcon: {
    fontSize: 20,
  },

  // Profile Card Styles
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  modeContainer: {
    flexDirection: 'row',
  },
  modeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: -0.2,
  },

  // Stats Styles - Fixed alignment issues
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 130,
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.1,
    textAlign: 'center',
    minHeight: 18,
  },
  statSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    fontFamily: 'System',
    textAlign: 'center',
    minHeight: 16,
  },

  // Section Styles
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },

  // Action Grid Styles
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIcon: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    textAlign: 'center',
  },

  // Settings Grid Styles
  settingsGrid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingIcon: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingEmoji: {
    fontSize: 20,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
  },
  settingArrow: {
    fontSize: 20,
    color: '#CBD5E1',
    fontWeight: '300',
  },

  // Mode Switch Styles
  modeSwitchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  modeSwitchContent: {
    flex: 1,
  },
  modeSwitchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  modeSwitchSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    lineHeight: 20,
  },
  modeSwitchIcon: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  modeSwitchEmoji: {
    fontSize: 24,
  },

  // Support Grid Styles
  supportGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  supportItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  supportIcon: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportEmoji: {
    fontSize: 20,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },

  // Logout Styles
  logoutContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
});

export default ProfileScreen;
