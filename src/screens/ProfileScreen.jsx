import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { UserContext } from '../contexts/UserContext';
import { ProfileContext } from '../contexts/ProfileContext';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProfileSwitcher from '../components/ui/ProfileSwitcher';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    header: {
      paddingVertical: theme.spacing.lg,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    },
    userCard: {
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
    },
    modeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    modeLabel: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    modeValue: {
      fontSize: 14,
      fontWeight: '600',
    },
    profileCard: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    profileName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    profileType: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    profileDescription: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      fontStyle: 'italic',
    },
    actionCard: {
      marginBottom: theme.spacing.lg,
    },
    buttonGroup: {
      gap: theme.spacing.md,
    },
    actionButton: {
      marginBottom: theme.spacing.sm,
    },
    statsCard: {
      marginBottom: theme.spacing.lg,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      textTransform: 'uppercase',
    },
    logoutContainer: {
      paddingVertical: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl,
    },
    logoutButton: {
      backgroundColor: 'transparent',
    },
  });

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { userMode, toggleUserMode } = useContext(UserContext);
  const { activeProfile, profiles } = useContext(ProfileContext);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleLogout = async () => {
    await logout();
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile Switcher */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Profile</Text>
            <ProfileSwitcher />
          </View>
        </View>

        {/* User Info Card */}
        <Card style={styles.userCard}>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
          <View style={styles.modeContainer}>
            <Text style={styles.modeLabel}>Current Mode:</Text>
            <Text
              style={[
                styles.modeValue,
                {
                  color:
                    userMode === 'seeker'
                      ? theme.colors.primary
                      : theme.colors.secondary,
                },
              ]}
            >
              {userMode === 'seeker' ? 'Job Seeker' : 'Job Poster'}
            </Text>
          </View>
        </Card>

        {/* Active Profile Info */}
        {activeProfile && (
          <Card style={styles.profileCard}>
            <Text style={styles.sectionTitle}>Active Profile</Text>
            <Text style={styles.profileName}>{activeProfile.name}</Text>
            <Text style={styles.profileType}>{activeProfile.type}</Text>
            {activeProfile.description && (
              <Text style={styles.profileDescription}>
                {activeProfile.description}
              </Text>
            )}
          </Card>
        )}

        {/* Mode Switch */}
        <Card style={styles.actionCard}>
          <Text style={styles.sectionTitle}>User Mode</Text>
          <Button
            title={`Switch to ${
              userMode === 'seeker' ? 'Job Poster' : 'Job Seeker'
            }`}
            onPress={toggleUserMode}
            variant="outline"
            style={styles.actionButton}
          />
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Settings"
              onPress={handleSettings}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="About"
              onPress={handleAbout}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </Card>

        {/* Profile Stats */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Profile Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profiles.length}</Text>
              <Text style={styles.statLabel}>Profiles</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userMode === 'seeker' ? '5' : '3'}
              </Text>
              <Text style={styles.statLabel}>
                {userMode === 'seeker' ? 'Applied' : 'Posted'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userMode === 'seeker' ? '2' : '8'}
              </Text>
              <Text style={styles.statLabel}>
                {userMode === 'seeker' ? 'Interviews' : 'Applicants'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
            textStyle={{ color: theme.colors.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
