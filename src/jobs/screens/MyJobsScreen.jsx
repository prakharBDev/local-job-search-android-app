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
import { getStyles } from './MyJobsScreen.styles';
import {
  AppHeader,
  Icon,
  Card,
  Badge,
  Button,
} from '../../components/elements';
import JobCard from '../../components/blocks/JobCard';
import { 
  seekerService,
  applicationService,
  jobService,
  companyService,
} from '../../services';
import { apiClient } from '../../services/api/client';

const MyJobsScreen = () => {
  const { logout, userRoles, user } = useAuth();
  const navigation = useNavigation();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [jobs, setJobs] = useState([]);
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
  const [companyProfile, setCompanyProfile] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Determine if user is a company
  const isCompany = userRoles?.isCompany || userRoles?.isPoster || false;
  const { theme } = useTheme();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Load data based on user role
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isCompany) {
        // Load company profile and jobs
        const { data: profile, error: profileError } = 
          await companyService.getCompanyProfile(user.id);

        if (profileError) {
          console.error('Error loading company profile:', profileError);
          setError('Failed to load company profile');
          return;
        }

        setCompanyProfile(profile);

        if (profile?.id) {
          // Load jobs created by this company
          const { data: companyJobs, error: jobsError } = 
            await jobService.getJobsByCompany(profile.id, {
              includeApplications: true,
              includeCategory: true,
              limit: 50
            });

          if (jobsError) {
            console.error('Error loading company jobs:', jobsError);
            setError('Failed to load your jobs');
            return;
          }

          setJobs(companyJobs || []);
        }
      } else {
        // Load seeker profile and applications
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
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
      setJobs([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data when component mounts and user/userRoles are available
    if (user?.id && userRoles) {
      loadData();
    }
  }, [user?.id, userRoles, isCompany]);

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
      await loadData();
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
        {isCompany && (
          <>
            {/* Job Postings List */}
            {jobs.length > 0 && (
              <Animated.View
                style={[
                  getStyles(theme).recentJobsContainer,
                  { opacity: fadeAnim },
                ]}
              >
                <View style={getStyles(theme).sectionHeader}>
                  <Text style={getStyles(theme).sectionTitle}>
                    Your Job Postings ({jobs.length})
                  </Text>
                </View>
                

                <View style={getStyles(theme).recentJobsList}>
                  {jobs.map((job) => (
                    <TouchableOpacity
                      key={job.id}
                      style={[
                        getStyles(theme).applicationCard,
                        { 
                          marginBottom: 16,
                          padding: 20,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 16,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.08,
                          shadowRadius: 8,
                          elevation: 4,
                          borderLeftWidth: 4,
                          borderLeftColor: '#6174f9',
                        }
                      ]}
                      onPress={() => handleViewJob(job)}
                      activeOpacity={0.7}
                    >
                      {/* Header with job title and icon */}
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginBottom: 12
                      }}>
                        <View style={{
                          width: 48,
                          height: 48,
                          backgroundColor: theme.colors.primary.light,
                          borderRadius: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 12
                        }}>
                          <Feather name="briefcase" size={24} color="#6174f9" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[
                            getStyles(theme).sectionTitle,
                            { 
                              fontSize: 18,
                              fontWeight: '600',
                              color: theme.colors.text.primary,
                              marginBottom: 4,
                              lineHeight: 24
                            }
                          ]}>
                            {job.title}
                          </Text>
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}>
                            <View style={{
                              backgroundColor: '#6174f9',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 12,
                              marginRight: 8
                            }}>
                              <Text style={{
                                color: '#FFFFFF',
                                fontSize: 12,
                                fontWeight: '500'
                              }}>
                                {job.job_categories?.name || 'General'}
                              </Text>
                            </View>
                            {job.applications && job.applications.length > 0 && (
                              <View style={{
                                backgroundColor: '#F3F4F6',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                borderRadius: 12,
                                flexDirection: 'row',
                                alignItems: 'center'
                              }}>
                                <Feather name="users" size={12} color="#6B7280" />
                                <Text style={{
                                  color: '#6B7280',
                                  fontSize: 12,
                                  fontWeight: '500',
                                  marginLeft: 4
                                }}>
                                  {job.applications.length}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      
                      {/* Job description */}
                      <Text style={[
                        getStyles(theme).sectionSubtitle,
                        { 
                          marginBottom: 16,
                          fontSize: 14,
                          lineHeight: 20,
                          color: theme.colors.text.secondary
                        }
                      ]} numberOfLines={3}>
                        {job.description}
                      </Text>
                      
                      {/* Location and metadata */}
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: '#F3F4F6'
                      }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                          <Feather name="map-pin" size={14} color="#6B7280" />
                          <Text style={{
                            marginLeft: 6,
                            fontSize: 14,
                            color: '#6B7280',
                            fontWeight: '500'
                          }}>
                            {job.city}
                          </Text>
                        </View>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                          <Feather name="calendar" size={14} color="#6B7280" />
                          <Text style={{
                            marginLeft: 6,
                            fontSize: 12,
                            color: '#9CA3AF'
                          }}>
                            {new Date(job.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Empty State for Company */}
            {jobs.length === 0 && !loading && (
              <Animated.View style={[
                getStyles(theme).emptyState,
                { opacity: fadeAnim }
              ]}>
                <Icon name="briefcase" size={64} color={theme.colors.text.secondary} />
                <Text style={getStyles(theme).emptyTitle}>
                  No Job Postings Yet
                </Text>
                <Text style={getStyles(theme).emptyDescription}>
                  Create your first job posting to start hiring talented candidates
                </Text>
                <Button
                  title="Create Your First Job"
                  onPress={() => navigation.navigate('CreateJob')}
                  style={getStyles(theme).emptyButton}
                  textStyle={getStyles(theme).emptyButtonText}
                />
              </Animated.View>
            )}
          </>
        )}

        {/* Seeker View - Applications */}
        {!isCompany && (
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
