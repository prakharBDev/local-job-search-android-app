import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { theme } from '../theme';

interface JobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  location: string;
  jobType: string;
}

const AppliedJobsScreen: React.FC = () => {
  const [applications] = useState<JobApplication[]>([
    {
      id: '1',
      jobTitle: 'React Native Developer',
      companyName: 'TechCorp',
      appliedDate: '2024-01-15',
      status: 'interview',
      location: 'Remote',
      jobType: 'Full-time',
    },
    {
      id: '2',
      jobTitle: 'Frontend Developer',
      companyName: 'StartupXYZ',
      appliedDate: '2024-01-12',
      status: 'reviewed',
      location: 'Mumbai',
      jobType: 'Full-time',
    },
    {
      id: '3',
      jobTitle: 'Junior Developer',
      companyName: 'BigTech Inc',
      appliedDate: '2024-01-10',
      status: 'pending',
      location: 'Bangalore',
      jobType: 'Full-time',
    },
  ]);

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'accepted':
      case 'interview':
        return 'success';
      case 'reviewed':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Under Review';
      case 'reviewed':
        return 'Application Reviewed';
      case 'interview':
        return 'Interview Scheduled';
      case 'rejected':
        return 'Not Selected';
      case 'accepted':
        return 'Offer Received';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleViewDetails = (applicationId: string) => {
    console.log('View application details:', applicationId);
  };

  if (applications.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <FontAwesome
            name="briefcase"
            size={64}
            color={theme.colors.text.tertiary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>No Applications Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start applying to jobs to track your applications here
          </Text>
          <Button
            variant="default"
            onPress={() => console.log('Navigate to job search')}
            icon={null}
            disabled={false}
            style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Find Jobs</Text>
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Applied Jobs</Text>
        <Text style={styles.subtitle}>{applications.length} applications</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {applications.map((application) => (
          <Card key={application.id} style={styles.applicationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{application.jobTitle}</Text>
                <Text style={styles.companyName}>{application.companyName}</Text>
              </View>
              <Badge
                variant={getStatusColor(application.status)}
                size="sm">
                {getStatusLabel(application.status)}
              </Badge>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <FontAwesome
                  name="calendar"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.detailText}>
                  Applied on {formatDate(application.appliedDate)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <FontAwesome
                  name="map-marker"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.detailText}>{application.location}</Text>
              </View>

              <View style={styles.detailRow}>
                <FontAwesome
                  name="clock-o"
                  size={14}
                  color={theme.colors.text.secondary}
                />
                <Text style={styles.detailText}>{application.jobType}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <Button
                variant="outline"
                size="sm"
                onPress={() => handleViewDetails(application.id)}
                icon={null}
                disabled={false}
                style={styles.actionButton}>
                <View style={styles.buttonContent}>
                  <FontAwesome
                    name="eye"
                    size={14}
                    color={theme.colors.text.primary}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.actionButtonText}>View Details</Text>
                </View>
              </Button>

              {application.status === 'interview' && (
                <Button
                  variant="default"
                  size="sm"
                  onPress={() => console.log('Schedule interview')}
                  icon={null}
                  disabled={false}
                  style={styles.actionButton}>
                  <Text style={styles.primaryButtonText}>Schedule</Text>
                </Button>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
  },
  applicationCard: {
    marginBottom: theme.spacing[4],
    padding: theme.spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  jobInfo: {
    flex: 1,
    marginRight: theme.spacing[3],
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600' as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  companyName: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  cardDetails: {
    marginBottom: theme.spacing[4],
    gap: theme.spacing[2],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  detailText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    justifyContent: 'flex-start',
  },
  actionButton: {
    flex: 0,
    paddingHorizontal: theme.spacing[3],
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: theme.spacing[2],
  },
  actionButtonText: {
    fontSize: 13,
    color: theme.colors.text.primary,
  },
  primaryButtonText: {
    fontSize: 13,
    color: theme.colors.text.white,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
  },
  emptyIcon: {
    marginBottom: theme.spacing[4],
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold' as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    lineHeight: 20,
  },
  emptyButton: {
    paddingHorizontal: theme.spacing[6],
  },
  emptyButtonText: {
    color: theme.colors.text.white,
    fontWeight: '500' as any,
  },
});

export default AppliedJobsScreen;
