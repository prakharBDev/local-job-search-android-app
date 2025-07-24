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
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import PopularJobCard from './MyJobsScreen/PopularJobCard';
import RecentJobCard from './MyJobsScreen/RecentJobCard';
import { getStyles } from './MyJobsScreen.styles';
import {
  popularJobs as mockPopularJobs,
  recentJobs as mockRecentJobs,
} from './MyJobsScreen/mockData';
import {
  AppHeader,
  Icon,
  Card,
  Badge,
  Button,
} from '../../components/elements';
import JobCard from '../../components/blocks/JobCard';
import seekerService from '../../services/seeker.service';
import applicationService from '../../services/application.service';
import { apiClient } from '../../services/api/client';

const MyJobsScreen = () => {
  const { logout, userRoles, user } = useAuth();
  const navigation = useNavigation();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [popularJobs, setPopularJobs] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    applied: 0,
    under_review: 0,
    hired: 0,
    rejected: 0,
    total: 0,
  });
  const [seekerProfile, setSeekerProfile] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    // Load data based on user role
    const loadData = async () => {
      try {
        setLoading(true);

        if (userRoles?.isCompany) {
          // Load mock data for companies
          await new Promise(resolve => setTimeout(resolve, 500));
          setPopularJobs(mockPopularJobs);
          setRecentJobs(mockRecentJobs);
        } else {
          // Load real application data for seekers
          if (user?.id) {
            const { data: profile, error: profileError } =
              await seekerService.getSeekerProfile(user.id);

            if (profileError) {
              console.error('Error loading seeker profile:', profileError);
              return;
            }

            setSeekerProfile(profile);

            if (profile) {
              // Clear cache to ensure fresh data
              apiClient.clearCache(`applications_seeker_${profile.id}`);

              // Load applications and stats in parallel
              const [applicationsResult, statsResult] = await Promise.all([
                applicationService.getSeekerApplications(profile.id),
                applicationService.getSeekerApplicationStats(profile.id),
              ]);

              const { data: userApplications, error: applicationsError } =
                applicationsResult;
              const { data: userStats, error: statsError } = statsResult;

              if (applicationsError) {
                console.error('Error loading applications:', applicationsError);
                return;
              }

              if (statsError) {
                console.error('Error loading stats:', statsError);
              }

              setApplications(userApplications || []);
              setStats(
                userStats || {
                  applied: 0,
                  under_review: 0,
                  hired: 0,
                  rejected: 0,
                  total: 0,
                },
              );
            }
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
        setPopularJobs([]);
        setRecentJobs([]);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    // Wait for user roles to be loaded
    if (user && userRoles && userRoles.length > 0) {
      loadData();
    }
  }, [user, userRoles]);

  // Handle logout with confirmation and error handling
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

  // Filter jobs (no search functionality for this screen)
  const filteredPopularJobs = popularJobs;
  const filteredRecentJobs = recentJobs;

  // Helper functions for application display
  const getStatusBadgeColor = status => {
    switch (status) {
      case 'applied':
        return theme.colors.primary.main;
      case 'under_review':
        return theme.colors.status.warning;
      case 'hired':
        return theme.colors.status.success;
      case 'rejected':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'under_review':
        return 'Under Review';
      case 'hired':
        return 'Hired!';
      case 'rejected':
        return 'Not Selected';
      default:
        return 'Unknown';
    }
  };

  const getStatusMessage = status => {
    switch (status) {
      case 'hired':
        return 'Congratulations! You got the job!';
      case 'under_review':
        return 'Your application is being reviewed';
      case 'applied':
        return 'Application submitted successfully';
      case 'rejected':
        return 'Keep applying to other opportunities';
      default:
        return 'Application status updated';
    }
  };

  const getFilteredApplications = () => {
    if (filterStatus === 'all') {
      return applications;
    }
    return applications.filter(app => app.status === filterStatus);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleViewJob = job => {
    navigation.navigate('JobsSwipeableJobDetails', { jobData: job });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user?.id && seekerProfile) {
        // Clear cache and reload data
        apiClient.clearCache(`applications_seeker_${seekerProfile.id}`);

        const [applicationsResult, statsResult] = await Promise.all([
          applicationService.getSeekerApplications(seekerProfile.id),
          applicationService.getSeekerApplicationStats(seekerProfile.id),
        ]);

        const { data: userApplications, error: applicationsError } =
          applicationsResult;
        const { data: userStats, error: statsError } = statsResult;

        if (!applicationsError) {
          setApplications(userApplications || []);
        }

        if (!statsError) {
          setStats(
            userStats || {
              applied: 0,
              under_review: 0,
              hired: 0,
              rejected: 0,
              total: 0,
            },
          );
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderApplicationCard = application => {
    const job = application.jobs;

    return (
      <JobCard
        key={application.id}
        job={job}
        isApplied={true}
        showApplyButton={false}
        onViewPress={() => handleViewJob(job)}
        style={getStyles(theme).applicationCard}
      />
    );
  };

  const renderEmptyState = () => {
    if (!seekerProfile) {
      return (
        <View style={getStyles(theme).emptyState}>
          <Icon name="user" size={64} color={theme.colors.text.secondary} />
          <Text
            style={[
              getStyles(theme).emptyTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Profile Setup Required
          </Text>
          <Text
            style={[
              getStyles(theme).emptyDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            Please complete your seeker profile to view applications
          </Text>
          <Button
            title="Complete Profile"
            onPress={() => navigation.navigate('SeekerProfileSetup')}
            style={getStyles(theme).emptyButton}
            textStyle={getStyles(theme).emptyButtonText}
          />
        </View>
      );
    }

    return (
      <View style={getStyles(theme).emptyState}>
        <Icon name="file-text" size={64} color={theme.colors.text.secondary} />
        <Text
          style={[
            getStyles(theme).emptyTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          No Applications Yet
        </Text>
        <Text
          style={[
            getStyles(theme).emptyDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          Start applying to jobs to see your applications here
        </Text>
        <Button
          title="Find Jobs"
          onPress={() => navigation.navigate('Jobs')}
          style={getStyles(theme).emptyButton}
          textStyle={getStyles(theme).emptyButtonText}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={getStyles(theme).container}>
        <View
          style={[
            getStyles(theme).scrollView,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* App Header */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <AppHeader
            title={userRoles?.isCompany ? 'My Job Postings' : 'My Applications'}
            subtitle={
              userRoles?.isCompany
                ? 'Manage your job postings'
                : 'Track your job applications'
            }
            leftIcon={<Icon name="arrow-left" size={20} color="#1E293B" />}
            rightIcon={
              !userRoles?.isCompany ? (
                <TouchableOpacity onPress={() => setShowFilterModal(true)}>
                  <Icon
                    name="filter"
                    size={20}
                    color={theme.colors.primary.main}
                  />
                </TouchableOpacity>
              ) : (
                <Icon name="log-out" size={20} color="#EF4444" />
              )
            }
            onLeftPress={() => navigation.goBack()}
            onRightPress={!userRoles?.isCompany ? undefined : handleLogout}
            background="#F7F9FC"
            centered={true}
          />
        </Animated.View>

        {/* Error Message */}
        {error && (
          <Animated.View
            style={[getStyles(theme).errorContainer, { opacity: fadeAnim }]}
          >
            <Text style={getStyles(theme).errorText}>{error}</Text>
          </Animated.View>
        )}

        {/* Company View - Job Postings */}
        {userRoles?.isCompany && (
          <>
            {/* Active Job Postings Section */}
            {filteredPopularJobs.length > 0 && (
              <Animated.View
                style={[
                  getStyles(theme).popularJobsContainer,
                  { opacity: fadeAnim },
                ]}
              >
                <View style={getStyles(theme).sectionHeader}>
                  <Text style={getStyles(theme).sectionTitle}>
                    Active Job Postings
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

            {/* Draft Job Postings Section */}
            {filteredRecentJobs.length > 0 && (
              <View style={getStyles(theme).recentJobsContainer}>
                <View style={getStyles(theme).sectionHeader}>
                  <Text style={getStyles(theme).sectionTitle}>
                    Draft Job Postings
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
          </>
        )}

        {/* Seeker View - Applications */}
        {!userRoles?.isCompany && (
          <>
            {/* Recent Applications Section */}
            <Animated.View
              style={[
                getStyles(theme).popularJobsContainer,
                { opacity: fadeAnim },
              ]}
            >
              <View style={getStyles(theme).sectionHeader}>
                <Text style={getStyles(theme).sectionTitle}>
                  Recent Applications
                </Text>
              </View>

              {/* Quick Stats Cards */}
              <View style={getStyles(theme).statsContainer}>
                <View style={getStyles(theme).statCard}>
                  <View style={getStyles(theme).statIcon}>
                    <Feather
                      name="send"
                      size={24}
                      color={theme.colors.primary.main}
                    />
                  </View>
                  <Text style={getStyles(theme).statNumber}>
                    {stats.applied || 0}
                  </Text>
                  <Text style={getStyles(theme).statLabel}>Applied</Text>
                </View>

                <View style={getStyles(theme).statCard}>
                  <View style={getStyles(theme).statIcon}>
                    <Feather
                      name="eye"
                      size={24}
                      color={theme.colors.status.warning}
                    />
                  </View>
                  <Text style={getStyles(theme).statNumber}>
                    {stats.under_review || 0}
                  </Text>
                  <Text style={getStyles(theme).statLabel}>Under Review</Text>
                </View>

                <View style={getStyles(theme).statCard}>
                  <View style={getStyles(theme).statIcon}>
                    <Feather
                      name="check-circle"
                      size={24}
                      color={theme.colors.status.success}
                    />
                  </View>
                  <Text style={getStyles(theme).statNumber}>
                    {stats.hired || 0}
                  </Text>
                  <Text style={getStyles(theme).statLabel}>Hired</Text>
                </View>
              </View>
            </Animated.View>

            {/* Detailed Applications Section */}
            {applications.length > 0 && (
              <View style={getStyles(theme).recentJobsContainer}>
                <View style={getStyles(theme).sectionHeader}>
                  <Text style={getStyles(theme).sectionTitle}>
                    Your Applications
                  </Text>
                  <Text style={getStyles(theme).sectionSubtitle}>
                    {getFilteredApplications().length} of {applications.length}{' '}
                    applications
                  </Text>
                </View>

                <View style={getStyles(theme).filterSection}>
                  <Text
                    style={[
                      getStyles(theme).filterLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Filter by status:
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={getStyles(theme).filterButtons}>
                      <TouchableOpacity
                        style={[
                          getStyles(theme).filterButton,
                          filterStatus === 'all' && {
                            backgroundColor: theme.colors.primary.main,
                          },
                        ]}
                        onPress={() => setFilterStatus('all')}
                      >
                        <Text
                          style={[
                            getStyles(theme).filterButtonText,
                            {
                              color:
                                filterStatus === 'all'
                                  ? theme.colors.text.white
                                  : theme.colors.text.primary,
                            },
                          ]}
                        >
                          All ({applications.length})
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          getStyles(theme).filterButton,
                          filterStatus === 'applied' && {
                            backgroundColor: theme.colors.primary.main,
                          },
                        ]}
                        onPress={() => setFilterStatus('applied')}
                      >
                        <Text
                          style={[
                            getStyles(theme).filterButtonText,
                            {
                              color:
                                filterStatus === 'applied'
                                  ? theme.colors.text.white
                                  : theme.colors.text.primary,
                            },
                          ]}
                        >
                          Applied (
                          {
                            applications.filter(app => app.status === 'applied')
                              .length
                          }
                          )
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          getStyles(theme).filterButton,
                          filterStatus === 'under_review' && {
                            backgroundColor: theme.colors.primary.main,
                          },
                        ]}
                        onPress={() => setFilterStatus('under_review')}
                      >
                        <Text
                          style={[
                            getStyles(theme).filterButtonText,
                            {
                              color:
                                filterStatus === 'under_review'
                                  ? theme.colors.text.white
                                  : theme.colors.text.primary,
                            },
                          ]}
                        >
                          Under Review (
                          {
                            applications.filter(
                              app => app.status === 'under_review',
                            ).length
                          }
                          )
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          getStyles(theme).filterButton,
                          filterStatus === 'hired' && {
                            backgroundColor: theme.colors.primary.main,
                          },
                        ]}
                        onPress={() => setFilterStatus('hired')}
                      >
                        <Text
                          style={[
                            getStyles(theme).filterButtonText,
                            {
                              color:
                                filterStatus === 'hired'
                                  ? theme.colors.text.white
                                  : theme.colors.text.primary,
                            },
                          ]}
                        >
                          Hired (
                          {
                            applications.filter(app => app.status === 'hired')
                              .length
                          }
                          )
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>

                <View style={getStyles(theme).applicationsList}>
                  {getFilteredApplications().map(application =>
                    renderApplicationCard(application),
                  )}
                </View>
              </View>
            )}

            {/* Empty State */}
            {applications.length === 0 && !loading && renderEmptyState()}
          </>
        )}

        {/* No Results Message */}
        {!loading &&
          !error &&
          ((userRoles?.isCompany &&
            filteredPopularJobs.length === 0 &&
            filteredRecentJobs.length === 0) ||
            (!userRoles?.isCompany && applications.length === 0)) && (
            <Animated.View
              style={[
                getStyles(theme).noResultsContainer,
                { opacity: fadeAnim },
              ]}
            >
              <Feather name="search" size={48} color="#9CA3AF" />
              <Text style={getStyles(theme).noResultsText}>
                {userRoles?.isCompany
                  ? 'No job postings found'
                  : 'No applications found'}
              </Text>
              <Text style={getStyles(theme).noResultsSubtext}>
                {userRoles?.isCompany
                  ? 'Try creating a new job posting'
                  : 'Start applying to jobs to see them here'}
              </Text>
              {!userRoles?.isCompany && (
                <TouchableOpacity
                  style={getStyles(theme).browseButton}
                  onPress={() => navigation.navigate('Jobs')}
                >
                  <Text style={getStyles(theme).browseButtonText}>
                    Browse Jobs
                  </Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}

        {/* Filter Modal */}
        {showFilterModal && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 20,
                margin: 20,
                width: '90%',
                maxHeight: '80%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: theme.colors.text.primary,
                  }}
                >
                  Filter Applications
                </Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Feather
                    name="x"
                    size={24}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.colors.text.primary,
                    marginBottom: 12,
                  }}
                >
                  Application Status
                </Text>
                <View style={{ gap: 10 }}>
                  {[
                    {
                      label: 'All Applications',
                      value: 'all',
                      count: applications.length,
                    },
                    {
                      label: 'Applied',
                      value: 'applied',
                      count: applications.filter(
                        app => app.status === 'applied',
                      ).length,
                    },
                    {
                      label: 'Under Review',
                      value: 'under_review',
                      count: applications.filter(
                        app => app.status === 'under_review',
                      ).length,
                    },
                    {
                      label: 'Hired',
                      value: 'hired',
                      count: applications.filter(app => app.status === 'hired')
                        .length,
                    },
                  ].map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        backgroundColor:
                          filterStatus === option.value
                            ? theme.colors.primary.light
                            : theme.colors.background.secondary,
                        borderRadius: 8,
                      }}
                      onPress={() => {
                        setFilterStatus(option.value);
                        setShowFilterModal(false);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color:
                            filterStatus === option.value
                              ? theme.colors.text.white
                              : theme.colors.text.primary,
                        }}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color:
                            filterStatus === option.value
                              ? theme.colors.text.white
                              : theme.colors.text.secondary,
                        }}
                      >
                        {option.count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyJobsScreen;
