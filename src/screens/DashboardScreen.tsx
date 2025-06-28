import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card, Badge } from '../components/ui';
import { theme } from '../theme';
import Feather from 'react-native-vector-icons/Feather';

const DashboardScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const stats = [
    {
      label: 'Applications Sent',
      value: '24',
      change: '+12%',
      trend: 'up',
      color: theme.colors.primary.emerald,
      icon: 'send',
    },
    {
      label: 'Profile Views',
      value: '156',
      change: '+8%',
      trend: 'up',
      color: '#2196F3',
      icon: 'eye',
    },
    {
      label: 'Interviews Scheduled',
      value: '3',
      change: '+2',
      trend: 'up',
      color: theme.colors.accent.orange,
      icon: 'calendar',
    },
    {
      label: 'Job Matches',
      value: '89',
      change: '+15%',
      trend: 'up',
      color: '#9C27B0',
      icon: 'target',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'application',
      title: 'Applied to Senior Developer',
      company: 'TechCorp Inc.',
      time: '2 hours ago',
      status: 'pending',
      avatar: '#4CAF50',
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview Scheduled',
      company: 'StartupXYZ',
      time: '1 day ago',
      status: 'scheduled',
      avatar: '#2196F3',
    },
    {
      id: 3,
      type: 'match',
      title: 'New Job Match',
      company: 'DesignStudio',
      time: '2 days ago',
      status: 'new',
      avatar: '#FF9800',
    },
    {
      id: 4,
      type: 'profile',
      title: 'Profile Viewed',
      company: 'BigTech Co.',
      time: '3 days ago',
      status: 'viewed',
      avatar: '#9C27B0',
    },
  ];

  const quickActions = [
    {
      title: 'Browse Jobs',
      subtitle: 'Discover new opportunities',
      icon: 'search',
      color: [theme.colors.primary.emerald, theme.colors.primary.forest],
      action: 'browse',
    },
    {
      title: 'Update Profile',
      subtitle: 'Keep your info current',
      icon: 'user',
      color: ['#2196F3', '#1976D2'],
      action: 'profile',
    },
    {
      title: 'View Applications',
      subtitle: 'Track your progress',
      icon: 'clipboard',
      color: [theme.colors.accent.orange, '#F44336'],
      action: 'applications',
    },
    {
      title: 'Skills Assessment',
      subtitle: 'Test your abilities',
      icon: 'award',
      color: ['#9C27B0', '#673AB7'],
      action: 'skills',
    },
  ];

  const periods = ['Today', 'This Week', 'This Month'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme.colors.status.warning;
      case 'scheduled':
        return theme.colors.status.info;
      case 'new':
        return theme.colors.status.success;
      case 'viewed':
        return theme.colors.text.secondary;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'scheduled':
        return 'Scheduled';
      case 'new':
        return 'New';
      case 'viewed':
        return 'Viewed';
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F5E8', '#F3E5F5', '#E3F2FD']} // Green to purple to blue gradient
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.welcomeTitle}>Welcome back, Alex!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Here's your job search progress
                </Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Feather
                  name="bell"
                  size={24}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Period Selector */}
          <View style={styles.periodSelectorContainer}>
            <View style={styles.centeredContainer}>
              <View style={styles.periodSelector}>
                {periods.map(period => (
                  <TouchableOpacity
                    key={period}
                    onPress={() => setSelectedPeriod(period)}
                    style={[
                      styles.periodTab,
                      selectedPeriod === period && styles.periodTabActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.periodTabText,
                        selectedPeriod === period && styles.periodTabTextActive,
                      ]}
                    >
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            <View style={styles.centeredContainer}>
              <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <TouchableOpacity key={index} style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <View
                        style={[
                          styles.statIcon,
                          { backgroundColor: `${stat.color}20` },
                        ]}
                      >
                        <Feather
                          name={stat.icon}
                          size={16}
                          color={stat.color}
                        />
                      </View>
                      <Badge
                        variant="success"
                        size="sm"
                        style={styles.statBadge}
                      >
                        <Text style={styles.statBadgeText}>{stat.change}</Text>
                      </Badge>
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <View style={styles.centeredContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity key={index} style={styles.quickActionCard}>
                    <LinearGradient
                      colors={action.color}
                      style={styles.quickActionIcon}
                    >
                      <Feather
                        name={action.icon}
                        size={24}
                        color={theme.colors.text.white}
                      />
                    </LinearGradient>
                    <View style={styles.quickActionText}>
                      <Text style={styles.quickActionTitle}>
                        {action.title}
                      </Text>
                      <Text style={styles.quickActionSubtitle}>
                        {action.subtitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentActivityContainer}>
            <View style={styles.centeredContainer}>
              <View style={styles.recentActivityHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              <Card style={styles.recentActivityCard}>
                <View style={styles.activitiesList}>
                  {recentActivity.map((activity, index) => (
                    <TouchableOpacity
                      key={activity.id}
                      style={[
                        styles.activityItem,
                        index < recentActivity.length - 1 &&
                          styles.activityItemWithBorder,
                      ]}
                    >
                      <View
                        style={[
                          styles.activityAvatar,
                          { backgroundColor: activity.avatar },
                        ]}
                      >
                        <Feather
                          name={activity.type}
                          size={20}
                          color={theme.colors.text.white}
                        />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>
                          {activity.title}
                        </Text>
                        <Text style={styles.activityCompany}>
                          {activity.company} • {activity.time}
                        </Text>
                      </View>
                      <Badge
                        variant="outline"
                        size="sm"
                        style={{
                          borderColor: getStatusColor(activity.status),
                          backgroundColor: `${getStatusColor(
                            activity.status,
                          )}10`,
                        }}
                      >
                        <Text
                          style={[
                            styles.activityBadge,
                            { color: getStatusColor(activity.status) },
                          ]}
                        >
                          {getStatusLabel(activity.status)}
                        </Text>
                      </Badge>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            </View>
          </View>

          {/* Daily Goal Progress */}
          <View style={styles.dailyGoalContainer}>
            <View style={styles.centeredContainer}>
              <Text style={styles.sectionTitle}>Daily Goal Progress</Text>

              <Card style={styles.dailyGoalCard}>
                <View style={styles.dailyGoalContent}>
                  <View style={styles.goalItem}>
                    <Text style={styles.goalTitle}>Job Applications</Text>
                    <Text style={styles.goalProgress}>3/5 completed</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressBarFill,
                        styles.progressBarApplications,
                      ]}
                    />
                  </View>

                  <View style={styles.goalItem}>
                    <Text style={styles.goalTitle}>Profile Updates</Text>
                    <Text style={styles.goalProgress}>1/2 completed</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressBarFill,
                        styles.progressBarProfile,
                      ]}
                    />
                  </View>
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: theme.spacing[8],
  },
  header: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  welcomeTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  welcomeSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  periodSelectorContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  centeredContainer: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[1],
    ...theme.shadows.md,
  },
  periodTab: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'transparent',
  },
  periodTabActive: {
    backgroundColor: theme.colors.primary.emerald,
  },
  periodTabText: {
    textAlign: 'center',
    fontSize: theme.typography.buttonSmall.fontSize,
    fontWeight: theme.typography.button.fontWeight,
    color: theme.colors.text.secondary,
  },
  periodTabTextActive: {
    color: theme.colors.text.white,
  },
  statsContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    justifyContent: 'space-between',
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing[4],
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadge: {
    backgroundColor: `${theme.colors.status.success}20`,
  },
  statBadgeText: {
    fontSize: 10,
    color: theme.colors.status.success,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing[4],
    alignItems: 'center',
    gap: theme.spacing[3],
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  quickActionText: {
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[1],
  },
  quickActionSubtitle: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  recentActivityContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },
  recentActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  viewAllText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.primary.emerald,
    fontWeight: '500',
  },
  recentActivityCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...theme.shadows.lg,
  },
  activitiesList: {
    gap: theme.spacing[1],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
  },
  activityItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  activityCompany: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
  activityBadge: {
    fontSize: 10,
    fontWeight: '500',
  },
  dailyGoalContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  dailyGoalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...theme.shadows.lg,
  },
  dailyGoalContent: {
    gap: theme.spacing[4],
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  goalProgress: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border.secondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressBarApplications: {
    width: '60%',
    backgroundColor: theme.colors.primary.emerald,
  },
  progressBarProfile: {
    width: '50%',
    backgroundColor: theme.colors.accent.orange,
  },
});

export default DashboardScreen;
