import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import PopularJobCard from './MyJobsScreen/PopularJobCard';
import RecentJobCard from './MyJobsScreen/RecentJobCard';
import { getStyles } from './MyJobsScreen.styles';
import { popularJobs as mockPopularJobs, recentJobs as mockRecentJobs } from './MyJobsScreen/mockData';
import { AppHeader, Icon } from '../../components/elements';

const MyJobsScreen = () => {
  const { logout, userRoles } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [popularJobs, setPopularJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    // Load mock data for now - in production this would be an API call
    const loadJobs = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setPopularJobs(mockPopularJobs);
        setRecentJobs(mockRecentJobs);
        setError(null);
      } catch (err) {
        console.error('Error loading jobs:', err);
        setError('Failed to load jobs');
        // Set empty arrays as fallback
        setPopularJobs([]);
        setRecentJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Handle logout with confirmation and error handling
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
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
                [{ text: 'OK' }]
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  // Filter jobs based on search term
  const filteredPopularJobs = popularJobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRecentJobs = recentJobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView style={getStyles(theme).container}>
        <View style={[getStyles(theme).scrollView, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={getStyles(theme).headerTitle}>Loading jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={getStyles(theme).container}>
      <ScrollView
        style={getStyles(theme).scrollView}
        contentContainerStyle={getStyles(theme).scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <AppHeader
            title={userRoles?.isCompany ? "My Job Postings" : "My Applications"}
            subtitle={userRoles?.isCompany ? "Manage your job postings" : "Track your job applications"}
            leftIcon={<Icon name="arrow-left" size={20} color="#1E293B" />}
            rightIcon={<Icon name="log-out" size={20} color="#EF4444" />}
            onLeftPress={() => navigation.goBack()}
            onRightPress={handleLogout}
            background="#F7F9FC"
          />
        </Animated.View>

        {/* Search Bar Section */}
        <Animated.View
          style={[getStyles(theme).searchContainer, { opacity: fadeAnim }]}
        >
          <View style={getStyles(theme).searchInputContainer}>
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search jobs, companies, or skills..."
              placeholderTextColor="#9CA3AF"
              style={getStyles(theme).searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity
            style={getStyles(theme).filterButton}
            accessibilityLabel="Filter jobs"
          >
            <Feather name="filter" size={20} color="#6475f8" />
          </TouchableOpacity>
        </Animated.View>

        {/* Error Message */}
        {error && (
          <Animated.View
            style={[getStyles(theme).errorContainer, { opacity: fadeAnim }]}
          >
            <Text style={getStyles(theme).errorText}>{error}</Text>
          </Animated.View>
        )}

        {/* Popular Jobs Section */}
        {filteredPopularJobs.length > 0 && (
          <Animated.View
            style={[getStyles(theme).popularJobsContainer, { opacity: fadeAnim }]}
          >
            <View style={getStyles(theme).sectionHeader}>
              <Text style={getStyles(theme).sectionTitle}>
                {userRoles?.isCompany ? "Active Job Postings" : "Recent Applications"}
              </Text>
              <TouchableOpacity>
                <Text style={getStyles(theme).seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={getStyles(theme).popularJobsScroll}
            >
              {filteredPopularJobs.map((job, index) => (
                <PopularJobCard key={job.id} job={job} index={index} />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Recent Jobs */}
        {filteredRecentJobs.length > 0 && (
          <View style={getStyles(theme).recentJobsContainer}>
            <View style={getStyles(theme).sectionHeader}>
              <Text style={getStyles(theme).sectionTitle}>
                {userRoles?.isCompany ? "Draft Job Postings" : "Saved Jobs"}
              </Text>
              <TouchableOpacity>
                <Text style={getStyles(theme).seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={getStyles(theme).recentJobsList}>
              {filteredRecentJobs.map((job, index) => (
                <RecentJobCard key={job.id} item={job} index={index} />
              ))}
            </View>
          </View>
        )}

        {/* No Results Message */}
        {!loading && !error && filteredPopularJobs.length === 0 && filteredRecentJobs.length === 0 && (
          <Animated.View
            style={[getStyles(theme).noResultsContainer, { opacity: fadeAnim }]}
          >
            <Feather name="search" size={48} color="#9CA3AF" />
            <Text style={getStyles(theme).noResultsText}>
              No jobs found matching "{search}"
            </Text>
            <Text style={getStyles(theme).noResultsSubtext}>
              Try adjusting your search terms
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyJobsScreen;
