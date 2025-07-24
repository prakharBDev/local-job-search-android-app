import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/blocks/Card';
import Button from '../../components/elements/Button';
import { AppHeader, Icon } from '../../components/elements';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  jobService,
  categoriesService,
  applicationService,
  seekerService,
} from '../../services';
import { getStyles } from './JobBrowseScreen.styles';

const JobBrowseScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user, userRecord } = useAuth();
  const styles = getStyles(theme);

  // State management
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(userRecord?.city || 'morena');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [seekerProfile, setSeekerProfile] = useState(null);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get seeker profile for applications
  useEffect(() => {
    const getSeekerProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await seekerService.getSeekerProfile(user.id);
          if (data && !error) {
            setSeekerProfile(data);
          }
        } catch (error) {
          console.error('Error fetching seeker profile:', error);
        }
      }
    };

    getSeekerProfile();
  }, [user]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
    
    // Entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Load jobs when filters change
  useEffect(() => {
    if (categories.length > 0) {
      loadJobs();
    }
  }, [searchQuery, selectedCity, selectedCategory]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await categoriesService.getAllCategories();
      if (categoriesData && !categoriesError) {
        setCategories(categoriesData);
      }

      // Load initial jobs
      await loadJobs();
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load job data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const filters = {
        city: selectedCity,
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
      };

      const { data: jobsData, error } = await jobService.getJobs(filters);
      
      if (error) {
        throw error;
      }

      setJobs(jobsData || []);
      
      // Check which jobs user has already applied to
      if (seekerProfile && jobsData) {
        await checkAppliedJobs(jobsData);
      }

    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
    }
  };

  const checkAppliedJobs = async (jobsList) => {
    if (!seekerProfile) return;

    try {
      const appliedJobIds = new Set();
      
      // Check each job for existing applications
      await Promise.all(
        jobsList.map(async (job) => {
          const { data } = await applicationService.hasApplied(job.id, seekerProfile.id);
          if (data) {
            appliedJobIds.add(job.id);
          }
        })
      );

      setAppliedJobs(appliedJobIds);
    } catch (error) {
      console.error('Error checking applied jobs:', error);
    }
  };

  const handleApplyJob = async (job) => {
    if (!seekerProfile) {
      Alert.alert(
        'Profile Required',
        'Please complete your seeker profile to apply for jobs.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Complete Profile', 
            onPress: () => navigation.navigate('ProfileSetup') 
          }
        ]
      );
      return;
    }

    try {
      const { data, error } = await applicationService.applyForJob(
        job.id,
        seekerProfile.id,
        null // Optional message - can be enhanced later
      );

      if (error) {
        throw error;
      }

      // Update applied jobs set
      setAppliedJobs(prev => new Set([...prev, job.id]));

      Alert.alert(
        'Application Sent!',
        `Your application for ${job.title} at ${job.company_profiles?.company_name} has been submitted.`,
        [{ text: 'OK', style: 'default' }]
      );

    } catch (error) {
      console.error('Error applying for job:', error);
      Alert.alert('Error', 'Failed to apply for job. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const renderJobCard = (job) => {
    const isApplied = appliedJobs.has(job.id);
    const company = job.company_profiles;
    const category = job.job_categories;

    return (
      <Card key={job.id} style={styles.jobCard}>
        <TouchableOpacity
          onPress={() => navigation.navigate('JobDetails', { jobData: job })}
          activeOpacity={0.7}
        >
          {/* Company Header */}
          <View style={styles.companyHeader}>
            <View style={styles.companyIcon}>
              <Feather name="briefcase" size={20} color="#3B82F6" />
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>
                {company?.company_name || 'Company'}
              </Text>
              {company?.is_verified && (
                <View style={styles.verifiedBadge}>
                  <Feather name="check-circle" size={12} color="#10B981" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>

          {/* Job Details */}
          <Text style={styles.jobTitle}>{job.title}</Text>
          
          {/* Job Meta */}
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{job.city}</Text>
            </View>
            {category && (
              <View style={styles.metaItem}>
                <Feather name="tag" size={14} color="#6B7280" />
                <Text style={styles.metaText}>{category.name}</Text>
              </View>
            )}
            {job.salary && (
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>₹{job.salary}</Text>
              </View>
            )}
          </View>

          {/* Job Description Preview */}
          <Text style={styles.jobDescription} numberOfLines={2}>
            {job.description}
          </Text>

          {/* Skills Tags */}
          {job.job_skills && job.job_skills.length > 0 && (
            <View style={styles.skillsContainer}>
              {job.job_skills.slice(0, 3).map((jobSkill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>
                    {jobSkill.skills?.name}
                  </Text>
                </View>
              ))}
              {job.job_skills.length > 3 && (
                <View style={styles.skillTag}>
                  <Text style={styles.skillText}>
                    +{job.job_skills.length - 3} more
                  </Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Apply Button */}
        <View style={styles.applySection}>
          <Button
            variant={isApplied ? "outline" : "default"}
            size="sm"
            onPress={() => handleApplyJob(job)}
            disabled={isApplied}
            style={styles.applyButton}
          >
            <View style={styles.buttonContent}>
              <Feather 
                name={isApplied ? "check" : "send"} 
                size={16} 
                color={isApplied ? "#6B7280" : "#FFFFFF"} 
              />
              <Text style={[
                styles.applyButtonText,
                isApplied && styles.appliedButtonText
              ]}>
                {isApplied ? "Applied" : "Apply Now"}
              </Text>
            </View>
          </Button>
        </View>
      </Card>
    );
  };

  const renderFilterPill = (label, value, onPress, isSelected) => (
    <TouchableOpacity
      key={value}
      style={[styles.filterPill, isSelected && styles.filterPillSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterPillText,
        isSelected && styles.filterPillTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading && jobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* App Header */}
        <AppHeader
          title="Find Jobs"
          subtitle={`Discover opportunities in ${selectedCity}`}
          rightIcon={<Icon name="filter" size={20} color="#3B82F6" />}
          background="#F7F9FC"
        />

        {/* Search and Filters */}
        <View style={styles.searchSection}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Feather name="x" size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            {/* City Filter */}
            {renderFilterPill(
              'Morena',
              'morena',
              () => setSelectedCity('morena'),
              selectedCity === 'morena'
            )}
            {renderFilterPill(
              'Gwalior',
              'gwalior',
              () => setSelectedCity('gwalior'),
              selectedCity === 'gwalior'
            )}

            {/* Category Filters */}
            {renderFilterPill(
              'All Categories',
              '',
              () => setSelectedCategory(''),
              selectedCategory === ''
            )}
            {categories.map(category => renderFilterPill(
              category.name,
              category.id,
              () => setSelectedCategory(category.id),
              selectedCategory === category.id
            ))}
          </ScrollView>
        </View>

        {/* Jobs List */}
        <ScrollView
          style={styles.jobsList}
          contentContainerStyle={styles.jobsListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {jobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="briefcase" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No Jobs Found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search criteria or check back later for new opportunities.
              </Text>
            </View>
          ) : (
            jobs.map(renderJobCard)
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default JobBrowseScreen;