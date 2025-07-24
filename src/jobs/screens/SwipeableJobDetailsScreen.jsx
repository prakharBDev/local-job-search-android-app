import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  applicationService, 
  seekerService,
  jobService 
} from '../../services';
import { Icon } from '../../components/elements';
import { getStyles } from './SwipeableJobDetailsScreen.styles';

const SwipeableJobDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobData } = route.params || {};
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState(null);
  const [jobDetails, setJobDetails] = useState(jobData);
  const [activeTab, setActiveTab] = useState('description');

  // Load seeker profile and check application status
  useEffect(() => {
    const loadSeekerData = async () => {
      if (user?.id) {
        try {
          const { data: profile, error } = await seekerService.getSeekerProfile(user.id);
          if (profile && !error) {
            setSeekerProfile(profile);
            
            // Check if user has already applied
            if (jobDetails?.id) {
              const { data: applicationData } = await applicationService.hasApplied(
                jobDetails.id, 
                profile.id
              );
              setHasApplied(!!applicationData);
            }
          }
        } catch (error) {
          console.error('Error loading seeker data:', error);
        }
      }
    };

    loadSeekerData();
  }, [user, jobDetails]);

  // Load full job details if only basic data was passed
  useEffect(() => {
    const loadJobDetails = async () => {
      if (jobDetails?.id && !jobDetails.company_profiles) {
        try {
          setLoading(true);
          const { data: fullJobData, error } = await jobService.getJobById(jobDetails.id);
          if (fullJobData && !error) {
            setJobDetails(fullJobData);
          }
        } catch (error) {
          console.error('Error loading job details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadJobDetails();
  }, [jobDetails?.id]);

  const handleApply = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to apply for jobs');
      return;
    }

    if (!seekerProfile?.id) {
      Alert.alert('Profile Required', 'Please complete your seeker profile before applying for jobs');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await applicationService.createApplication({
        job_id: jobDetails.id,
        seeker_id: seekerProfile.id,
        message: '', // No message input for now
      });
      
      if (error) {
        throw error;
      }
      
      setHasApplied(true);
      Alert.alert('Success', 'Application submitted successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
      console.error('Error applying for job:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format salary as monthly amount
  const formatSalary = (salary) => {
    if (!salary) return 'Salary not specified';
    
    // Handle salary ranges like "₹12,00,000 – ₹18,00,000/year"
    if (salary.includes('–') || salary.includes('-')) {
      // Extract the first number (lower range) and convert to monthly
      const firstNumber = salary.match(/₹([\d,]+)/);
      if (firstNumber) {
        const numericSalary = firstNumber[1].replace(/,/g, '');
        const yearlySalary = parseInt(numericSalary);
        const monthlySalary = Math.round(yearlySalary / 12);
        return `₹${monthlySalary.toLocaleString()}/month`;
      }
    }
    
    // Handle single salary values
    const numericSalary = salary.replace(/[^\d]/g, '');
    if (!numericSalary) return salary;
    
    // Assume yearly salary, convert to monthly (divide by 12)
    const yearlySalary = parseInt(numericSalary);
    const monthlySalary = Math.round(yearlySalary / 12);
    
    // Format with commas
    return `₹${monthlySalary.toLocaleString()}/month`;
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-triangle" size={48} color={theme?.colors?.status?.error || '#EF4444'} />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme?.colors?.primary?.main || '#6475f8'} />
        </View>
      </SafeAreaView>
    );
  }

  if (!jobDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>No job details available</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Use real job data with fallbacks
  const safeJob = {
    ...jobDetails,
    company: jobDetails.company_profiles?.company_name || jobDetails.company || 'Unknown Company',
    title: jobDetails.title || 'Job Title',
    location: jobDetails.city || jobDetails.location || 'Location',
    type: jobDetails.type || 'Full Time',
    salary: jobDetails.salary || 'Salary not specified',
    description: jobDetails.description || 'No description available.',
    requirements: jobDetails.requirements || ['No specific requirements listed'],
    companyLogo: jobDetails.companyLogo || 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header with Purple Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.purpleBackButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton}>
          <Icon name="help-circle" size={24} color={theme?.colors?.text?.primary || '#1F2937'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Company Logo and Name - Centered */}
        <View style={styles.companySection}>
          <Image 
            source={{ uri: safeJob.companyLogo }} 
            style={styles.companyLogo}
            defaultSource={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }}
          />
          <Text style={styles.companyName}>{safeJob.company}</Text>
          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={16} color={theme?.colors?.text?.secondary || '#6B7280'} />
            <Text style={styles.locationText}>{safeJob.location}</Text>
          </View>
        </View>

        {/* Job Title - More Prominent */}
        <Text style={styles.jobTitle}>{safeJob.title}</Text>

        {/* Job Tags - Pill-shaped UI with proper purple coloring */}
        <View style={styles.jobTags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{safeJob.type}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{formatSalary(safeJob.salary)}</Text>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          {['description', 'company', 'review'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'description' && (
            <View>
              <Text style={styles.sectionTitle}>Minimum Qualification</Text>
              {safeJob.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <View style={styles.requirementBullet} />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          )}
          
          {activeTab === 'company' && (
            <View>
              <Text style={styles.sectionTitle}>About {safeJob.company}</Text>
              <Text style={styles.descriptionText}>
                {safeJob.company} is a leading company in their industry, 
                committed to innovation and excellence. We provide a dynamic work 
                environment where employees can grow and thrive.
              </Text>
            </View>
          )}
          
          {activeTab === 'review' && (
            <View>
              <Text style={styles.sectionTitle}>Company Reviews</Text>
              <Text style={styles.descriptionText}>
                Reviews and ratings will be displayed here once the review system is implemented.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Apply Button - Fixed at bottom */}
      <View style={styles.applyContainer}>
        <TouchableOpacity 
          style={[styles.applyButton, hasApplied && styles.appliedButton]} 
          onPress={handleApply}
          disabled={hasApplied || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.applyButtonText}>
              {hasApplied ? 'Applied' : 'Apply Now'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SwipeableJobDetailsScreen; 