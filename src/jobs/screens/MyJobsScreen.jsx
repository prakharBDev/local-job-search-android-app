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
import { popularJobs, recentJobs } from './MyJobsScreen/mockData.js';

const MyJobsScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const { theme } = useTheme();
  // Remove Modal import and profileModalVisible state

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const stats =
    user?.mode === 'poster'
      ? [
          {
            label: 'Jobs Posted',
            value: '12',
            change: '+3',
            trend: 'up',
            color: theme.colors.primary.cyan,
            icon: 'briefcase',
          },
          {
            label: 'Applications Received',
            value: '89',
            change: '+25%',
            trend: 'up',
            color: '#2196F3',
            icon: 'users',
          },
          {
            label: 'Interviews Conducted',
            value: '7',
            change: '+2',
            trend: 'up',
            color: theme.colors.accent.orange,
            icon: 'video',
          },
          {
            label: 'Hired Candidates',
            value: '3',
            change: '+1',
            trend: 'up',
            color: '#9C27B0',
            icon: 'user-check',
          },
        ]
      : [
          {
            label: 'Applications Sent',
            value: '24',
            change: '+12%',
            trend: 'up',
            color: theme.colors.primary.cyan,
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

  const handleJobPress = (job) => {
    navigation.navigate('JobDetails', { job });
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
                Popular jobs
              </Text>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 14, color: '#94A3B8', fontWeight: '500' }}
                >
                  See all
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: theme.spacing[4],
                paddingRight: 12,
              }}
            >
              {popularJobs.map(job => (
                <PopularJobCard key={job.id} job={job} />
              ))}
            </ScrollView>
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
                Recent jobs
              </Text>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 14, color: '#94A3B8', fontWeight: '500' }}
                >
                  See all
                </Text>
              </TouchableOpacity>
            </View>
            {recentJobs.map(item => (
              <RecentJobCard key={item.id} item={item} onPress={handleJobPress} />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default MyJobsScreen;
