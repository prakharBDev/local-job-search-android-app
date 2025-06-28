import React, { useState } from 'react';
import {
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../components/ui';
import { theme } from '../theme';
import { Job, JobStatus } from '../types/navigation';

// Mock data for development
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    description: 'We are looking for an experienced React Native developer to join our team...',
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
];

const MyJobsScreenSimple: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | JobStatus>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredJobs = jobs.filter(job =>
    selectedFilter === 'all' || job.status === selectedFilter
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={{
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[6],
        }}>
          <Text style={{
            fontSize: theme.typography.h4.fontSize,
            fontWeight: theme.typography.h4.fontWeight as any,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing[1],
          }}>
            My Job Postings
          </Text>
          <Text style={{
            fontSize: theme.typography.body.fontSize,
            color: theme.colors.text.secondary,
          }}>
            Manage your active job listings
          </Text>

          {/* Create New Job Button */}
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary.emerald,
              paddingHorizontal: theme.spacing[4],
              paddingVertical: theme.spacing[3],
              borderRadius: theme.borderRadius.lg,
              marginTop: theme.spacing[4],
              alignSelf: 'flex-start',
            }}
            onPress={() => Alert.alert('Create Job', 'Navigate to Create Job screen')}
          >
            <Text style={{
              color: theme.colors.text.white,
              fontSize: theme.typography.button.fontSize,
              fontWeight: theme.typography.button.fontWeight as any,
            }}>
              + Create New Job
            </Text>
          </TouchableOpacity>
        </View>

        {/* Job List */}
        <View style={{ paddingHorizontal: theme.spacing[4] }}>
          {filteredJobs.length === 0 ? (
            <Card style={{ padding: theme.spacing[6], alignItems: 'center' }}>
              <Text style={{
                fontSize: theme.typography.h6.fontSize,
                fontWeight: theme.typography.h6.fontWeight as any,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing[2],
                textAlign: 'center',
              }}>
                No jobs found
              </Text>
              <Text style={{
                fontSize: theme.typography.body.fontSize,
                color: theme.colors.text.secondary,
                textAlign: 'center',
                marginBottom: theme.spacing[4],
              }}>
                Create your first job posting to get started
              </Text>
            </Card>
          ) : (
            <View style={{ gap: theme.spacing[4] }}>
              {filteredJobs.map((job) => (
                <Card key={job.id} style={{ padding: theme.spacing[4] }}>
                  <Text style={{
                    fontSize: theme.typography.h6.fontSize,
                    fontWeight: theme.typography.h6.fontWeight as any,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing[2],
                  }}>
                    {job.title}
                  </Text>
                  <Text style={{
                    fontSize: theme.typography.body.fontSize,
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing[2],
                  }}>
                    {job.location}
                  </Text>
                  <Text style={{
                    fontSize: theme.typography.caption.fontSize,
                    color: theme.colors.text.secondary,
                  }}>
                    {job.applicationsCount} applicants
                  </Text>
                  
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.colors.primary.emerald,
                      paddingHorizontal: theme.spacing[3],
                      paddingVertical: theme.spacing[2],
                      borderRadius: theme.borderRadius.md,
                      marginTop: theme.spacing[3],
                      alignSelf: 'flex-start',
                    }}
                    onPress={() => Alert.alert('Job Actions', `Manage job: ${job.title}`)}
                  >
                    <Text style={{
                      color: theme.colors.text.white,
                      fontSize: theme.typography.caption.fontSize,
                      fontWeight: '600',
                    }}>
                      Manage
                    </Text>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyJobsScreenSimple; 