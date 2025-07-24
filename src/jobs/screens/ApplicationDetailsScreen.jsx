import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import Card from '../../components/blocks/Card';
import Button from '../../components/elements/Button';
import { AppHeader, Icon } from '../../components/elements';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { applicationService } from '../../services';
import { getStyles } from './ApplicationDetailsScreen.styles';

const ApplicationDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { applicationData } = route.params || {};
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = getStyles(theme);

  const [application, setApplication] = useState(applicationData);
  const [loading, setLoading] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!application) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color={theme.colors.status.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text.primary }]}>Application Not Found</Text>
          <Text style={[styles.errorText, { color: theme.colors.text.secondary }]}>
            The application data could not be loaded.
          </Text>
          <Button
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const job = application.jobs;
  const company = job?.company_profiles;

  const getStatusColor = status => {
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

  const getStatusText = status => {
    switch (status) {
      case 'applied':
        return 'Application Submitted';
      case 'under_review':
        return 'Under Review';
      case 'hired':
        return "Congratulations! You're Hired";
      case 'rejected':
        return 'Application Not Selected';
      default:
        return status;
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const handleViewJob = () => {
    navigation.navigate('JobsSwipeableJobDetails', { jobData: job });
  };

  const handleContactCompany = () => {
    if (company?.users?.email) {
      Alert.alert(
        'Contact Company',
        `You can reach out to ${company.company_name} at:\n\n${company.users.email}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', style: 'default' },
        ],
      );
    } else {
      Alert.alert(
        'Contact Information',
        'Company contact information is not available at this time.',
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.colors.background }]}>
        {/* App Header */}
        <AppHeader
          title="Application Details"
          subtitle="Track your application status"
          leftIcon={<Icon name="arrow-left" size={20} color={theme.colors.text.primary} />}
          onLeftPress={() => navigation.goBack()}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            {/* Status Card */}
            <Card style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <View
                  style={[
                    styles.statusIcon,
                    {
                      backgroundColor: `${getStatusColor(
                        application.status,
                      )}20`,
                    },
                  ]}
                >
                  <Feather
                    name={getStatusIcon(application.status)}
                    size={24}
                    color={getStatusColor(application.status)}
                  />
                </View>
                <View style={styles.statusInfo}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(application.status) },
                    ]}
                  >
                    {getStatusText(application.status)}
                  </Text>
                  <Text style={styles.statusDate}>
                    Applied on {formatDate(application.created_at)}
                  </Text>
                </View>
              </View>

              {application.status === 'hired' && (
                <View style={styles.congratsSection}>
                  <Text style={styles.congratsText}>
                    🎉 Congratulations! You've been selected for this position.
                    The company will contact you soon with next steps.
                  </Text>
                </View>
              )}

              {application.status === 'rejected' && (
                <View style={styles.rejectionSection}>
                  <Text style={styles.rejectionText}>
                    Thank you for your interest. While this position wasn't a
                    match, keep applying to other opportunities!
                  </Text>
                </View>
              )}
            </Card>

            {/* Job Information */}
            <Card style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View style={styles.companyIcon}>
                  <Feather name="briefcase" size={20} color={theme.colors.primary.main} />
                </View>
                <View style={styles.jobInfo}>
                  <Text style={[styles.jobTitle, { color: theme.colors.text.primary }]}>{job?.title}</Text>
                  <Text style={[styles.companyName, { color: theme.colors.text.secondary }]}>
                    {company?.company_name}
                    {company?.is_verified && (
                      <Feather
                        name="check-circle"
                        size={14}
                        color={theme.colors.status.success}
                        style={{ marginLeft: 6 }}
                      />
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.jobMeta}>
                <View style={styles.metaItem}>
                  <Feather name="map-pin" size={16} color={theme.colors.text.secondary} />
                  <Text style={[styles.metaText, { color: theme.colors.text.secondary }]}>{job?.city}</Text>
                </View>
                {job?.salary && (
                  <View style={styles.metaItem}>
                    <Text style={[styles.metaText, { color: theme.colors.text.secondary }]}>
                      {formatSalary(job.salary)}
                    </Text>
                  </View>
                )}
                {job?.job_categories && (
                  <View style={styles.metaItem}>
                    <Feather name="tag" size={16} color={theme.colors.text.secondary} />
                    <Text style={[styles.metaText, { color: theme.colors.text.secondary }]}>
                      {job.job_categories.name}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.viewJobButton}
                onPress={handleViewJob}
              >
                <Text style={[styles.viewJobText, { color: theme.colors.primary.main }]}>View Full Job Details</Text>
                <Feather name="arrow-right" size={16} color={theme.colors.primary.main} />
              </TouchableOpacity>
            </Card>

            {/* Application Message */}
            {application.message && (
              <Card style={styles.messageCard}>
                <Text style={[styles.messageTitle, { color: theme.colors.text.primary }]}>
                  Your Application Message
                </Text>
                <Text style={[styles.messageText, { color: theme.colors.text.secondary }]}>{application.message}</Text>
              </Card>
            )}

            {/* Timeline */}
            <Card style={styles.timelineCard}>
              <Text style={[styles.timelineTitle, { color: theme.colors.text.primary }]}>Application Timeline</Text>

              <View style={styles.timelineItem}>
                <View style={styles.timelineDot}>
                  <Feather name="send" size={12} color="#FFFFFF" />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineEventTitle, { color: theme.colors.text.primary }]}>
                    Application Submitted
                  </Text>
                  <Text style={[styles.timelineEventDate, { color: theme.colors.text.secondary }]}>
                    {formatDate(application.created_at)}
                  </Text>
                  <Text style={[styles.timelineEventDesc, { color: theme.colors.text.secondary }]}>
                    Your application was successfully submitted to{' '}
                    {company?.company_name}
                  </Text>
                </View>
              </View>

              {application.status !== 'applied' && (
                <View style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      { backgroundColor: getStatusColor(application.status) },
                    ]}
                  >
                    <Feather
                      name={getStatusIcon(application.status)}
                      size={12}
                      color="#FFFFFF"
                    />
                  </View>
                  <View style={styles.timelineContent}>
                                      <Text style={[styles.timelineEventTitle, { color: theme.colors.text.primary }]}>
                    Status Updated
                  </Text>
                  <Text style={[styles.timelineEventDate, { color: theme.colors.text.secondary }]}>
                    {formatDate(application.updated_at)}
                  </Text>
                  <Text style={[styles.timelineEventDesc, { color: theme.colors.text.secondary }]}>
                    Application status changed to "
                    {getStatusText(application.status)}"
                  </Text>
                  </View>
                </View>
              )}
            </Card>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <Button
                variant="outline"
                size="lg"
                onPress={handleViewJob}
                style={styles.actionButton}
              >
                <View style={styles.buttonContent}>
                  <Feather name="eye" size={20} color={theme.colors.primary.main} />
                  <Text style={styles.actionButtonText}>View Job</Text>
                </View>
              </Button>

              {(application.status === 'hired' ||
                application.status === 'under_review') && (
                <Button
                  variant="default"
                  size="lg"
                  onPress={handleContactCompany}
                  style={styles.actionButton}
                >
                  <View style={styles.buttonContent}>
                    <Feather name="mail" size={20} color="#FFFFFF" />
                    <Text
                      style={[styles.actionButtonText, { color: '#FFFFFF' }]}
                    >
                      Contact Company
                    </Text>
                  </View>
                </Button>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default ApplicationDetailsScreen;
