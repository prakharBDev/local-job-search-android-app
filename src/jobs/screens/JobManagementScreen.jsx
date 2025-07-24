import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/job.service';
import { companyService } from '../../services/company.service';

// Import components
import Card from '../../components/blocks/Card';
import Button from '../../components/elements/Button';
import Badge from '../../components/elements/Badge';
import Icon from '../../components/elements/Icon';

const JobManagementScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user, userRoles } = useAuth();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load company profile
      if (user?.id) {
        const profile = await companyService.getCompanyProfile(user.id);
        setCompanyProfile(profile);
      }
      
      // Load company's jobs
      if (userRoles?.isCompany && user?.id) {
        const companyJobs = await jobService.getJobsByCompany(user.id);
        setJobs(companyJobs || []);
      }
    } catch (error) {
      console.error('Error loading job management data:', error);
      Alert.alert('Error', 'Failed to load job data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateJob = () => {
    navigation.navigate('CreateJob');
  };

  const handleEditJob = (job) => {
    navigation.navigate('CreateJob', { jobId: job.id, editMode: true });
  };

  const handleToggleJobStatus = async (job) => {
    try {
      const newStatus = job.is_active ? false : true;
      await jobService.updateJob(job.id, { is_active: newStatus });
      
      // Update local state
      setJobs(prevJobs => 
        prevJobs.map(j => 
          j.id === job.id ? { ...j, is_active: newStatus } : j
        )
      );
      
      Alert.alert(
        'Success', 
        `Job ${newStatus ? 'activated' : 'deactivated'} successfully.`
      );
    } catch (error) {
      console.error('Error toggling job status:', error);
      Alert.alert('Error', 'Failed to update job status. Please try again.');
    }
  };

  const handleViewApplications = (job) => {
    navigation.navigate('ApplicationsReview', { jobId: job.id });
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive ? theme.colors.success : theme.colors.gray;
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const renderJobCard = (job) => (
    <Card key={job.id} style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={[styles.jobTitle, { color: theme.colors.text }]}>
            {job.title}
          </Text>
          <Badge 
            text={getStatusText(job.is_active)}
            color={getStatusBadgeColor(job.is_active)}
            size="small"
          />
        </View>
        <View style={styles.jobStats}>
          <Text style={[styles.jobStat, { color: theme.colors.gray }]}>
            {job.applications_count || 0} applications
          </Text>
        </View>
      </View>
      
      <Text style={[styles.jobDescription, { color: theme.colors.textSecondary }]}>
        {job.description?.substring(0, 100)}...
      </Text>
      
      <View style={styles.jobFooter}>
        <Text style={[styles.jobDate, { color: theme.colors.gray }]}>
          Posted: {new Date(job.created_at).toLocaleDateString()}
        </Text>
        
        <View style={styles.jobActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleViewApplications(job)}
          >
            <Icon name="people" size={16} color={theme.colors.white} />
            <Text style={[styles.actionText, { color: theme.colors.white }]}>
              View
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
            onPress={() => handleEditJob(job)}
          >
            <Icon name="create" size={16} color={theme.colors.white} />
            <Text style={[styles.actionText, { color: theme.colors.white }]}>
              Edit
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton, 
              { 
                backgroundColor: job.is_active ? theme.colors.warning : theme.colors.success 
              }
            ]}
            onPress={() => handleToggleJobStatus(job)}
          >
            <Icon 
              name={job.is_active ? 'pause' : 'play'} 
              size={16} 
              color={theme.colors.white} 
            />
            <Text style={[styles.actionText, { color: theme.colors.white }]}>
              {job.is_active ? 'Pause' : 'Activate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="briefcase-outline" size={64} color={theme.colors.gray} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Jobs Posted Yet
      </Text>
      <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
        Start by creating your first job posting to find great candidates.
      </Text>
      <Button
        title="Create Your First Job"
        onPress={handleCreateJob}
        style={styles.createButton}
        textStyle={styles.createButtonText}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading your jobs...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              My Jobs
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              Manage your job postings and view applications
            </Text>
          </View>
          
          <Button
            title="Create Job"
            onPress={handleCreateJob}
            style={[styles.createJobButton, { backgroundColor: theme.colors.primary }]}
            textStyle={[styles.createJobButtonText, { color: theme.colors.white }]}
          />
        </View>

        {jobs.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.jobsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {jobs.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Jobs
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.success }]}>
                  {jobs.filter(job => job.is_active).length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Active Jobs
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
                  {jobs.reduce((total, job) => total + (job.applications_count || 0), 0)}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Applications
                </Text>
              </View>
            </View>
            
            {jobs.map(renderJobCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  createJobButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createJobButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  jobsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  jobCard: {
    marginBottom: 16,
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  jobStats: {
    alignItems: 'flex-end',
  },
  jobStat: {
    fontSize: 12,
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobDate: {
    fontSize: 12,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default JobManagementScreen; 