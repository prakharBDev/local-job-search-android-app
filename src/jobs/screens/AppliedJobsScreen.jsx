import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Badge from '../../components/elements/Badge';
import Button from '../../components/elements/Button';
import Card from '../../components/blocks/Card';
import { AppHeader, Icon } from '../../components/elements';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { applicationService, seekerService } from '../../services';

const AppliedJobsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState(null);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load seeker profile
  useEffect(() => {
    const loadSeekerProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await seekerService.getSeekerProfile(user.id);
          if (data && !error) {
            setSeekerProfile(data);
          }
        } catch (error) {
          console.error('Error loading seeker profile:', error);
        }
      }
    };

    loadSeekerProfile();
  }, [user]);

  // Load applications when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      if (seekerProfile) {
        loadApplications();
      }
    }, [seekerProfile]),
  );

  // Initial load
  useEffect(() => {
    if (seekerProfile) {
      loadApplications();

      // Entrance animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [seekerProfile]);

  const loadApplications = async () => {
    if (!seekerProfile) {return;}

    try {
      setLoading(true);
      const { data, error } = await applicationService.getSeekerApplications(
        seekerProfile.id,
      );

      if (error) {
        throw error;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      Alert.alert('Error', 'Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'applied':
        return 'default';
      case 'under_review':
        return 'warning';
      case 'hired':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = status => {
    switch (status) {
      case 'applied':
        return 'Application Sent';
      case 'under_review':
        return 'Under Review';
      case 'hired':
        return 'Hired!';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'applied':
        return 'send';
      case 'under_review':
        return 'eye';
      case 'hired':
        return 'check-circle';
      case 'rejected':
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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

  const handleViewDetails = application => {
    navigation.navigate('ApplicationDetails', { applicationData: application });
  };

  const handleViewJob = job => {
    navigation.navigate('JobDetails', { jobData: job });
  };

  const handleFindJobs = () => {
    navigation.navigate('Jobs');
  };

  if (loading && applications.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A5B4FC" />
          <Text style={styles.loadingText}>Loading your applications...</Text>
        </View>
      </View>
    );
  }

  if (!seekerProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Feather name="user" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Profile Setup Required</Text>
          <Text style={styles.emptySubtitle}>
            Please complete your seeker profile to view applications
          </Text>
          <Button
            variant="default"
            onPress={() => navigation.navigate('SeekerProfileSetup')}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>Complete Profile</Text>
          </Button>
        </View>
      </View>
    );
  }

  if (applications.length === 0) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.emptyState}>
          <Feather name="briefcase" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Applications Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start applying to jobs to track your applications here
          </Text>
          <Button
            variant="default"
            onPress={handleFindJobs}
            style={styles.emptyButton}
          >
            <View style={styles.buttonContent}>
              <Feather name="search" size={16} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Find Jobs</Text>
            </View>
          </Button>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* App Header */}
      <AppHeader
        title="Applied Jobs"
        subtitle={`${applications.length} application${
          applications.length !== 1 ? 's' : ''
        }`}
        leftIcon={<Icon name="arrow-left" size={20} color="#64748B" />}
        onLeftPress={() => navigation.goBack()}
        background="#FFFFFF"
      />

      {/* Applications List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#A5B4FC']}
            tintColor="#A5B4FC"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {applications.map(application => {
          const job = application.jobs;
          const company = job?.company_profiles;

          return (
            <Card key={application.id} style={styles.applicationCard}>
              {/* Job Info Header */}
              <View style={styles.cardHeader}>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>
                    {job?.title || 'Job Title'}
                  </Text>
                  <View style={styles.companyRow}>
                    <Text style={styles.companyName}>
                      {company?.company_name || 'Company'}
                    </Text>
                    {company?.is_verified && (
                      <Feather name="check-circle" size={14} color="#10B981" />
                    )}
                  </View>
                </View>
                <Badge variant={getStatusColor(application.status)} size="sm">
                  {getStatusLabel(application.status)}
                </Badge>
              </View>

              {/* Application Details */}
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Feather name="calendar" size={14} color="#E2E8F0" />
                  <Text style={styles.detailText}>
                    Applied on {formatDate(application.created_at)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Feather name="map-pin" size={14} color="#E2E8F0" />
                  <Text style={styles.detailText}>
                    {job?.city || 'Location'}
                  </Text>
                </View>

                {job?.salary && (
                  <View style={styles.detailRow}>
                    <Feather name="dollar-sign" size={14} color="#E2E8F0" />
                    <Text style={styles.detailText}>
                      {formatSalary(job.salary)}
                    </Text>
                  </View>
                )}

                {job?.job_categories && (
                  <View style={styles.detailRow}>
                    <Feather name="tag" size={14} color="#E2E8F0" />
                    <Text style={styles.detailText}>
                      {job.job_categories.name}
                    </Text>
                  </View>
                )}
              </View>

              {/* Status Indicator */}
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor: `${
                        getStatusColor(application.status) === 'success'
                          ? '#10B981'
                          : getStatusColor(application.status) === 'warning'
                          ? '#F59E0B'
                          : getStatusColor(application.status) === 'error'
                          ? '#EF4444'
                          : '#3B82F6'
                      }20`,
                    },
                  ]}
                >
                  <Feather
                    name={getStatusIcon(application.status)}
                    size={16}
                    color={
                      getStatusColor(application.status) === 'success'
                        ? '#10B981'
                        : getStatusColor(application.status) === 'warning'
                        ? '#F59E0B'
                        : getStatusColor(application.status) === 'error'
                        ? '#EF4444'
                        : '#3B82F6'
                    }
                  />
                </View>
                <Text style={styles.statusText}>
                  {application.status === 'hired' &&
                    'Congratulations! You got the job!'}
                  {application.status === 'under_review' &&
                    'Your application is being reviewed'}
                  {application.status === 'applied' &&
                    'Application submitted successfully'}
                  {application.status === 'rejected' &&
                    'Keep applying to other opportunities'}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => handleViewDetails(application)}
                  style={styles.actionButton}
                >
                  <View style={styles.buttonContent}>
                    <Feather name="eye" size={14} color="#A5B4FC" />
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </View>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => handleViewJob(job)}
                  style={styles.actionButton}
                >
                  <View style={styles.buttonContent}>
                    <Feather name="external-link" size={14} color="#A5B4FC" />
                    <Text style={styles.actionButtonText}>View Job</Text>
                  </View>
                </Button>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E2E8F0',
    fontWeight: '500',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#F8FAFC',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    fontWeight: '500',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Application Card
  applicationCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#F8FAFC',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyName: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '500',
  },

  // Card Details
  cardDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '500',
  },

  // Status Row
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '500',
    lineHeight: 18,
  },

  // Card Actions
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#A5B4FC',
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 140,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default AppliedJobsScreen;
