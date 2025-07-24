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
import { applicationService } from '../../services/application.service';
import { jobService } from '../../services/job.service';

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
        const job = await jobService.getJobById(jobId);
        setSelectedJob(job);
      }
      
      // Load applications
      if (userRoles?.isCompany && user?.id) {
        const jobApplications = jobId 
          ? await applicationService.getApplicationsByJob(jobId)
          : await applicationService.getApplicationsByCompany(user.id);
        setApplications(jobApplications || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      Alert.alert('Error', 'Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      // Update selected application if it's the one being updated
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(prev => ({ ...prev, status: newStatus }));
      }
      
      Alert.alert('Success', `Application status updated to ${newStatus}.`);
    } catch (error) {
      console.error('Error updating application status:', error);
      Alert.alert('Error', 'Failed to update application status. Please try again.');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'applied':
        return theme.colors.primary;
      case 'under_review':
        return theme.colors.warning;
      case 'hired':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.gray;
    }
  };

  const getStatusText = (status) => {
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
    if (filterStatus === 'all') {
      return applications;
    }
    return applications.filter(app => app.status === filterStatus);
  };

  const renderApplicationCard = (application) => (
    <Card key={application.id} style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicantInfo}>
          <Text style={[styles.applicantName, { color: theme.colors.text }]}>
            {application.seeker_profile?.user?.name || 'Unknown Applicant'}
          </Text>
          <Text style={[styles.applicantEmail, { color: theme.colors.textSecondary }]}>
            {application.seeker_profile?.user?.email || 'No email'}
          </Text>
        </View>
        <Badge 
          text={getStatusText(application.status)}
          color={getStatusBadgeColor(application.status)}
          size="small"
        />
      </View>
      
      {application.message && (
        <Text style={[styles.applicationMessage, { color: theme.colors.textSecondary }]}>
          "{application.message}"
        </Text>
      )}
      
      <View style={styles.applicationFooter}>
        <Text style={[styles.applicationDate, { color: theme.colors.gray }]}>
          Applied: {new Date(application.created_at).toLocaleDateString()}
        </Text>
        
        <TouchableOpacity
          style={[styles.viewButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleViewApplication(application)}
        >
          <Icon name="eye" size={16} color={theme.colors.white} />
          <Text style={[styles.viewButtonText, { color: theme.colors.white }]}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderApplicationModal = () => (
    <Modal
      visible={showApplicationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowApplicationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Application Details
            </Text>
            <TouchableOpacity
              onPress={() => setShowApplicationModal(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color={theme.colors.gray} />
            </TouchableOpacity>
          </View>
          
          {selectedApplication && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.applicantDetails}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Applicant Name
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                  {selectedApplication.seeker_profile?.user?.name || 'Unknown'}
                </Text>
                
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Email
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                  {selectedApplication.seeker_profile?.user?.email || 'No email'}
                </Text>
                
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Phone
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                  {selectedApplication.seeker_profile?.user?.phone_number || 'No phone'}
                </Text>
                
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Experience Level
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                  {selectedApplication.seeker_profile?.experience_level || 'Not specified'}
                </Text>
                
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Education
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                  {`10th: ${selectedApplication.seeker_profile?.tenth_percentage || 'N/A'}% | 12th: ${selectedApplication.seeker_profile?.twelfth_percentage || 'N/A'}% | Graduation: ${selectedApplication.seeker_profile?.graduation_percentage || 'N/A'}%`}
                </Text>
              </View>
              
              {selectedApplication.message && (
                <View style={styles.messageSection}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    Cover Message
                  </Text>
                  <Text style={[styles.messageText, { color: theme.colors.text }]}>
                    {selectedApplication.message}
                  </Text>
                </View>
              )}
              
              <View style={styles.statusSection}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Current Status
                </Text>
                <Badge 
                  text={getStatusText(selectedApplication.status)}
                  color={getStatusBadgeColor(selectedApplication.status)}
                  size="medium"
                />
              </View>
              
              <View style={styles.actionsSection}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  Update Status
                </Text>
                <View style={styles.statusButtons}>
                  <Button
                    title="Under Review"
                    onPress={() => handleUpdateStatus(selectedApplication.id, 'under_review')}
                    style={[styles.statusButton, { backgroundColor: theme.colors.warning }]}
                    textStyle={[styles.statusButtonText, { color: theme.colors.white }]}
                    disabled={statusUpdateLoading || selectedApplication.status === 'under_review'}
                  />
                  <Button
                    title="Hire"
                    onPress={() => handleUpdateStatus(selectedApplication.id, 'hired')}
                    style={[styles.statusButton, { backgroundColor: theme.colors.success }]}
                    textStyle={[styles.statusButtonText, { color: theme.colors.white }]}
                    disabled={statusUpdateLoading || selectedApplication.status === 'hired'}
                  />
                  <Button
                    title="Reject"
                    onPress={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                    style={[styles.statusButton, { backgroundColor: theme.colors.error }]}
                    textStyle={[styles.statusButtonText, { color: theme.colors.white }]}
                    disabled={statusUpdateLoading || selectedApplication.status === 'rejected'}
                  />
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="people-outline" size={64} color={theme.colors.gray} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Applications Yet
      </Text>
      <Text style={[styles.emptyDescription, { color: theme.colors.textSecondary }]}>
        {jobId 
          ? 'This job hasn\'t received any applications yet.'
          : 'Your jobs haven\'t received any applications yet.'
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading applications...
          </Text>
        </View>
      </View>
    );
  }

  const filteredApplications = getFilteredApplications();

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
              {jobId ? 'Job Applications' : 'All Applications'}
            </Text>
            {selectedJob && (
              <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                {selectedJob.title}
              </Text>
            )}
          </View>
        </View>

        {applications.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.content}>
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: theme.colors.textSecondary }]}>
                Filter by status:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'all' && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setFilterStatus('all')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      { color: filterStatus === 'all' ? theme.colors.white : theme.colors.text }
                    ]}>
                      All ({applications.length})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'applied' && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setFilterStatus('applied')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      { color: filterStatus === 'applied' ? theme.colors.white : theme.colors.text }
                    ]}>
                      Applied ({applications.filter(app => app.status === 'applied').length})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'under_review' && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setFilterStatus('under_review')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      { color: filterStatus === 'under_review' ? theme.colors.white : theme.colors.text }
                    ]}>
                      Under Review ({applications.filter(app => app.status === 'under_review').length})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'hired' && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setFilterStatus('hired')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      { color: filterStatus === 'hired' ? theme.colors.white : theme.colors.text }
                    ]}>
                      Hired ({applications.filter(app => app.status === 'hired').length})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      filterStatus === 'rejected' && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => setFilterStatus('rejected')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      { color: filterStatus === 'rejected' ? theme.colors.white : theme.colors.text }
                    ]}>
                      Rejected ({applications.filter(app => app.status === 'rejected').length})
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  applicantDetails: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
  },
  detailValue: {
    fontSize: 14,
    marginBottom: 8,
  },
  messageSection: {
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  statusSection: {
    marginBottom: 20,
  },
  actionsSection: {
    marginBottom: 20,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ApplicationsReviewScreen; 