import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  Pressable,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '../components/ui';
import { theme } from '../theme';
import { Job, JobStatus } from '../types/navigation';

// Mock data for development
const mockJobs: Job[] = [
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

const MyJobsScreen: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedFilter, setSelectedFilter] = useState<'all' | JobStatus>(
    'all',
  );

  const filteredJobs = jobs.filter(
    job => selectedFilter === 'all' || job.status === selectedFilter,
  );

  const getStatusColor = (status: JobStatus) => {
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

  const getStatusLabel = (status: JobStatus) => {
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

  const handleJobAction = (
    jobId: string,
    action: 'edit' | 'close' | 'delete' | 'view-applications',
  ) => {
    switch (action) {
      case 'edit':
        Alert.alert('Edit Job', `Edit job ${jobId}`);
        break;
      case 'close':
        setJobs(prev =>
          prev.map(job =>
            job.id === jobId ? { ...job, status: 'closed' as JobStatus } : job,
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
        Alert.alert('Applications', `View applications for job ${jobId}`);
        break;
    }
  };

  const filters: { key: 'all' | JobStatus; label: string; count: number }[] = [
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#E8F5E8', '#F3E5F5', '#E3F2FD']}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: theme.spacing[4],
              paddingVertical: theme.spacing[6],
            }}
          >
            <View
              style={{
                maxWidth: 400,
                alignSelf: 'center',
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: theme.spacing[4],
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: theme.typography.h4.fontSize,
                      fontWeight: theme.typography.h4.fontWeight as any,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing[1],
                    }}
                  >
                    My Job Postings
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.body.fontSize,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    Manage your active job listings
                  </Text>
                </View>

                {/* Create New Job Button */}
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: theme.colors.primary.emerald,
                      paddingHorizontal: theme.spacing[4],
                      paddingVertical: theme.spacing[2],
                      borderRadius: theme.borderRadius.lg,
                      flexDirection: 'row',
                      alignItems: 'center',
                      ...theme.shadows.md,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() =>
                    Alert.alert('Create Job', 'Navigate to Create Job screen')
                  }
                >
                  <Feather
                    name="plus"
                    size={16}
                    color={theme.colors.text.white}
                  />
                  <Text
                    style={{
                      marginLeft: theme.spacing[1],
                      color: theme.colors.text.white,
                      fontSize: theme.typography.buttonSmall.fontSize,
                      fontWeight: theme.typography.button.fontWeight as any,
                    }}
                  >
                    Post Job
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Filter Tabs */}
          <View
            style={{
              paddingHorizontal: theme.spacing[4],
              marginBottom: theme.spacing[6],
            }}
          >
            <View
              style={{
                maxWidth: 400,
                alignSelf: 'center',
                width: '100%',
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: theme.spacing[3] }}
              >
                {filters.map(filter => (
                  <Pressable
                    key={filter.key}
                    onPress={() => setSelectedFilter(filter.key)}
                    style={({ pressed }) => [
                      {
                        paddingHorizontal: theme.spacing[4],
                        paddingVertical: theme.spacing[2],
                        borderRadius: theme.borderRadius.lg,
                        backgroundColor:
                          selectedFilter === filter.key
                            ? theme.colors.primary.emerald
                            : 'rgba(255, 255, 255, 0.8)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        ...theme.shadows.sm,
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: theme.typography.buttonSmall.fontSize,
                        fontWeight: theme.typography.button.fontWeight as any,
                        color:
                          selectedFilter === filter.key
                            ? theme.colors.text.white
                            : theme.colors.text.secondary,
                        marginRight: theme.spacing[1],
                      }}
                    >
                      {filter.label}
                    </Text>
                    <View
                      style={{
                        backgroundColor:
                          selectedFilter === filter.key
                            ? 'rgba(255, 255, 255, 0.3)'
                            : theme.colors.background.secondary,
                        paddingHorizontal: theme.spacing[1],
                        paddingVertical: 2,
                        borderRadius: theme.borderRadius.sm,
                        minWidth: 20,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color:
                            selectedFilter === filter.key
                              ? theme.colors.text.white
                              : theme.colors.text.secondary,
                        }}
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
          <View
            style={{
              paddingHorizontal: theme.spacing[4],
            }}
          >
            <View
              style={{
                maxWidth: 400,
                alignSelf: 'center',
                width: '100%',
              }}
            >
              {filteredJobs.length === 0 ? (
                <Card
                  style={{
                    alignItems: 'center',
                    padding: theme.spacing[6],
                  }}
                >
                  <Feather
                    name="briefcase"
                    size={48}
                    color={theme.colors.text.secondary}
                    style={{ marginBottom: theme.spacing[3] }}
                  />
                  <Text
                    style={{
                      fontSize: theme.typography.h6.fontSize,
                      fontWeight: theme.typography.h6.fontWeight as any,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing[2],
                      textAlign: 'center',
                    }}
                  >
                    No jobs found
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.body.fontSize,
                      color: theme.colors.text.secondary,
                      textAlign: 'center',
                      marginBottom: theme.spacing[4],
                    }}
                  >
                    {selectedFilter === 'all'
                      ? 'Create your first job posting to get started'
                      : `No ${selectedFilter} jobs at the moment`}
                  </Text>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: theme.colors.primary.emerald,
                        paddingHorizontal: theme.spacing[4],
                        paddingVertical: theme.spacing[2],
                        borderRadius: theme.borderRadius.lg,
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                    onPress={() =>
                      Alert.alert('Create Job', 'Navigate to Create Job screen')
                    }
                  >
                    <Text
                      style={{
                        color: theme.colors.text.white,
                        fontSize: theme.typography.button.fontSize,
                        fontWeight: theme.typography.button.fontWeight as any,
                      }}
                    >
                      Post Your First Job
                    </Text>
                  </Pressable>
                </Card>
              ) : (
                <View style={{ gap: theme.spacing[4] }}>
                  {filteredJobs.map(job => (
                    <Card
                      key={job.id}
                      style={{ padding: 0, overflow: 'hidden' }}
                    >
                      <View style={{ padding: theme.spacing[4] }}>
                        {/* Job Header */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: theme.spacing[3],
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                fontSize: theme.typography.h6.fontSize,
                                fontWeight: theme.typography.h6
                                  .fontWeight as any,
                                color: theme.colors.text.primary,
                                marginBottom: theme.spacing[1],
                              }}
                            >
                              {job.title}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: theme.spacing[3],
                                marginBottom: theme.spacing[2],
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <Feather
                                  name="map-pin"
                                  size={14}
                                  color={theme.colors.text.secondary}
                                />
                                <Text
                                  style={{
                                    marginLeft: theme.spacing[1],
                                    fontSize: theme.typography.bodySmall.fontSize,
                                    color: theme.colors.text.secondary,
                                  }}
                                >
                                  {job.location}
                                </Text>
                              </View>
                              <View
                                style={{
                                  paddingHorizontal: theme.spacing[2],
                                  paddingVertical: 2,
                                  borderRadius: theme.borderRadius.sm,
                                  backgroundColor: `${getStatusColor(
                                    job.status,
                                  )}20`,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontWeight: '600',
                                    color: getStatusColor(job.status),
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {getStatusLabel(job.status)}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {/* Actions Menu */}
                          <View style={{ marginLeft: theme.spacing[2] }}>
                            <Pressable
                              style={({ pressed }) => [
                                {
                                  padding: theme.spacing[2],
                                  borderRadius: theme.borderRadius.md,
                                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                },
                                pressed && { opacity: 0.8 },
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
                                    style: 'destructive' as const,
                                    onPress: () =>
                                      handleJobAction(job.id, 'delete'),
                                  },
                                  { text: 'Cancel', style: 'cancel' as const },
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
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: theme.spacing[4],
                            marginBottom: theme.spacing[3],
                          }}
                        >
                          <Pressable
                            style={({ pressed }) => [
                              {
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor:
                                  theme.colors.background.secondary,
                                paddingHorizontal: theme.spacing[3],
                                paddingVertical: theme.spacing[2],
                                borderRadius: theme.borderRadius.md,
                              },
                              pressed && { opacity: 0.8 },
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
                            <Text
                              style={{
                                marginLeft: theme.spacing[1],
                                fontSize: theme.typography.bodySmall.fontSize,
                                fontWeight: '600',
                                color: theme.colors.text.primary,
                              }}
                            >
                              {job.applicationsCount} applicants
                            </Text>
                          </Pressable>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Feather
                              name="calendar"
                              size={14}
                              color={theme.colors.text.secondary}
                            />
                            <Text
                              style={{
                                marginLeft: theme.spacing[1],
                                fontSize: theme.typography.bodySmall.fontSize,
                                color: theme.colors.text.secondary,
                              }}
                            >
                              Posted{' '}
                              {new Date(job.postedDate).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>

                        {/* Job Description Preview */}
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: theme.typography.body.fontSize,
                            color: theme.colors.text.secondary,
                            lineHeight: 20,
                          }}
                        >
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

export default MyJobsScreen;
