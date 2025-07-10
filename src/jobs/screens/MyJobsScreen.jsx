import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
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
  const [isLoading, setIsLoading] = useState(true);
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
  }, [fadeAnim, state.user, loadInitialData]);

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
    await loadInitialData();
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
