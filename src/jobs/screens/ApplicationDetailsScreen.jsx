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
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Application Not Found</Text>
          <Text style={styles.errorText}>
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return '#3B82F6';
      case 'under_review':
        return '#F59E0B';
      case 'hired':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 'applied':
        return 'Application Submitted';
      case 'under_review':
        return 'Under Review';
      case 'hired':
        return 'Congratulations! You\'re Hired';
      case 'rejected':
        return 'Application Not Selected';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewJob = () => {
    navigation.navigate('JobDetails', { jobData: job });
  };

  const handleContactCompany = () => {
    if (company?.users?.email) {
      Alert.alert(
        'Contact Company',
        `You can reach out to ${company.company_name} at:\n\n${company.users.email}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', style: 'default' }
        ]
      );
    } else {
      Alert.alert(
        'Contact Information',
        'Company contact information is not available at this time.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* App Header */}
        <AppHeader
          title="Application Details"
          subtitle="Track your application status"
          leftIcon={<Icon name="arrow-left" size={20} color="#1E293B" />}
          onLeftPress={() => navigation.goBack()}
          background="#F7F9FC"
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
                <View style={[
                  styles.statusIcon,
                  { backgroundColor: `${getStatusColor(application.status)}20` }
                ]}>
                  <Feather 
                    name={getStatusIcon(application.status)} 
                    size={24} 
                    color={getStatusColor(application.status)} 
                  />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(application.status) }
                  ]}>
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
                    Thank you for your interest. While this position wasn't a match, 
                    keep applying to other opportunities!
                  </Text>
                </View>
              )}
            </Card>

            {/* Job Information */}
            <Card style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View style={styles.companyIcon}>
                  <Feather name="briefcase" size={20} color="#3B82F6" />
                </View>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle}>{job?.title}</Text>
                  <Text style={styles.companyName}>
                    {company?.company_name}
                    {company?.is_verified && (
                      <Feather name="check-circle" size={14} color="#10B981" style={{ marginLeft: 6 }} />
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.jobMeta}>
                <View style={styles.metaItem}>
                  <Feather name="map-pin" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{job?.city}</Text>
                </View>
                {job?.salary && (
                  <View style={styles.metaItem}>
                    <Feather name="dollar-sign" size={16} color="#6B7280" />
                    <Text style={styles.metaText}>{job.salary}</Text>
                  </View>
                )}
                {job?.job_categories && (
                  <View style={styles.metaItem}>
                    <Feather name="tag" size={16} color="#6B7280" />
                    <Text style={styles.metaText}>{job.job_categories.name}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.viewJobButton}
                onPress={handleViewJob}
              >
                <Text style={styles.viewJobText}>View Full Job Details</Text>
                <Feather name="arrow-right" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </Card>

            {/* Application Message */}
            {application.message && (
              <Card style={styles.messageCard}>
                <Text style={styles.messageTitle}>Your Application Message</Text>
                <Text style={styles.messageText}>{application.message}</Text>
              </Card>
            )}

            {/* Timeline */}
            <Card style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>Application Timeline</Text>
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot}>
                  <Feather name="send" size={12} color="#FFFFFF" />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineEventTitle}>Application Submitted</Text>
                  <Text style={styles.timelineEventDate}>
                    {formatDate(application.created_at)}
                  </Text>
                  <Text style={styles.timelineEventDesc}>
                    Your application was successfully submitted to {company?.company_name}
                  </Text>
                </View>
              </View>

              {application.status !== 'applied' && (
                <View style={styles.timelineItem}>
                  <View style={[
                    styles.timelineDot,
                    { backgroundColor: getStatusColor(application.status) }
                  ]}>
                    <Feather 
                      name={getStatusIcon(application.status)} 
                      size={12} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineEventTitle}>
                      Status Updated
                    </Text>
                    <Text style={styles.timelineEventDate}>
                      {formatDate(application.updated_at)}
                    </Text>
                    <Text style={styles.timelineEventDesc}>
                      Application status changed to "{getStatusText(application.status)}"
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
                  <Feather name="eye" size={20} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>View Job</Text>
                </View>
              </Button>

              {(application.status === 'hired' || application.status === 'under_review') && (
                <Button
                  variant="default"
                  size="lg"
                  onPress={handleContactCompany}
                  style={styles.actionButton}
                >
                  <View style={styles.buttonContent}>
                    <Feather name="mail" size={20} color="#FFFFFF" />
                    <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
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