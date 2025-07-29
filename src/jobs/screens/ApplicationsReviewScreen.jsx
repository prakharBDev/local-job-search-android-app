import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService, jobService, companyService } from '../../services/index.js';

// Import components
import Card from '../../components/blocks/Card';
import Button from '../../components/elements/Button';
import Badge from '../../components/elements/Badge';
import Icon from '../../components/elements/Icon';
import Input from '../../components/elements/Input';

const ApplicationsReviewScreen = () => {

  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { user, userRoles } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const jobId = route.params?.jobId;

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load job details if jobId is provided
      if (jobId) {
        const { data: job, error: jobError } = await jobService.getJobById(jobId);
        if (jobError) {
          console.error('Error loading job:', jobError);
        } else {
          setSelectedJob(job);
        }
      }

      // Load applications
      if (userRoles?.isCompany && user?.id) {
        if (jobId) {
          // Load applications for a specific job
          const { data: jobApplications, error: appsError } = await applicationService.getJobApplications(jobId);
          
          if (appsError) {
            console.error('Error loading applications:', appsError);
            Alert.alert('Error', 'Failed to load applications. Please try again.');
            setApplications([]);
          } else {

            setApplications(jobApplications || []);
          }
        } else {
          // Load all applications for the company
          // First get company profile
          const { data: companyProfile, error: profileError } = await companyService.getCompanyProfile(user.id);
          
          if (profileError || !companyProfile) {
            console.error('Error loading company profile:', profileError);
            Alert.alert('Error', 'Company profile not found. Please complete your profile setup.');
            setApplications([]);
          } else {
            // Then get applications by company
            const { data: companyApplications, error: appsError } = await applicationService.getApplicationsByCompany(companyProfile.id);
            
            if (appsError) {
              console.error('Error loading applications:', appsError);
              Alert.alert('Error', 'Failed to load applications. Please try again.');
              setApplications([]);
            } else {

            setApplications(companyApplications || []);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      Alert.alert('Error', 'Failed to load applications. Please try again.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleViewApplication = application => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      const { data, error } = await applicationService.updateApplicationStatus(
        applicationId,
        newStatus,
      );

      if (error) {
        throw error;
      }

      // Update local state
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );

      // Update selected application if it's the one being updated
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }

      Alert.alert('Success', `Application status updated to ${newStatus}.`);
    } catch (error) {
      console.error('Error updating application status:', error);
      Alert.alert(
        'Error',
        'Failed to update application status. Please try again.',
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusBadgeColor = status => {
    switch (status) {
      case 'applied':
        return '#6174f9';
      case 'under_review':
        return '#F59E0B';
      case 'hired':
        return '#75ce9b';
      case 'rejected':
        return '#EF4444';
      default:
        return theme.colors.gray;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'under_review':
        return 'Under Review';
      case 'hired':
        return 'Hired';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getFilteredApplications = () => {
    if (!Array.isArray(applications)) {
      return [];
    }
    if (filterStatus === 'all') {
      return applications;
    }
    return applications.filter(app => app.status === filterStatus);
  };

  const renderApplicationCard = application => {
    return (
    <Card key={application.id} style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicantInfo}>
          <Text style={[styles.applicantName, { color: theme.colors.text }]}>
            {application.seeker_profiles?.users?.name || 'Job Applicant'}
          </Text>
          <Text
            style={[
              styles.applicantEmail,
              { color: theme.colors.textSecondary },
            ]}
          >
            {application.seeker_profiles?.users?.email || 'applicant@example.com'}
          </Text>
        </View>
        <Badge
          text={getStatusText(application.status)}
          color={getStatusBadgeColor(application.status)}
          size="small"
        />
      </View>

      {application.cover_letter && (
        <Text
          style={[
            styles.applicationMessage,
            { color: theme.colors.textSecondary },
          ]}
        >
          "{application.cover_letter}"
        </Text>
      )}

      {/* Skills Section */}
      {application.seeker_profiles?.seeker_skills && application.seeker_profiles.seeker_skills.length > 0 && (
        <View style={styles.skillsSection}>
          <Text style={[styles.skillsLabel, { color: theme.colors.textSecondary }]}>
            Skills:
          </Text>
          <View style={styles.skillsContainer}>
            {application.seeker_profiles.seeker_skills.map((skillItem, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.skillChip, 
                  { 
                    backgroundColor: index % 2 === 0 ? '#6174f9' : '#75ce9b'
                  }
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.skillChipText, { color: '#FFFFFF' }]}>
                  {skillItem.skills?.name || 'Unknown Skill'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {(!application.seeker_profiles?.seeker_skills || application.seeker_profiles.seeker_skills.length === 0) && (
        <View style={styles.skillsSection}>
          <Text style={[styles.skillsLabel, { color: theme.colors.textSecondary }]}>
            Skills: <Text style={{ color: theme.colors.gray }}>Not specified</Text>
          </Text>
        </View>
      )}

      <View style={styles.applicationFooter}>
        <Text style={[styles.applicationDate, { color: theme.colors.gray }]}>
          Applied: {new Date(application.created_at).toLocaleDateString()}
        </Text>

        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: '#6174f9' }]}
          onPress={() => handleViewApplication(application)}
        >
          <Icon name="eye" size={16} color="#FFFFFF" />
          <Text style={[styles.viewButtonText, { color: '#FFFFFF' }]}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
    );
  };

  const renderApplicationModal = () => {
    return (
    <Modal
      visible={showApplicationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowApplicationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.colors.white }]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Icon name="user" size={24} color={theme.colors.primary} />
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Application Details
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowApplicationModal(false)}
              style={styles.closeButton}
            >
              <Icon name="x" size={24} color={theme.colors.gray} />
            </TouchableOpacity>
          </View>

          {selectedApplication && (
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Applicant Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileHeader}>
                  <View style={styles.avatarContainer}>
                    <Icon name="user" size={32} color={theme.colors.white} />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={[styles.applicantName, { color: theme.colors.text }]}>
                      {selectedApplication.seeker_profiles?.users?.name || 'Job Applicant'}
                    </Text>
                    <Text style={[styles.applicantEmail, { color: theme.colors.textSecondary }]}>
                      {selectedApplication.seeker_profiles?.users?.email || 'applicant@example.com'}
                    </Text>
                    <Badge 
                      text={getStatusText(selectedApplication.status)}
                      color={getStatusBadgeColor(selectedApplication.status)}
                      size="small"
                    />
                  </View>
                </View>
              </View>

              {/* Contact Information */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Contact Information
                </Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Icon name="phone" size={16} color={theme.colors.primary} />
                    <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                      Phone
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                      {selectedApplication.seeker_profiles?.users?.phone_number || 'Not provided'}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Icon name="calendar" size={16} color={theme.colors.primary} />
                    <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                      Applied
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                      {selectedApplication.created_at ? new Date(selectedApplication.created_at).toLocaleDateString('en-GB') : 'Recently'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Experience & Education */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Experience & Education
                </Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Icon name="briefcase" size={16} color={theme.colors.primary} />
                    <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                      Experience
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.text, fontWeight: 'bold' }]}>
                      {selectedApplication.seeker_profiles?.experience_level || 'Not specified'}
                    </Text>
                  </View>
                  <View style={styles.educationContainer}>
                    <View style={styles.educationHeader}>
                      <Icon name="book" size={16} color={theme.colors.primary} />
                      <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                        Education
                      </Text>
                    </View>
                    <View style={styles.educationDetails}>
                      <View style={styles.educationItem}>
                        <Text style={[styles.educationLabel, { color: theme.colors.textSecondary }]}>
                          10th Standard
                        </Text>
                        <Text style={[styles.educationPercentage, { color: theme.colors.text }]}>
                          {selectedApplication.seeker_profiles?.tenth_percentage || 'N/A'}%
                        </Text>
                      </View>
                      <View style={styles.educationItem}>
                        <Text style={[styles.educationLabel, { color: theme.colors.textSecondary }]}>
                          12th Standard
                        </Text>
                        <Text style={[styles.educationPercentage, { color: theme.colors.text }]}>
                          {selectedApplication.seeker_profiles?.twelfth_percentage || 'N/A'}%
                        </Text>
                      </View>
                      <View style={styles.educationItem}>
                        <Text style={[styles.educationLabel, { color: theme.colors.textSecondary }]}>
                          Graduation
                        </Text>
                        <Text style={[styles.educationPercentage, { color: theme.colors.text }]}>
                          {selectedApplication.seeker_profiles?.graduation_percentage || 'N/A'}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Skills Section */}
              {selectedApplication.seeker_profiles?.seeker_skills && selectedApplication.seeker_profiles.seeker_skills.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Skills & Expertise
                  </Text>
                  <View style={styles.skillsModalContainer}>
                    {selectedApplication.seeker_profiles.seeker_skills.map((skillItem, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={[
                          styles.skillModalChip, 
                          { 
                            backgroundColor: index % 2 === 0 ? '#6174f9' : '#75ce9b'
                          }
                        ]}
                        activeOpacity={0.8}
                      >
                        <Icon name="award" size={14} color="#FFFFFF" />
                        <Text style={[styles.skillModalChipText, { color: '#FFFFFF' }]}>
                          {skillItem.skills?.name || 'Unknown Skill'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {(!selectedApplication.seeker_profiles?.seeker_skills || selectedApplication.seeker_profiles.seeker_skills.length === 0) && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Skills & Expertise
                  </Text>
                  <Text style={[styles.noSkillsText, { color: theme.colors.textSecondary }]}>
                    No skills specified by the applicant
                  </Text>
                </View>
              )}
              
              {/* Cover Letter */}
              {selectedApplication.cover_letter && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Cover Letter
                  </Text>
                  <View style={[styles.coverLetterContainer, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.coverLetterText, { color: theme.colors.text }]}>
                      {selectedApplication.cover_letter}
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Status Actions - Standalone without card wrapper */}
              <View style={styles.statusActionsContainer}>
                <Text style={[styles.statusActionsTitle, { color: theme.colors.text }]}>
                  Update Application Status
                </Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      { 
                        backgroundColor: selectedApplication.status === 'under_review' 
                          ? '#F59E0B' 
                          : '#FBBF24',
                        opacity: selectedApplication.status === 'under_review' ? 0.8 : 1
                      },
                      selectedApplication.status === 'under_review' && styles.statusButtonActive
                    ]}
                    onPress={() => handleUpdateStatus(selectedApplication.id, 'under_review')}
                    disabled={statusUpdateLoading || selectedApplication.status === 'under_review'}
                  >
                    <Icon name="clock" size={20} color="#FFFFFF" />
                    <Text style={[styles.statusButtonText, { color: '#FFFFFF' }]}>
                      Under Review
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      { 
                        backgroundColor: selectedApplication.status === 'hired' 
                          ? '#75ce9b' 
                          : '#3DD598',
                        opacity: selectedApplication.status === 'hired' ? 0.8 : 1
                      },
                      selectedApplication.status === 'hired' && styles.statusButtonActive
                    ]}
                    onPress={() => handleUpdateStatus(selectedApplication.id, 'hired')}
                    disabled={statusUpdateLoading || selectedApplication.status === 'hired'}
                  >
                    <Icon name="check" size={20} color="#FFFFFF" />
                    <Text style={[styles.statusButtonText, { color: '#FFFFFF' }]}>
                      Hire
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      { 
                        backgroundColor: selectedApplication.status === 'rejected' 
                          ? '#EF4444' 
                          : '#F87171',
                        opacity: selectedApplication.status === 'rejected' ? 0.8 : 1
                      },
                      selectedApplication.status === 'rejected' && styles.statusButtonActive
                    ]}
                    onPress={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                    disabled={statusUpdateLoading || selectedApplication.status === 'rejected'}
                  >
                    <Icon name="x" size={20} color="#FFFFFF" />
                    <Text style={[styles.statusButtonText, { color: '#FFFFFF' }]}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="users" size={64} color={theme.colors.gray} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {jobId ? 'No Applications Yet' : 'Welcome to Applications Review! 👔'}
      </Text>
      <Text
        style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}
      >
        {jobId
          ? "This job hasn't received any applications yet. Share your job posting to attract more candidates."
          : "You haven't received any job applications yet. Once candidates start applying to your jobs, you'll be able to review and manage them here."}
      </Text>
      {!jobId && (
        <Text style={[styles.emptyHint, { color: theme.colors.textSecondary }]}>
          💡 Tip: Make sure you have active job postings to receive
          applications!
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Icon name="users" size={48} color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading applications...
          </Text>
          <Text
            style={[
              styles.loadingSubtext,
              { color: theme.colors.textSecondary },
            ]}
          >
            {jobId
              ? 'Fetching applications for this job'
              : 'Gathering all your job applications'}
          </Text>
        </View>
      </View>
    );
  }

  const filteredApplications = getFilteredApplications();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
              {jobId ? 'Job Applications' : 'All Applications'}
            </Text>
            {selectedJob && (
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {selectedJob.title}
              </Text>
            )}
          </View>
        </View>

        {!Array.isArray(applications) || applications.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.content}>
            <View style={styles.filterSection}>
              <Text
                style={[
                  styles.filterLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Filter by status:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'all' && {
                        backgroundColor: '#6174f9',
                      },
                    ]}
                    onPress={() => setFilterStatus('all')}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        {
                          color:
                            filterStatus === 'all'
                              ? '#FFFFFF'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      All (
                      {Array.isArray(applications) ? applications.length : 0})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'applied' && {
                        backgroundColor: '#6174f9',
                      },
                    ]}
                    onPress={() => setFilterStatus('applied')}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        {
                          color:
                            filterStatus === 'applied'
                              ? '#FFFFFF'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      Applied (
                      {Array.isArray(applications)
                        ? applications.filter(app => app.status === 'applied')
                            .length
                        : 0}
                      )
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'under_review' && {
                        backgroundColor: '#6174f9',
                      },
                    ]}
                    onPress={() => setFilterStatus('under_review')}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        {
                          color:
                            filterStatus === 'under_review'
                              ? '#FFFFFF'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      Under Review (
                      {Array.isArray(applications)
                        ? applications.filter(
                            app => app.status === 'under_review',
                          ).length
                        : 0}
                      )
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'hired' && {
                        backgroundColor: '#6174f9',
                      },
                    ]}
                    onPress={() => setFilterStatus('hired')}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        {
                          color:
                            filterStatus === 'hired'
                              ? '#FFFFFF'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      Hired (
                      {Array.isArray(applications)
                        ? applications.filter(app => app.status === 'hired')
                            .length
                        : 0}
                      )
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'rejected' && {
                        backgroundColor: '#6174f9',
                      },
                    ]}
                    onPress={() => setFilterStatus('rejected')}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        {
                          color:
                            filterStatus === 'rejected'
                              ? '#FFFFFF'
                              : theme.colors.text,
                        },
                      ]}
                    >
                      Rejected (
                      {Array.isArray(applications)
                        ? applications.filter(app => app.status === 'rejected')
                            .length
                        : 0}
                      )
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>

            {filteredApplications.map(renderApplicationCard)}
          </View>
        )}
      </ScrollView>

      {renderApplicationModal()}
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
    lineHeight: 24,
  },
  content: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  applicationCard: {
    marginBottom: 16,
    padding: 16,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  applicantEmail: {
    fontSize: 14,
  },
  applicationMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 20,
  },
  applicationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicationDate: {
    fontSize: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modalBody: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    marginBottom: 24,
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6174f9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111827',
  },
  applicantEmail: {
    fontSize: 15,
    marginBottom: 10,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
    letterSpacing: 0.3,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 70,
    color: '#374151',
  },
  infoValue: {
    fontSize: 15,
    flex: 1,
    color: '#111827',
    fontWeight: '500',
  },
  coverLetterContainer: {
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  coverLetterText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    color: '#374151',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 80,
  },
  statusButtonActive: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.25,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 18,
  },
  educationContainer: {
    marginTop: 12,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  educationDetails: {
    gap: 8,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  educationLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  educationPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#75ce9b',
    letterSpacing: 0.5,
  },
  emptyHint: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  // Skills styles for application cards
  skillsSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Skills styles for modal
  skillsModalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  skillModalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  skillModalChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noSkillsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  modalFooter: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
    letterSpacing: 0.3,
  },
  statusActionsContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  statusActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
    letterSpacing: 0.3,
  },
});

export default ApplicationsReviewScreen;