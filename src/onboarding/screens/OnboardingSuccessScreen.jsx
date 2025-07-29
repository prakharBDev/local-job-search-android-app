import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CommonActions } from '@react-navigation/native';

const OnboardingSuccessScreen = () => {
  const navigation = useNavigation();
  const { user, userRecord, userRoles, updateUserRecord, checkAuthStatus } = useAuth();

  const userName =
    userRecord?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'FRIEND';

  useEffect(() => {
    const markOnboardingComplete = async () => {
      if (user?.id && !userRecord?.onboarding_completed) {
        try {
          await updateUserRecord({
            onboarding_completed: true,
            last_onboarding_step: 'completed',
          });
          await checkAuthStatus();
        } catch (error) {
          console.error('Error marking onboarding as completed:', error);
        }
      }
    };

    markOnboardingComplete();
  }, [user?.id, userRecord?.onboarding_completed, updateUserRecord, checkAuthStatus]);

  const handleGetStarted = async () => {
    try {
      await checkAuthStatus();
    } catch (error) {
      console.error('Error triggering auth status re-evaluation:', error);
    }
  };

  const handleViewProfile = async () => {
    // Navigate to the appropriate profile screen based on user role
    if (userRoles?.isSeeker) {
      navigation.navigate('Profile', { screen: 'EditProfile' });
    } else {
      navigation.navigate('Profile', { screen: 'CompanyProfileSetup' });
    }
  };

  const styles = getStyles();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <FontAwesome name="check" size={40} color="#FFFFFF" />
          </View>
        </View>

        {/* Success Message */}
        <View style={styles.content}>
          <Text style={styles.title}>Welcome, {userName}! 🎉</Text>
          <Text style={styles.subtitle}>
            Your profile has been set up successfully
          </Text>
          
          {/* Profile Type Badge */}
          <View style={styles.profileTypeContainer}>
            <Text style={styles.profileTypeText}>
              {userRoles.isSeeker ? '👤 Job Seeker Profile' : '🏢 Company Profile'}
            </Text>
          </View>

          {/* Profile Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Your Profile Summary:</Text>

            <View style={styles.summaryItem}>
              <FontAwesome name="map-marker" size={16} color="#6174f9" />
              <Text style={styles.summaryText}>
                Location:{' '}
                {userRecord?.city
                  ? userRecord.city.charAt(0).toUpperCase() +
                    userRecord.city.slice(1)
                  : 'Not set'}
              </Text>
            </View>

            {userRoles.isSeeker && (
              <View style={styles.summaryItem}>
                <FontAwesome name="search" size={16} color="#6174f9" />
                <Text style={styles.summaryText}>Job Seeker Profile ✓</Text>
              </View>
            )}

            {userRoles.isCompany && (
              <View style={styles.summaryItem}>
                <FontAwesome name="briefcase" size={16} color="#6174f9" />
                <Text style={styles.summaryText}>Company Profile ✓</Text>
              </View>
            )}
          </View>

          {/* Next Steps */}
          <View style={styles.nextStepsContainer}>
            <Text style={styles.nextStepsTitle}>What's Next?</Text>

            {userRoles.isSeeker && (
              <View style={styles.nextStepItem}>
                <FontAwesome name="search" size={16} color="#22C55E" />
                <Text style={styles.nextStepText}>
                  Browse and apply for jobs
                </Text>
              </View>
            )}

            {userRoles.isCompany && (
              <View style={styles.nextStepItem}>
                <FontAwesome name="plus-circle" size={16} color="#22C55E" />
                <Text style={styles.nextStepText}>
                  Create your first job posting
                </Text>
              </View>
            )}

            <View style={styles.nextStepItem}>
              <FontAwesome name="user" size={16} color="#22C55E" />
              <Text style={styles.nextStepText}>
                Complete your profile details
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button 
            onPress={handleGetStarted} 
            style={styles.getStartedButton}
            variant="cta"
          >
            Get Started
          </Button>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleViewProfile}
          >
            <Text style={styles.profileButtonText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getStyles = () =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    container: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: Math.max(24, screenWidth * 0.06),
      paddingTop: Math.min(20, screenHeight * 0.025),
      paddingBottom: Math.min(32, screenHeight * 0.04),
    },
    iconContainer: {
      alignItems: 'center',
      paddingVertical: Math.min(20, screenHeight * 0.025),
    },
    successIcon: {
      width: Math.min(100, screenWidth * 0.25),
      height: Math.min(100, screenWidth * 0.25),
      borderRadius: Math.min(50, screenWidth * 0.125),
      backgroundColor: '#22C55E',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#22C55E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    content: {
      paddingTop: Math.min(10, screenHeight * 0.0125),
    },
    title: {
      fontSize: Math.min(32, screenWidth * 0.08),
      fontWeight: 'bold',
      color: '#1E293B',
      textAlign: 'center',
      marginBottom: Math.min(12, screenHeight * 0.015),
    },
    subtitle: {
      fontSize: Math.min(18, screenWidth * 0.045),
      color: '#64748B',
      textAlign: 'center',
      marginBottom: Math.min(20, screenHeight * 0.025),
    },
    profileTypeContainer: {
      backgroundColor: '#F0F9FF',
      paddingHorizontal: Math.min(20, screenWidth * 0.05),
      paddingVertical: Math.min(12, screenHeight * 0.015),
      borderRadius: 20,
      alignSelf: 'center',
      marginBottom: Math.min(24, screenHeight * 0.03),
      borderWidth: 1,
      borderColor: '#BAE6FD',
    },
    profileTypeText: {
      fontSize: Math.min(16, screenWidth * 0.04),
      fontWeight: '600',
      color: '#1E293B',
      textAlign: 'center',
    },
    summaryContainer: {
      backgroundColor: '#F8FAFC',
      padding: Math.min(20, screenWidth * 0.05),
      borderRadius: 12,
      marginBottom: Math.min(24, screenHeight * 0.03),
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    summaryTitle: {
      fontSize: Math.min(18, screenWidth * 0.045),
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: Math.min(16, screenHeight * 0.02),
    },
    summaryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Math.min(8, screenHeight * 0.01),
      gap: Math.min(12, screenWidth * 0.03),
    },
    summaryText: {
      fontSize: Math.min(16, screenWidth * 0.04),
      color: '#475569',
      flex: 1,
    },
    nextStepsContainer: {
      backgroundColor: '#F0F9FF',
      padding: Math.min(20, screenWidth * 0.05),
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#BAE6FD',
      marginBottom: Math.min(32, screenHeight * 0.04),
    },
    nextStepsTitle: {
      fontSize: Math.min(18, screenWidth * 0.045),
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: Math.min(16, screenHeight * 0.02),
    },
    nextStepItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Math.min(8, screenHeight * 0.01),
      gap: Math.min(12, screenWidth * 0.03),
    },
    nextStepText: {
      fontSize: Math.min(16, screenWidth * 0.04),
      color: '#475569',
      flex: 1,
    },
    actions: {
      paddingBottom: Math.min(24, screenHeight * 0.03),
      gap: Math.min(16, screenHeight * 0.02),
    },
    getStartedButton: {
      minHeight: Math.min(56, screenHeight * 0.07),
      borderRadius: 12,
      shadowColor: '#6174f9',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    profileButton: {
      paddingVertical: Math.min(16, screenHeight * 0.02),
      alignItems: 'center',
    },
    profileButtonText: {
      fontSize: Math.min(16, screenWidth * 0.04),
      color: '#6174f9',
      fontWeight: '500',
    },
  });

export default OnboardingSuccessScreen;
