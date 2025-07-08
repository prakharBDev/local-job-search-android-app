import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';

import { useTheme } from '../contexts/ThemeContext';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContainer: {
      paddingBottom: theme.spacing[8],
    },
    header: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[6],
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing[4],
    },
    backButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing[2],
      marginRight: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
    },
    backButtonText: {
      marginLeft: theme.spacing[2],
    },
    jobTitle: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: theme.typography.h4.fontWeight,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[1],
    },
    companyName: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text.secondary,
    },
    quickInfo: {
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing[4],
    },
    content: {
      paddingHorizontal: theme.spacing[4],
      marginBottom: theme.spacing[6],
    },
    section: {
      marginBottom: theme.spacing[4],
    },
    sectionCard: {
      padding: theme.spacing[6],
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing[6],
    },
    sectionTitle: {
      fontSize: theme.typography.h5.fontSize,
      fontWeight: theme.typography.h5.fontWeight,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    sectionContent: {
      marginTop: theme.spacing[2],
    },
    detailsGrid: {
      gap: theme.spacing[3],
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: theme.spacing[1],
    },
    detailLabel: {
      fontSize: theme.typography.bodySmall.fontSize,
      color: theme.colors.text.secondary,
      flex: 1,
    },
    detailValue: {
      fontSize: theme.typography.bodySmall.fontSize,
      color: theme.colors.text.primary,
      flex: 2,
      textAlign: 'right',
    },
    badgeContainer: {
      paddingHorizontal: theme.spacing[2],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
    },
    description: {
      lineHeight: 24,
    },
    requirementsContainer: {
      paddingVertical: theme.spacing[4],
      marginBottom: theme.spacing[6],
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.secondary,
    },
    requirementsList: {
      paddingHorizontal: theme.spacing[4],
      gap: theme.spacing[1],
    },
    requirementItem: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.h6.fontWeight,
      color: theme.colors.text.primary,
    },
    requirementText: {
      fontSize: theme.typography.bodySmall.fontSize,
      color: theme.colors.text.secondary,
    },
    benefitsSection: {
      marginBottom: theme.spacing[6],
    },
    benefitsTitle: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.h6.fontWeight,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[3],
    },
    benefitsText: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text.secondary,
      lineHeight: 24,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
    },
    skillBadge: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    skillBadgeRequired: {
      backgroundColor: `${theme.colors.primary.cyan}10`,
      borderColor: theme.colors.primary.cyan,
    },
    skillText: {
      fontSize: theme.typography.bodySmall.fontSize,
      color: theme.colors.text.secondary,
    },
    skillTextRequired: {
      color: theme.colors.primary.cyan,
    },
    footer: {
      paddingHorizontal: theme.spacing[4],
      paddingBottom: theme.spacing[6],
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      marginBottom: theme.spacing[4],
    },
    applyButton: {
      flex: 2,
    },
    shareButton: {
      flex: 1,
    },
    contactInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    contactText: {
      fontSize: theme.typography.bodySmall.fontSize,
      color: theme.colors.text.secondary,
    },
    contactLink: {
      color: theme.colors.primary.cyan,
    },
  });

const JobDetailsScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { job } = route.params;
  const [hasApplied, setHasApplied] = useState(false);

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return theme.colors.status.success;
      case 'closed':
        return theme.colors.text.secondary;
      case 'urgent':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const handleApply = () => {
    if (hasApplied) {
      Alert.alert(
        'Already Applied',
        'You have already applied for this position.',
      );
      return;
    }

    Alert.alert(
      'Apply for Position',
      `Are you sure you want to apply for ${job.title} at ${job.company}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            setHasApplied(true);
            Alert.alert(
              'Application Sent',
              'Your application has been submitted successfully!',
            );
          },
        },
      ],
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Share Job',
      'Sharing functionality would be implemented here.',
    );
  };

  const handleContactEmail = () => {
    const email = job.contactEmail || 'hr@company.com';
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backButtonContent}>
              <Icon
                name="arrow-left"
                size={20}
                color={theme.colors.text.primary}
              />
              <Text style={styles.backButtonText}>Back</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>

          <View style={styles.quickInfo}>
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{job.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{job.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Salary:</Text>
                <Text style={styles.detailValue}>{job.salary}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View
                  style={[
                    styles.badgeContainer,
                    { backgroundColor: `${getStatusColor(job.status)}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.detailValue,
                      { color: getStatusColor(job.status) },
                    ]}
                  >
                    {job.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Content Sections */}
        <View style={styles.content}>
          {/* Job Description */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={[styles.sectionContent, styles.description]}>
              {job.description || 'No description available for this position.'}
            </Text>
          </View>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              <View style={styles.requirementsList}>
                {job.requirements.map((requirement, index) => (
                  <View key={index} style={styles.detailRow}>
                    <Text style={styles.requirementItem}>• </Text>
                    <Text style={styles.requirementText}>{requirement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Benefits */}
          {job.benefits && (
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Benefits & Perks</Text>
              <Text style={styles.benefitsText}>{job.benefits}</Text>
            </View>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Required Skills</Text>
              <View style={styles.skillsContainer}>
                {job.skills.map((skill, index) => (
                  <View
                    key={index}
                    style={[
                      styles.skillBadge,
                      skill.required && styles.skillBadgeRequired,
                    ]}
                  >
                    <Text
                      style={[
                        styles.skillText,
                        skill.required && styles.skillTextRequired,
                      ]}
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.actionButtons}>
          <Button
            variant={hasApplied ? 'secondary' : 'default'}
            onPress={handleApply}
            style={styles.applyButton}
            disabled={hasApplied}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </Button>
          <Button
            variant="outline"
            onPress={handleShare}
            style={styles.shareButton}
            icon={
              <Icon name="share" size={16} color={theme.colors.primary.cyan} />
            }
          >
            Share
          </Button>
        </View>

        <TouchableOpacity
          style={styles.contactInfo}
          onPress={handleContactEmail}
        >
          <Icon name="mail" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.contactText}>
            Contact:{' '}
            <Text style={styles.contactLink}>
              {job.contactEmail || 'hr@company.com'}
            </Text>
          </Text>
        </TouchableOpacity>

        {job.applicationDeadline && (
          <Text style={[styles.contactText, { marginTop: theme.spacing[2] }]}>
            Application Deadline: {job.applicationDeadline}
          </Text>
        )}

        {job.postedDate && (
          <Text style={styles.contactText}>Posted: {job.postedDate}</Text>
        )}
      </View>
    </View>
  );
};

export default JobDetailsScreen;
