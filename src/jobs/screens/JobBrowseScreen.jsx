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
import { AppHeader, Icon } from '../../components/elements';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  jobService,
  categoriesService,
  applicationService,
  seekerService,
  companyService,
} from '../../services';
import { getStyles } from './JobBrowseScreen.styles';
import PopularJobCard from './MyJobsScreen/PopularJobCard';

const JobBrowseScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user, userRecord, userRoles } = useAuth();
  const styles = getStyles(theme);

  // State management
  const [jobs, setJobs] = useState([]);
  const [popularJobs, setPopularJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(
    userRecord?.city || 'morena',
  );
  const [selectedCategory, setSelectedCategory] = useState('');
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [seekerProfile, setSeekerProfile] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Determine if user is a company/poster
  const isCompany = userRoles?.isCompany || userRoles?.isPoster || false;

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get profile (seeker or company) based on user type
  useEffect(() => {
    const getProfile = async () => {
      if (user?.id) {
        try {
          if (isCompany) {
            // Get company profile
            const { data, error } = await companyService.getCompanyProfile(user.id);
            if (data && !error) {
              setCompanyProfile(data);
            }
          } else {
            // Get seeker profile
            const { data, error } = await seekerService.getSeekerProfile(user.id);
            if (data && !error) {
              setSeekerProfile(data);
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    getProfile();
  }, [user, isCompany]);

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

  // Load jobs when filters change or company profile is available
  useEffect(() => {
    if (categories.length > 0) {
      // For company users, wait until company profile is loaded
      if (isCompany && !companyProfile?.id) {
        return;
      }
      loadJobs();
    }
  }, [searchQuery, selectedCity, selectedCategory, isCompany, companyProfile?.id]);

  const loadPopularJobs = async () => {
    try {
      // Load recent jobs as popular jobs (limit to 3)
      const { data: popularJobsData, error: popularJobsError } =
        await jobService.getJobs(
          {}, // no filters
          { limit: 3, orderBy: { column: 'created_at', ascending: false } },
        );

      if (popularJobsData && !popularJobsError) {
        setPopularJobs(popularJobsData);

        // Check which popular jobs user has already applied to
        if (seekerProfile && popularJobsData) {
          await checkAppliedJobs(popularJobsData);
        }
      }
    } catch (error) {
      console.error('Error loading popular jobs:', error);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load categories
      const { data: categoriesData, error: categoriesError } =
        await categoriesService.getAllCategories();
      if (categoriesData && !categoriesError) {
        setCategories(categoriesData);
      }

      // Load popular jobs
      await loadPopularJobs();

      // Load initial jobs
      await loadJobs();
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load job data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load jobs for seekers (all available jobs)
  const loadJobsForSeekers = async () => {
    try {
      const filters = {
        city: selectedCity,
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(searchQuery.trim() && { search: searchQuery.trim() }),
      };

      // Load jobs with filters
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
      console.error('Error loading jobs for seekers:', error);
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
    }
  };

  // Load jobs for company (only their own jobs)
  const loadJobsForCompany = async () => {
    try {
      if (!companyProfile?.id) {
        setJobs([]);
        return;
      }

      // Use the dedicated service method for company jobs
      const { data: jobsData, error } = await jobService.getJobsByCompany(companyProfile.id, {
        includeApplications: true, // Include application count for company view
        includeCategory: true,
        limit: 50
      });

      if (error) {
        throw error;
      }

      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error loading company jobs:', error);
      Alert.alert('Error', 'Failed to load your jobs. Please try again.');
    }
  };

  // Main load function that delegates to appropriate method
  const loadJobs = async () => {
    if (isCompany) {
      await loadJobsForCompany();
    } else {
      await loadJobsForSeekers();
    }
  };

  const checkAppliedJobs = async jobsList => {
    if (!seekerProfile) {
      return;
    }

    try {
      const currentAppliedJobs = new Set(appliedJobs); // Keep existing applied jobs

      // Check each job for existing applications
      await Promise.all(
        jobsList.map(async job => {
          const { data } = await applicationService.hasApplied(
            seekerProfile.id,
            job.id,
          );
          if (data) {
            currentAppliedJobs.add(job.id);
          }
        }),
      );

      setAppliedJobs(currentAppliedJobs);
    } catch (error) {
      console.error('Error checking applied jobs:', error);
    }
  };

  const handleApplyJob = async job => {
    if (!seekerProfile) {
      Alert.alert(
        'Profile Required',
        'Please complete your seeker profile to apply for jobs.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Complete Profile',
            onPress: () => navigation.navigate('SeekerProfileSetup'),
          },
        ],
      );
      return;
    }

    try {
      const { error } = await applicationService.applyForJob({
        job_id: job.id,
        seeker_id: seekerProfile.id,
        message: '', // Optional message - can be enhanced later
      });

      if (error) {
        throw error;
      }

      // Update applied jobs set
      setAppliedJobs(prev => new Set([...prev, job.id]));

      Alert.alert(
        'Application Sent!',
        `Your application for ${job.title} at ${job.company_profiles?.company_name} has been submitted.`,
        [{ text: 'OK', style: 'default' }],
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

  // Helper function to format salary - show database value directly
  const formatSalary = salary => {
    if (!salary) {
      return 'Salary not specified';
    }

    // If salary already has ₹ symbol, return as is
    if (salary.includes('₹')) {
      return salary;
    }

    // Add ₹ symbol to the database value
    return `₹${salary}`;
  };

  const renderJobCard = job => {
    const isApplied = appliedJobs.has(job.id);
    const company = job.company_profiles;
    const category = job.job_categories;

    return (
      <Card key={job.id} style={styles.jobCard}>
        <TouchableOpacity
          onPress={() => {
            // Navigate to swipeable job details with full job list
            const currentIndex = jobs.findIndex(j => j.id === job.id);
            navigation.navigate('JobsSwipeableJobDetails', {
              jobData: job,
              jobList: jobs,
              currentIndex: currentIndex >= 0 ? currentIndex : 0,
            });
          }}
          activeOpacity={0.7}
        >
          {/* Company Header */}
          <View style={styles.companyHeader}>
            <View style={styles.companyIcon}>
              <Feather
                name="briefcase"
                size={20}
                color={theme.colors.primary.main}
              />
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
                <Text style={styles.metaText}>{formatSalary(job.salary)}</Text>
              </View>
            )}
          </View>

          {/* Job Description Preview */}
          <Text style={styles.jobDescription} numberOfLines={3}>
            {job.description || 'No description available'}
          </Text>

          {/* Action Buttons - Different for company vs seeker */}
          <View style={styles.cardActions}>
            {!isCompany && (
              <>
                {isApplied ? (
                  <View style={styles.appliedBadge}>
                    <Feather name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.appliedText}>Applied</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={e => {
                      e.stopPropagation();
                      handleApplyJob(job);
                    }}
                  >
                    <Text style={styles.applyButtonText}>Apply Now</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {isCompany ? (
              // Company actions - Edit/Manage job
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: '#10B981' }]}
                onPress={e => {
                  e.stopPropagation();
                  // Navigate to edit job or job management
                  navigation.navigate('CreateJob', { jobData: job, isEdit: true });
                }}
              >
                <Text style={styles.applyButtonText}>Edit Job</Text>
              </TouchableOpacity>
            ) : (
              // Seeker actions - Save job
              <TouchableOpacity
                style={styles.saveButton}
                onPress={e => {
                  e.stopPropagation();
                  // TODO: Implement save job functionality
                }}
              >
                <Feather
                  name={job.bookmarked ? 'bookmark' : 'bookmark'}
                  size={16}
                  color={job.bookmarked ? '#6174f9' : '#6B7280'}
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
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
      <Text
        style={[
          styles.filterPillText,
          isSelected && styles.filterPillTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading && jobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
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
          title={isCompany ? "My Jobs" : "Find Jobs"}
          subtitle={isCompany 
            ? `Manage your company's job postings` 
            : `Discover opportunities in ${selectedCity}`
          }
          rightIcon={
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <Icon name="filter" size={20} color={theme.colors.primary.main} />
            </TouchableOpacity>
          }
          background="#F7F9FC"
          centered={true}
        />

        {/* Filter Pills */}
        <View style={styles.filtersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          />
        </View>

        {/* Jobs List */}
        <ScrollView
          style={styles.jobsList}
          contentContainerStyle={styles.jobsListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary.main]}
              tintColor={theme.colors.primary.main}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Popular Jobs Section */}
          <View style={styles.popularJobsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Jobs</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularJobsContainer}
            >
              {popularJobs.map((job, index) => (
                <PopularJobCard
                  key={job.id}
                  job={job}
                  index={index}
                  isApplied={appliedJobs.has(job.id)}
                />
              ))}
            </ScrollView>
          </View>

          {jobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="briefcase" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>
                {isCompany ? "No Jobs Posted" : "No Jobs Found"}
              </Text>
              <Text style={styles.emptyStateText}>
                {isCompany 
                  ? "You haven't posted any jobs yet. Create your first job posting to get started."
                  : "Try adjusting your search criteria or check back later for new opportunities."
                }
              </Text>
            </View>
          ) : (
            jobs.map(renderJobCard)
          )}
        </ScrollView>

        {/* Filter Modal */}
        {showFilterModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filters</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Feather name="x" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Search Section */}
              <View style={styles.modalSearchSection}>
                <Text style={styles.modalSectionTitle}>Search</Text>
                <View style={styles.modalSearchContainer}>
                  <Feather name="search" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.modalSearchInput}
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9CA3AF"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Feather name="x" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* City Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>City</Text>
                <View style={styles.modalOptions}>
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      selectedCity === 'morena' && styles.modalOptionSelected,
                    ]}
                    onPress={() => setSelectedCity('morena')}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedCity === 'morena' &&
                          styles.modalOptionTextSelected,
                      ]}
                    >
                      Morena
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      selectedCity === 'gwalior' && styles.modalOptionSelected,
                    ]}
                    onPress={() => setSelectedCity('gwalior')}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedCity === 'gwalior' &&
                          styles.modalOptionTextSelected,
                      ]}
                    >
                      Gwalior
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Category Section */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Category</Text>
                <View style={styles.modalOptions}>
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      selectedCategory === '' && styles.modalOptionSelected,
                    ]}
                    onPress={() => setSelectedCategory('')}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selectedCategory === '' &&
                          styles.modalOptionTextSelected,
                      ]}
                    >
                      All Categories
                    </Text>
                  </TouchableOpacity>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.modalOption,
                        selectedCategory === category.id &&
                          styles.modalOptionSelected,
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selectedCategory === category.id &&
                            styles.modalOptionTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalClearButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCity(userRecord?.city || 'morena');
                    setSelectedCategory('');
                  }}
                >
                  <Text style={styles.modalClearButtonText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalApplyButton}
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text style={styles.modalApplyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

export default JobBrowseScreen;
