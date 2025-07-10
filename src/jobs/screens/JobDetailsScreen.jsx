import React, { useState, useEffect } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../components/elements/Button';
import Card from '../../components/blocks/Card';
import { theme } from '../../theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getStyles } from './JobDetailsScreen.styles.js';

// Mock job data - in real app, this would come from props/API
const mockJob = {
  id: '1',
  title: 'Senior React Native Developer',
  description:
    'We are looking for an experienced React Native developer to join our team and help build amazing mobile applications...',
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
};

const JobDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId, mode = 'view' } = route.params || {};
  const [job, setJob] = useState(mockJob);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In real app, fetch job details by jobId
    // For now, using mock data
  }, [jobId]);

  const handleEditJob = () => {
    Alert.alert(
      'Edit Job',
      'Navigate to edit mode or CreateJob screen with pre-filled data',
    );
  };

  const handleViewApplications = () => {
    Alert.alert('View Applications', 'Applications view coming soon!');
  };

  const handleDeleteJob = () => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job posting?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In real app, call delete API
            Alert.alert('Success', 'Job deleted successfully', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ],
    );
  };

  const handleCloseJob = () => {
    Alert.alert(
      'Close Job',
      'This will stop accepting new applications. You can reopen it later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close Job',
          onPress: () => {
            setJob(prev => ({ ...prev, status: 'closed' }));
            Alert.alert('Success', 'Job posting has been closed');
          },
        },
      ],
    );
  };

  const getStatusColor = () => {
    switch (job.status) {
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

  const styles = getStyles(theme);

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
                <Pressable
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Feather
                    name="arrow-left"
                    size={20}
                    color={theme.colors.text.primary}
                  />
                </Pressable>
                <View style={styles.headerTitleContainer}>
                  <Text style={styles.headerTitle}>Job Details</Text>
                  <Text style={styles.headerSubtitle}>
                    Manage your job posting
                  </Text>
                </View>
                <Pressable style={styles.moreButton}>
                  <Feather
                    name="more-vertical"
                    size={20}
                    color={theme.colors.text.primary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Job Details Card */}
          <View style={styles.contentContainer}>
            <Card style={styles.jobCard}>
              {/* Job Header */}
              <View style={styles.jobHeader}>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View style={styles.jobMetadata}>
                    <View style={styles.metadataItem}>
                      <Feather
                        name="map-pin"
                        size={14}
                        color={theme.colors.text.secondary}
                      />
                      <Text style={styles.metadataText}>{job.location}</Text>
                    </View>
                    <View style={styles.metadataItem}>
                      <Feather
                        name="briefcase"
                        size={14}
                        color={theme.colors.text.secondary}
                      />
                      <Text style={styles.metadataText}>
                        {job.jobType.replace('-', ' ').toUpperCase()}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor()}20` },
                      ]}
                    >
                      <Text
                        style={[styles.statusText, { color: getStatusColor() }]}
                      >
                        {job.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Job Stats */}
              <View style={styles.statsContainer}>
                <Pressable
                  style={styles.statItem}
                  onPress={handleViewApplications}
                >
                  <Feather
                    name="users"
                    size={20}
                    color={theme.colors.primary.cyan}
                  />
                  <Text style={styles.statNumber}>{job.applicationsCount}</Text>
                  <Text style={styles.statLabel}>Applications</Text>
                </Pressable>

                <View style={styles.statItem}>
                  <Feather
                    name="calendar"
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                  <Text style={styles.statNumber}>
                    {Math.floor(
                      (Date.now() - new Date(job.postedDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}
                  </Text>
                  <Text style={styles.statLabel}>Days Active</Text>
                </View>

                {job.salaryRange && (
                  <View style={styles.statItem}>
                    <Feather
                      name="dollar-sign"
                      size={20}
                      color={theme.colors.status.success}
                    />
                    <Text style={styles.statNumber}>
                      ${(job.salaryRange.min / 1000).toFixed(0)}K-$
                      {(job.salaryRange.max / 1000).toFixed(0)}K
                    </Text>
                    <Text style={styles.statLabel}>Salary Range</Text>
                  </View>
                )}
              </View>

              {/* Job Description */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{job.description}</Text>
              </View>

              {/* Requirements */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                <View style={styles.tagsContainer}>
                  {job.requirements.map((requirement, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{requirement}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Skills */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.tagsContainer}>
                  {job.skills.map((skill, index) => (
                    <View key={index} style={[styles.tag, styles.skillTag]}>
                      <Text style={[styles.tagText, styles.skillTagText]}>
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <View style={styles.actionContent}>
              <Button
                onPress={handleViewApplications}
                variant="outline"
                style={styles.actionButton}
              >
                <Feather
                  name="users"
                  size={16}
                  color={theme.colors.primary.cyan}
                />
                <Text style={styles.actionButtonText}>View Applications</Text>
              </Button>

              <Button onPress={handleEditJob} style={styles.actionButton}>
                <Feather
                  name="edit-2"
                  size={16}
                  color={theme.colors.text.white}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: theme.colors.text.white },
                  ]}
                >
                  Edit Job
                </Text>
              </Button>
            </View>

            <View style={styles.secondaryActions}>
              {job.status === 'active' && (
                <Button
                  onPress={handleCloseJob}
                  variant="outline"
                  style={styles.secondaryActionButton}
                >
                  Close Job
                </Button>
              )}

              <Button
                onPress={handleDeleteJob}
                variant="ghost"
                style={styles.secondaryActionButton}
              >
                <Text style={{ color: theme.colors.status.error }}>
                  Delete Job
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;
