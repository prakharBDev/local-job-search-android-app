import React, { useState, useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { seekerService, companyService, userService } from '../../services/index.js';
import { AppHeader, Icon } from '../../components/elements';
import { theme } from '../../theme';


const ProfileScreen = ({ navigation }) => {
  const { user, userRecord, updateUserRecord, checkAuthStatus, logout } = useAuth();
  const { currentMode } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onRefresh = useRef(async () => {
    setRefreshing(true);
    // Refresh both user data and profile data
    await checkAuthStatus();
    await loadProfileData();
    setRefreshing(false);
  });

  // Load profile data from database
  const loadProfileData = async () => {
    if (!user?.id) {
      setLoadingProfile(false);
      return;
    }

    try {
      setLoadingProfile(true);
      
      // First, fetch user data from users table to get is_seeker flag
      const { data: userData, error: userError } = await userService.getUserById(user.id);

      if (userError) {
        console.error('Error fetching user data:', userError);
        setLoadingProfile(false);
        return;
      }

      // Determine user type based on is_seeker flag
      const isSeeker = userData?.is_seeker ?? true; // Default to seeker if not specified

      // Fetch appropriate profile data based on user type
      let result;
      if (isSeeker) {
        result = await seekerService.getSeekerProfile(user.id);
      } else {
        result = await companyService.getCompanyProfile(user.id);
      }

      if (result.data) {
        setProfileData(result.data);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Removed checkAuthStatus() as it was causing navigation reset
      loadProfileData();
    }, [user?.id, currentMode]),
  );

  // Get display name with proper fallback chain
  const getDisplayName = () => {
    if (profileData?.name) {
      return profileData.name;
    }
    if (profileData?.full_name) {
      return profileData.full_name;
    }
    if (profileData?.company_name) {
      return profileData.company_name;
    }
    if (profileData?.users?.name) {
      return profileData.users.name;
    }
    // Check userRecord from AuthContext (contains data from users table)
    if (userRecord?.name) {
      return userRecord.name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get skills from profile data
  const getSkills = () => {
    // Check for nested seeker_skills structure
    if (
      profileData?.seeker_skills &&
      Array.isArray(profileData.seeker_skills)
    ) {
      const skills = profileData.seeker_skills
        .map(skillObj => {
          // Handle both direct skill objects and nested skill objects
          if (skillObj.skills && skillObj.skills.name) {
            return skillObj.skills.name;
          }
          if (skillObj.name) {
            return skillObj.name;
          }
          return null;
        })
        .filter(Boolean);

      return skills;
    }
    // Fallback to direct skills array
    if (profileData?.skills && Array.isArray(profileData.skills)) {
      const skills = profileData.skills.map(skill => skill.name || skill);
      return skills;
    }

    return [];
  };

  // Render skills as buttons
  const renderSkills = () => {
    const skills = getSkills();

    if (skills.length === 0) {
      return <Text style={styles.noSkillsText}>No skills added yet</Text>;
    }

    return (
      <View style={styles.skillsGrid}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillButton}>
            <Text style={styles.skillButtonText}>{skill}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Get experience level from profile data
  const getExperienceLevel = () => {
    if (profileData?.experience_level) {
      return profileData.experience_level;
    }
    if (profileData?.years_of_experience) {
      const years = profileData.years_of_experience;
      if (years <= 1) {
        return 'Fresher (0-1 years)';
      }
      if (years <= 3) {
        return 'Junior (1-3 years)';
      }
      if (years <= 5) {
        return 'Mid-level (3-5 years)';
      }
      return 'Senior (5+ years)';
    }
    return 'Not specified';
  };

  // Get phone number from user record
  const getPhoneNumber = () => {
    // Check profile data first (for both seekers and companies)
    if (profileData?.phone_number) {
      return profileData.phone_number;
    }
    // Check nested user data from profile (for company profiles) - database field
    if (profileData?.users?.phone_number) {
      return profileData.users.phone_number;
    }
    // Check userRecord from AuthContext (contains data from users table)
    if (userRecord?.phone_number) {
      return userRecord.phone_number;
    }
    // Check user metadata
    if (user?.user_metadata?.phone_number) {
      return user.user_metadata.phone_number;
    }
    // Check user.phone (Supabase auth field)
    if (user?.phone) {
      return user.phone;
    }
    // Check user.phone_number (database field - should not exist in auth user)
    if (user?.phone_number) {
      return user.phone_number;
    }
    return 'Not specified';
  };

  // Get city from user record
  const getCity = () => {
    // Check nested user data from profile (for company profiles)
    if (profileData?.users?.city) {
      return profileData.users.city;
    }
    // Check userRecord from AuthContext (contains data from users table)
    if (userRecord?.city) {
      return userRecord.city;
    }
    if (user?.user_metadata?.city) {
      return user.user_metadata.city;
    }
    if (user?.city) {
      return user.city;
    }
    return 'Not specified';
  };

  // Get percentage values from profile data
  const getTenthPercentage = () => {
    if (
      profileData?.tenth_percentage !== null &&
      profileData?.tenth_percentage !== undefined
    ) {
      return `${profileData.tenth_percentage}%`;
    }
    return 'Not specified';
  };

  const getTwelfthPercentage = () => {
    if (
      profileData?.twelfth_percentage !== null &&
      profileData?.twelfth_percentage !== undefined
    ) {
      return `${profileData.twelfth_percentage}%`;
    }
    return 'Not specified';
  };

  const getGraduationPercentage = () => {
    if (
      profileData?.graduation_percentage !== null &&
      profileData?.graduation_percentage !== undefined
    ) {
      return `${profileData.graduation_percentage}%`;
    }
    return 'Not specified';
  };

  // Check if percentage data exists to show/hide sections
  const hasPercentageData = () => {
    return (
      (profileData?.tenth_percentage !== null &&
        profileData?.tenth_percentage !== undefined) ||
      (profileData?.twelfth_percentage !== null &&
        profileData?.twelfth_percentage !== undefined) ||
      (profileData?.graduation_percentage !== null &&
        profileData?.graduation_percentage !== undefined)
    );
  };

  const handleLogout = async () => {
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
  };



  const handleAbout = () => {
    navigation.navigate('About');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleViewApplications = () => {
    // TODO: Navigate to applications screen
  };

  const handleViewResume = () => {
    // TODO: Navigate to resume screen
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background.secondary}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh.current}
          />
        }
      >
        {/* App Header */}
        <AppHeader
          title="Profile"
          subtitle="Manage your account & preferences"
          background={theme.colors.background.secondary}
          centered={true}
        />

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {getDisplayName().charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{getDisplayName()}</Text>
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

        {/* Contact Information Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          {/* Email Section */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailIcon}>📧</Text>
              <Text style={styles.detailTitle}>Email</Text>
            </View>
            <Text style={styles.detailValue}>
              {user?.email || 'Not specified'}
            </Text>
          </View>

          {/* Phone Number Section */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailIcon}>📞</Text>
              <Text style={styles.detailTitle}>Phone Number</Text>
            </View>
            <Text style={styles.detailValue}>{getPhoneNumber()}</Text>
          </View>

          {/* City Section */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailIcon}>📍</Text>
              <Text style={styles.detailTitle}>City</Text>
            </View>
            <Text style={styles.detailValue}>{getCity()}</Text>
          </View>
        </View>

        {/* Profile Details Section */}
        {currentMode === 'seeker' && profileData && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Profile Details</Text>

            {/* Skills Section */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailIcon}>💼</Text>
                <Text style={styles.detailTitle}>Skills</Text>
                {(() => {
                  const skillsCount = getSkills().length;
                  return skillsCount > 0 ? (
                    <View style={styles.skillsCountBadge}>
                      <Text style={styles.skillsCountText}>{skillsCount}</Text>
                    </View>
                  ) : null;
                })()}
              </View>
              {renderSkills()}
            </View>

            {/* Experience Level Section */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailIcon}>🌱</Text>
                <Text style={styles.detailTitle}>Experience Level</Text>
              </View>
              <View style={styles.experienceContainer}>
                <Text
                  style={[
                    styles.detailValue,
                    getExperienceLevel() !== 'Not specified' &&
                      styles.experienceValue,
                  ]}
                >
                  {getExperienceLevel()}
                </Text>
                {getExperienceLevel() !== 'Not specified' && (
                  <View style={styles.experienceBadge}>
                    <Text style={styles.experienceBadgeText}>Level</Text>
                  </View>
                )}
              </View>
            </View>

            {/* 10th Percentage Section */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailIcon}>📚</Text>
                <Text style={styles.detailTitle}>10th Standard</Text>
              </View>
              <View style={styles.percentageContainer}>
                <Text
                  style={[
                    styles.detailValue,
                    getTenthPercentage() !== 'Not specified' &&
                      styles.percentageValue,
                  ]}
                >
                  {getTenthPercentage()}
                </Text>
                {getTenthPercentage() !== 'Not specified' && (
                  <View style={styles.percentageBadge}>
                    <Text style={styles.percentageBadgeText}>Academic</Text>
                  </View>
                )}
              </View>
            </View>

            {/* 12th Percentage Section */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailIcon}>🎓</Text>
                <Text style={styles.detailTitle}>12th Standard</Text>
              </View>
              <View style={styles.percentageContainer}>
                <Text
                  style={[
                    styles.detailValue,
                    getTwelfthPercentage() !== 'Not specified' &&
                      styles.percentageValue,
                  ]}
                >
                  {getTwelfthPercentage()}
                </Text>
                {getTwelfthPercentage() !== 'Not specified' && (
                  <View style={styles.percentageBadge}>
                    <Text style={styles.percentageBadgeText}>Academic</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Graduation Percentage Section */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailIcon}>🎯</Text>
                <Text style={styles.detailTitle}>Graduation</Text>
              </View>
              <View style={styles.percentageContainer}>
                <Text
                  style={[
                    styles.detailValue,
                    getGraduationPercentage() !== 'Not specified' &&
                      styles.percentageValue,
                  ]}
                >
                  {getGraduationPercentage()}
                </Text>
                {getGraduationPercentage() !== 'Not specified' && (
                  <View style={styles.percentageBadge}>
                    <Text style={styles.percentageBadgeText}>Academic</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

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
          <TouchableOpacity
            style={[styles.logoutButton, isLoggingOut && { opacity: 0.6 }]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Header Styles
  headerContainer: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.interactive.border.primary,
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
    color: theme.colors.text.primary,
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  settingsButton: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
  },
  settingsIcon: {
    fontSize: 20,
    color: theme.colors.text.primary,
  },

  // Profile Card Styles
  profileCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
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
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.white,
    fontFamily: 'System',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  modeContainer: {
    flexDirection: 'row',
  },
  modeBadge: {
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.focus,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.white, // Changed to white for better contrast against purple background
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  editButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.white,
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
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.1,
    textAlign: 'center',
    minHeight: 18,
  },
  statSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.muted,
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
    color: theme.colors.text.primary,
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
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
  },
  actionIcon: {
    backgroundColor: theme.colors.primary.light,
    borderRadius: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    textAlign: 'center',
  },

  // Settings Grid Styles
  settingsGrid: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.interactive.border.primary,
  },
  settingIcon: {
    backgroundColor: theme.colors.accent.yellow,
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: theme.colors.accent.yellow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
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
    color: theme.colors.text.primary,
    marginBottom: 2,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
  },
  settingArrow: {
    fontSize: 20,
    color: theme.colors.text.muted,
    fontWeight: '300',
  },



  // Support Grid Styles
  supportGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  supportItem: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
  },
  supportIcon: {
    backgroundColor: theme.colors.accent.green,
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: theme.colors.accent.green,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  supportEmoji: {
    fontSize: 20,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
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
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: theme.colors.status.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.status.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.status.error,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },

  // Profile Details Styles
  detailCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
    minHeight: 60,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    lineHeight: 22,
    textAlign: 'left',
    flexWrap: 'wrap',
    flex: 1,
  },
  percentageValue: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontFamily: 'System',
    letterSpacing: -0.6,
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  percentageBadge: {
    backgroundColor: theme.colors.primary.light,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.focus,
    alignSelf: 'flex-start',
  },
  percentageBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.white, // Changed to white for better contrast
    fontFamily: 'System',
    letterSpacing: -0.1,
  },

  // Skills Grid Styles
  skillsGrid: {
    flexDirection: 'column',
    marginTop: 12,
    gap: 8,
  },
  skillButton: {
    backgroundColor: theme.colors.primary.light,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.focus,
    minHeight: 44,
    width: '100%',
  },
  skillButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.white, // Changed to white for better contrast against purple background
    fontFamily: 'System',
    letterSpacing: -0.1,
    textAlign: 'center',
    lineHeight: 18,
  },
  noSkillsText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    textAlign: 'center',
    marginTop: 12,
  },
  skillsCountBadge: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  skillsCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.white,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },

  // Experience Level Styles
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  experienceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontFamily: 'System',
    letterSpacing: -0.6,
    textAlign: 'left',
    flex: 1,
    flexWrap: 'wrap',
  },
  experienceBadge: {
    backgroundColor: theme.colors.primary.light,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.focus,
    alignSelf: 'flex-start',
  },
  experienceBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.white, // Changed to white for better contrast
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background.secondary,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.status.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.white,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
});

export default memo(ProfileScreen);
