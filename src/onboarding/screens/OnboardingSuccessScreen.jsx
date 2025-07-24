import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const OnboardingSuccessScreen = () => {
  const navigation = useNavigation();
  const { user, userRecord, userRoles, updateUserRecord } = useAuth();

  const userName =
    userRecord?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'FRIEND';

  // Ensure onboarding is marked as completed when this screen is reached
  useEffect(() => {
    const markOnboardingComplete = async () => {
      console.log('🎉 [OnboardingSuccess] Screen loaded, checking completion status:', {
        userId: user?.id,
        onboardingCompleted: userRecord?.onboarding_completed,
        userName: userName,
        userRoles: {
          isSeeker: userRoles.isSeeker,
          isCompany: userRoles.isCompany
        }
      });

      if (user?.id && !userRecord?.onboarding_completed) {
        console.log('🎯 [OnboardingSuccess] Onboarding not marked complete, updating now');
        try {
          await updateUserRecord({
            onboarding_completed: true,
            last_onboarding_step: 'completed',
          });
          console.log('✅ [OnboardingSuccess] Successfully marked onboarding as completed');
        } catch (error) {
          console.error('❌ [OnboardingSuccess] Error marking onboarding as completed:', error);
        }
      } else if (userRecord?.onboarding_completed) {
        console.log('✅ [OnboardingSuccess] Onboarding already marked as completed');
      } else {
        console.log('⚠️ [OnboardingSuccess] No user ID available, cannot mark completion');
      }
    };

    markOnboardingComplete();
  }, [user?.id, userRecord?.onboarding_completed, updateUserRecord]);

  const handleGetStarted = () => {
    // Navigate to the main app using replace to clear the navigation stack
    navigation.replace('Main');
  };

  const styles = getStyles();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
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
              <FontAwesome name="map-marker" size={16} color="#3C4FE0" />
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
                <FontAwesome name="search" size={16} color="#3C4FE0" />
                <Text style={styles.summaryText}>Job Seeker Profile ✓</Text>
              </View>
            )}

            {userRoles.isCompany && (
              <View style={styles.summaryItem}>
                <FontAwesome name="briefcase" size={16} color="#3C4FE0" />
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
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileButtonText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = () =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
    },
    iconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    successIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
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
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1E293B',
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 18,
      color: '#64748B',
      textAlign: 'center',
      marginBottom: 20,
    },
    profileTypeContainer: {
      backgroundColor: '#F0F9FF',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      alignSelf: 'center',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#BAE6FD',
    },
    profileTypeText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1E293B',
      textAlign: 'center',
    },
    summaryContainer: {
      backgroundColor: '#F8FAFC',
      padding: 20,
      borderRadius: 12,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 16,
    },
    summaryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 12,
    },
    summaryText: {
      fontSize: 16,
      color: '#475569',
      flex: 1,
    },
    nextStepsContainer: {
      backgroundColor: '#F0F9FF',
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#BAE6FD',
      marginBottom: 32,
    },
    nextStepsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 16,
    },
    nextStepItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 12,
    },
    nextStepText: {
      fontSize: 16,
      color: '#475569',
      flex: 1,
    },
    actions: {
      paddingBottom: 24,
      gap: 16,
    },
    getStartedButton: {
      minHeight: 56,
      borderRadius: 12,
      shadowColor: '#3C4FE0',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    profileButton: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    profileButtonText: {
      fontSize: 16,
      color: '#3C4FE0',
      fontWeight: '500',
    },
  });

export default OnboardingSuccessScreen;
