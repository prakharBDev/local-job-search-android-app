import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Alert,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Card from '../../components/blocks/Card';
import Badge from '../../components/elements/Badge';
import Icon from '../../components/elements/Icon';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import { useTheme } from '../../contexts/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './MyJobsScreen.styles.js';
import PopularJobCard from './MyJobsScreen/PopularJobCard';
import RecentJobCard from './MyJobsScreen/RecentJobCard';
import { jobService, applicationService, companyService } from '../../utils/database';
import { seedDatabase, checkSeedingStatus } from '../../utils/seedData';

const MyJobsScreen = () => {
  const { user, logout, state } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const { theme } = useTheme();
  
  // Real data state
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    jobsPosted: 0,
    applicationsReceived: 0,
    applicationsSent: 0,
    profileViews: 0,
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Load initial data
    loadInitialData();
  }, [fadeAnim, state.user]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Check if seeding is needed
      const seedingStatus = await checkSeedingStatus();
      if (seedingStatus.needsCategories || seedingStatus.needsSkills) {
        await seedDatabase();
      }
      
      await Promise.all([
        loadJobs(),
        loadUserStats(),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      if (!state.userRecord?.city) return;
      
      const { data, error } = await jobService.getJobsByCity(state.userRecord.city);
      if (error) throw error;
      
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      if (!state.user?.id) return;
      
      if (user?.mode === 'poster') {
        // Load poster stats
        const { data: companyProfile } = await companyService.getCompanyProfile(state.user.id);
        if (companyProfile) {
          const { data: postedJobs } = await jobService.getJobsByCompany(companyProfile.id);
          setUserStats(prev => ({
            ...prev,
            jobsPosted: postedJobs?.length || 0,
          }));
        }
      } else {
        // Load seeker stats
        const { data: seekerApplications } = await applicationService.getApplicationsBySeeker(state.user.id);
        setUserStats(prev => ({
          ...prev,
          applicationsSent: seekerApplications?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  // Filter jobs based on search
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.description.toLowerCase().includes(search.toLowerCase()) ||
    job.company_profiles?.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Split jobs into popular (recent with more engagement) and recent
  const popularJobs = filteredJobs.slice(0, 4);
  const recentJobs = filteredJobs.slice(0, 6);

  const stats =
    user?.mode === 'poster'
      ? [
          {
            label: 'Jobs Posted',
            value: userStats.jobsPosted.toString(),
            change: userStats.jobsPosted > 0 ? `+${userStats.jobsPosted}` : '0',
            trend: 'up',
            color: theme.colors.primary.cyan,
            icon: 'briefcase',
          },
          {
            label: 'Applications Received',
            value: userStats.applicationsReceived.toString(),
            change: userStats.applicationsReceived > 0 ? `+${userStats.applicationsReceived}` : '0',
            trend: 'up',
            color: '#2196F3',
            icon: 'users',
          },
          {
            label: 'Active Jobs',
            value: jobs.filter(job => job.is_active).length.toString(),
            change: jobs.length > 0 ? `${jobs.length} total` : '0',
            trend: 'up',
            color: theme.colors.accent.orange,
            icon: 'activity',
          },
          {
            label: 'City Jobs',
            value: jobs.length.toString(),
            change: `in ${state.userRecord?.city || 'your city'}`,
            trend: 'up',
            color: '#9C27B0',
            icon: 'map-pin',
          },
        ]
      : [
          {
            label: 'Applications Sent',
            value: userStats.applicationsSent.toString(),
            change: userStats.applicationsSent > 0 ? `+${userStats.applicationsSent}` : '0',
            trend: 'up',
            color: theme.colors.primary.cyan,
            icon: 'send',
          },
          {
            label: 'Available Jobs',
            value: jobs.length.toString(),
            change: `in ${state.userRecord?.city || 'your city'}`,
            trend: 'up',
            color: '#2196F3',
            icon: 'briefcase',
          },
          {
            label: 'New Jobs Today',
            value: jobs.filter(job => {
              const today = new Date();
              const jobDate = new Date(job.created_at);
              return jobDate.toDateString() === today.toDateString();
            }).length.toString(),
            change: 'today',
            trend: 'up',
            color: theme.colors.accent.orange,
            icon: 'calendar',
          },
          {
            label: 'Job Categories',
            value: [...new Set(jobs.map(job => job.job_categories?.name).filter(Boolean))].length.toString(),
            change: 'available',
            trend: 'up',
            color: '#9C27B0',
            icon: 'grid',
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
      color: [theme.colors.primary.cyan, theme.colors.primary.dark],
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

  const handleQuickAction = action => {
    switch (action) {
      case 'browse':
        Alert.alert('Browse Jobs', 'Job browsing feature coming soon!');
        break;
      case 'profile':
        Alert.alert('Update Profile', 'Profile editing feature coming soon!');
        break;
      case 'applications':
        try {
          if (user?.mode === 'seeker') {
            navigation.navigate('AppliedJobs');
          } else {
            navigation.navigate('MyJobs');
          }
        } catch (error) {
          Alert.alert('Navigation', 'Applications screen coming soon!');
        }
        break;
      case 'skills':
        Alert.alert(
          'Skills Assessment',
          'Skills assessment feature coming soon!',
        );
        break;
      default:
        break;
    }
  };

  const getStatusColor = status => {
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

  const getStatusLabel = status => {
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

  const handleJobPress = job => {
    navigation.navigate('JobDetails', { jobId: job.id, job });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
    >
      <LinearGradient
        colors={[theme.colors.background.primary, '#F3F6FD']}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: theme.spacing[4],
              paddingTop: theme.spacing[6],
              marginBottom: theme.spacing[4],
            }}
          >
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#F8FAFC',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
              }}
              accessibilityLabel="Back"
            >
              <Feather name="arrow-left" size={20} color="#64748B" />
            </TouchableOpacity>

            {/* Center Title & Subtext */}
            <View style={{ flex: 1, alignItems: 'center', marginLeft: -36 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: '#0F172A',
                  marginBottom: 4,
                  fontFamily: theme.typography?.fontFamily || undefined,
                }}
              >
                Search Jobs
              </Text>
            </View>

            {/* Profile Indicator Dot (right) */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 120,
                justifyContent: 'flex-end',
              }}
            >
              {/* ProfileSwitcher as profile button */}
              {/* <ProfileSwitcher style={{ marginRight: 8, height: 36 }} /> */}
              {/* Logout Button */}
              <TouchableOpacity
                onPress={logout}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#F8FAFC',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                accessibilityLabel="Logout"
              >
                <Feather name="log-out" size={20} color="#F87171" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar Section */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: theme.spacing[4],
              marginBottom: theme.spacing[4],
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#F8FAFC',
                  borderRadius: 28,
                  paddingHorizontal: 16,
                  height: 48,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Feather
                  name="search"
                  size={20}
                  color="#CBD5E1"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  placeholder="Search here…"
                  placeholderTextColor="#CBD5E1"
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: '#0F172A',
                    fontWeight: '400',
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                  }}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#E0F2FE',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 2,
                elevation: 1,
              }}
              accessibilityLabel="Filter"
            >
              <Feather name="filter" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Popular Jobs Section */}
          <View style={{ marginTop: 8, marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: theme.spacing[4],
                marginBottom: 12,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', color: '#0F172A' }}
              >
                {isLoading ? 'Loading Jobs...' : `Jobs in ${state.userRecord?.city || 'your city'}`}
              </Text>
              <TouchableOpacity onPress={handleRefresh}>
                <Text
                  style={{ fontSize: 14, color: '#94A3B8', fontWeight: '500' }}
                >
                  {isLoading ? '...' : 'Refresh'}
                </Text>
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View style={{ 
                height: 120, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginHorizontal: theme.spacing[4]
              }}>
                <Text style={{ color: '#94A3B8', fontSize: 16 }}>
                  Loading jobs...
                </Text>
              </View>
            ) : popularJobs.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: theme.spacing[4],
                  paddingRight: 12,
                }}
              >
                {popularJobs.map(job => (
                  <PopularJobCard 
                    key={job.id} 
                    job={{
                      ...job,
                      company: job.company_profiles?.company_name || 'Unknown Company',
                      salary: job.salary || 'Salary not specified',
                      location: job.city,
                      type: 'Full Time', // Default for now
                      time: new Date(job.created_at).toLocaleDateString(),
                      color: ['#3B82F6', '#2563EB'], // Default color
                      logo: 'briefcase', // Default icon
                      bookmarked: false, // TODO: Implement bookmarking
                    }} 
                    onPress={() => handleJobPress(job)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={{ 
                height: 120, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginHorizontal: theme.spacing[4]
              }}>
                <Text style={{ color: '#94A3B8', fontSize: 16 }}>
                  No jobs available in {state.userRecord?.city || 'your city'}
                </Text>
                <TouchableOpacity onPress={handleRefresh} style={{ marginTop: 8 }}>
                  <Text style={{ color: theme.colors.primary.cyan, fontSize: 14 }}>
                    Tap to refresh
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Recent Jobs Section */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: theme.spacing[4],
                marginBottom: 12,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', color: '#0F172A' }}
              >
                All Jobs
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('CreateJob')}>
                <Text
                  style={{ fontSize: 14, color: theme.colors.primary.cyan, fontWeight: '500' }}
                >
                  {user?.mode === 'poster' ? 'Post Job' : 'View All'}
                </Text>
              </TouchableOpacity>
            </View>
            {!isLoading && recentJobs.length > 0 ? (
              recentJobs.map(job => (
                <RecentJobCard
                  key={job.id}
                  item={{
                    ...job,
                    company: job.company_profiles?.company_name || 'Unknown Company',
                    salary: job.salary || 'Salary not specified',
                    location: job.city,
                    type: 'Full Time', // Default for now
                    time: new Date(job.created_at).toLocaleDateString(),
                    logo: 'briefcase', // Default icon
                    bookmarked: false, // TODO: Implement bookmarking
                  }}
                  onPress={handleJobPress}
                />
              ))
            ) : !isLoading ? (
              <View style={{ 
                height: 80, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginHorizontal: theme.spacing[4]
              }}>
                <Text style={{ color: '#94A3B8', fontSize: 14 }}>
                  No jobs to display
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default MyJobsScreen;
