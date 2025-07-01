import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  Pressable,
  View,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '../components/ui';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

// Mock data for development
const mockJobs = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    description:
      'We are looking for an experienced React Native developer to join our team...',
    requirements: ['React Native', 'TypeScript', 'Redux', 'REST APIs'],
    skills: ['React Native', 'TypeScript', 'Redux', 'Git'],
    experienceLevel: 'senior',
    location: 'Remote',
    salaryRange: { min: 80000, max: 120000 },
    jobType: 'full-time',
    status: 'active',
    postedDate: '2024-01-15',
    postedBy: 'current-user',
    applicationsCount: 12,
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    description: 'Creative UI/UX designer needed for mobile app projects...',
    requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research'],
    experienceLevel: 'mid',
    location: 'San Francisco, CA',
    salaryRange: { min: 60000, max: 90000 },
    jobType: 'full-time',
    status: 'active',
    postedDate: '2024-01-10',
    postedBy: 'current-user',
    applicationsCount: 8,
  },
  {
    id: '3',
    title: 'Junior Frontend Developer',
    description: 'Entry-level position for passionate frontend developer...',
    requirements: ['HTML', 'CSS', 'JavaScript', 'React'],
    skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    experienceLevel: 'entry',
    location: 'New York, NY',
    salaryRange: { min: 45000, max: 65000 },
    jobType: 'full-time',
    status: 'closed',
    postedDate: '2024-01-05',
    postedBy: 'current-user',
    applicationsCount: 25,
  },
];

const MyJobsScreen = () => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredJobs = jobs.filter(
    job => selectedFilter === 'all' || job.status === selectedFilter,
  );

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return theme.colors.status.success;
      case 'closed':
        return theme.colors.text.secondary;
      case 'draft':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusLabel = status => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'closed':
        return 'Closed';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  const handleJobAction = (jobId, action) => {
    switch (action) {
      case 'edit':
        Alert.alert('Edit Job', 'Job editing feature coming soon!');
        break;
      case 'close':
        setJobs(prev =>
          prev.map(job =>
            job.id === jobId ? { ...job, status: 'closed' } : job,
          ),
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete Job',
          'Are you sure you want to delete this job posting?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () =>
                setJobs(prev => prev.filter(job => job.id !== jobId)),
            },
          ],
        );
        break;
      case 'view-applications':
        Alert.alert('View Applications', 'Applications view coming soon!');
        break;
    }
  };

  const filters = [
    { key: 'all', label: 'All Jobs', count: jobs.length },
    {
      key: 'active',
      label: 'Active',
      count: jobs.filter(j => j.status === 'active').length,
    },
    {
      key: 'closed',
      label: 'Closed',
      count: jobs.filter(j => j.status === 'closed').length,
    },
    {
      key: 'draft',
      label: 'Draft',
      count: jobs.filter(j => j.status === 'draft').length,
    },
  ];

  const handleCreateJob = () => {
    Alert.alert('Create Job', 'Job creation feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F5E8', '#F3E5F5', '#E3F2FD']}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.headerTitle}>My Job Postings</Text>
                  <Text style={styles.headerSubtitle}>
                    Manage your active job listings
                  </Text>
                </View>

                {/* Create New Job Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.createJobButton,
                    pressed && styles.createJobButtonPressed,
                  ]}
                  onPress={handleCreateJob}
                >
                  <Feather
                    name="plus"
                    size={16}
                    color={theme.colors.text.white}
                  />
                  <Text style={styles.createJobButtonText}>Post Job</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filtersContainer}>
            <View style={styles.filtersContent}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScrollView}
              >
                {filters.map(filter => (
                  <Pressable
                    key={filter.key}
                    onPress={() => setSelectedFilter(filter.key)}
                    style={({ pressed }) => [
                      styles.filterTab,
                      selectedFilter === filter.key && styles.filterTabActive,
                      pressed && styles.filterTabPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        selectedFilter === filter.key &&
                          styles.filterTabTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                    <View
                      style={[
                        styles.filterTabBadge,
                        selectedFilter === filter.key &&
                          styles.filterTabBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterTabBadgeText,
                          selectedFilter === filter.key &&
                            styles.filterTabBadgeTextActive,
                        ]}
                      >
                        {filter.count}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Job Listings */}
          <View style={styles.jobListingsContainer}>
            <View style={styles.jobListingsContent}>
              {filteredJobs.length === 0 ? (
                <Card style={styles.noJobsCard}>
                  <Feather
                    name="briefcase"
                    size={48}
                    color={theme.colors.text.secondary}
                    style={styles.noJobsIcon}
                  />
                  <Text style={styles.noJobsTitle}>No jobs found</Text>
                  <Text style={styles.noJobsDescription}>
                    {selectedFilter === 'all'
                      ? 'Create your first job posting to get started'
                      : `No ${selectedFilter} jobs at the moment`}
                  </Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.createFirstJobButton,
                      pressed && styles.createFirstJobButtonPressed,
                    ]}
                    onPress={handleCreateJob}
                  >
                    <Text style={styles.createFirstJobButtonText}>
                      Post Your First Job
                    </Text>
                  </Pressable>
                </Card>
              ) : (
                <View style={styles.jobsList}>
                  {filteredJobs.map(job => (
                    <Card key={job.id} style={styles.jobCard}>
                      <View style={styles.jobCardContent}>
                        {/* Job Header */}
                        <View style={styles.jobHeader}>
                          <View style={styles.jobInfo}>
                            <Text style={styles.jobTitle}>{job.title}</Text>
                            <View style={styles.jobMetadata}>
                              <View style={styles.jobLocation}>
                                <Feather
                                  name="map-pin"
                                  size={14}
                                  color={theme.colors.text.secondary}
                                />
                                <Text style={styles.jobLocationText}>
                                  {job.location}
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.jobStatusBadge,
                                  {
                                    backgroundColor: `${getStatusColor(
                                      job.status,
                                    )}20`,
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.jobStatusText,
                                    { color: getStatusColor(job.status) },
                                  ]}
                                >
                                  {getStatusLabel(job.status)}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {/* Actions Menu */}
                          <View style={styles.jobActions}>
                            <Pressable
                              style={({ pressed }) => [
                                styles.jobActionButton,
                                pressed && styles.jobActionButtonPressed,
                              ]}
                              onPress={() =>
                                Alert.alert('Job Actions', 'Choose an action', [
                                  {
                                    text: 'Edit Job',
                                    onPress: () =>
                                      handleJobAction(job.id, 'edit'),
                                  },
                                  {
                                    text: 'View Applications',
                                    onPress: () =>
                                      handleJobAction(
                                        job.id,
                                        'view-applications',
                                      ),
                                  },
                                  ...(job.status === 'active'
                                    ? [
                                        {
                                          text: 'Close Job',
                                          onPress: () =>
                                            handleJobAction(job.id, 'close'),
                                        },
                                      ]
                                    : []),
                                  {
                                    text: 'Delete Job',
                                    style: 'destructive',
                                    onPress: () =>
                                      handleJobAction(job.id, 'delete'),
                                  },
                                  { text: 'Cancel', style: 'cancel' },
                                ])
                              }
                            >
                              <Feather
                                name="more-vertical"
                                size={16}
                                color={theme.colors.text.secondary}
                              />
                            </Pressable>
                          </View>
                        </View>

                        {/* Job Stats */}
                        <View style={styles.jobStats}>
                          <Pressable
                            style={({ pressed }) => [
                              styles.jobStatsButton,
                              pressed && styles.jobStatsButtonPressed,
                            ]}
                            onPress={() =>
                              handleJobAction(job.id, 'view-applications')
                            }
                          >
                            <Feather
                              name="users"
                              size={14}
                              color={theme.colors.primary.emerald}
                            />
                            <Text style={styles.jobStatsText}>
                              {job.applicationsCount} applicants
                            </Text>
                          </Pressable>

                          <View style={styles.jobDateInfo}>
                            <Feather
                              name="calendar"
                              size={14}
                              color={theme.colors.text.secondary}
                            />
                            <Text style={styles.jobDateText}>
                              Posted{' '}
                              {new Date(job.postedDate).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>

                        {/* Job Description Preview */}
                        <Text numberOfLines={2} style={styles.jobDescription}>
                          {job.description}
                        </Text>
                      </View>
                    </Card>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: theme.spacing[8],
  },
  headerContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
  },
  headerContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  headerTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  headerSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  },
  createJobButton: {
    backgroundColor: theme.colors.primary.emerald,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  createJobButtonPressed: {
    opacity: 0.8,
  },
  createJobButtonText: {
    marginLeft: theme.spacing[1],
    color: theme.colors.text.white,
    fontSize: theme.typography.buttonSmall.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  filtersContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  filtersScrollView: {
    gap: theme.spacing[3],
  },
  filterTab: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary.emerald,
  },
  filterTabPressed: {
    opacity: 0.8,
  },
  filterTabText: {
    fontSize: theme.typography.buttonSmall.fontSize,
    fontWeight: theme.typography.button.fontWeight,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing[1],
  },
  filterTabTextActive: {
    color: theme.colors.text.white,
  },
  filterTabBadge: {
    paddingHorizontal: theme.spacing[1],
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    minWidth: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  filterTabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterTabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  filterTabBadgeTextActive: {
    color: theme.colors.text.white,
  },
  jobListingsContainer: {
    paddingHorizontal: theme.spacing[4],
  },
  jobListingsContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  noJobsCard: {
    alignItems: 'center',
    padding: theme.spacing[6],
  },
  noJobsIcon: {
    marginBottom: theme.spacing[3],
  },
  noJobsTitle: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  noJobsDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[4],
  },
  createFirstJobButton: {
    backgroundColor: theme.colors.primary.emerald,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
  },
  createFirstJobButtonPressed: {
    opacity: 0.8,
  },
  createFirstJobButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  jobsList: {
    gap: theme.spacing[4],
  },
  jobCard: {
    padding: 0,
    overflow: 'hidden',
  },
  jobCardContent: {
    padding: theme.spacing[4],
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  jobMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  jobLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobLocationText: {
    marginLeft: theme.spacing[1],
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
  },
  jobStatusBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  jobStatusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  jobActions: {
    marginLeft: theme.spacing[2],
  },
  jobActionButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  jobActionButtonPressed: {
    opacity: 0.8,
  },
  jobStats: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  jobStatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
  },
  jobStatsButtonPressed: {
    opacity: 0.8,
  },
  jobStatsText: {
    marginLeft: theme.spacing[1],
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  jobDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDateText: {
    marginLeft: theme.spacing[1],
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
  },
  jobDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});

export default MyJobsScreen;
