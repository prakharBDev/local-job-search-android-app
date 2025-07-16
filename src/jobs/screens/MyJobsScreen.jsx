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
import { useTheme } from '../../contexts/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import PopularJobCard from './MyJobsScreen/PopularJobCard';
import RecentJobCard from './MyJobsScreen/RecentJobCard';
import { getStyles } from './MyJobsScreen.styles';

const MyJobsScreen = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const { theme } = useTheme();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={getStyles(theme).container}>
      <ScrollView
        style={getStyles(theme).scrollView}
        contentContainerStyle={getStyles(theme).scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View
          style={[getStyles(theme).headerContainer, { opacity: fadeAnim }]}
        >
          <View style={getStyles(theme).headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={getStyles(theme).backButton}
              accessibilityLabel="Go back"
            >
              <Feather name="arrow-left" size={20} color="#1E293B" />
            </TouchableOpacity>

            <View style={getStyles(theme).headerTitleContainer}>
              <Text style={getStyles(theme).headerTitle}>Search Jobs</Text>
              <Text style={getStyles(theme).headerSubtitle}>
                Find your next opportunity
              </Text>
            </View>

            <TouchableOpacity
              onPress={logout}
              style={getStyles(theme).logoutButton}
              accessibilityLabel="Logout"
            >
              <Feather name="log-out" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
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
            <Feather name="filter" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </Animated.View>

        {/* Popular Jobs Section */}
        <Animated.View
          style={[getStyles(theme).popularJobsContainer, { opacity: fadeAnim }]}
        >
          <View style={getStyles(theme).sectionHeader}>
            <Text style={getStyles(theme).sectionTitle}>Popular Jobs</Text>
            <TouchableOpacity>
              <Text style={getStyles(theme).seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={getStyles(theme).popularJobsScroll}
          >
            {popularJobs.map(job => (
              <PopularJobCard key={job.id} job={job} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recent Jobs */}
        <View style={getStyles(theme).recentJobsContainer}>
          <View style={getStyles(theme).sectionHeader}>
            <Text style={getStyles(theme).sectionTitle}>Recent Jobs</Text>
            <TouchableOpacity>
              <Text style={getStyles(theme).seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={getStyles(theme).recentJobsList}>
            {recentJobs.map(job => (
              <RecentJobCard key={job.id} item={job} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyJobsScreen;
