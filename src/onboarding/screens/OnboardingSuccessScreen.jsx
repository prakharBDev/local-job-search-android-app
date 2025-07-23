import React from 'react';
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
  const { user, userRecord, userRoles } = useAuth();
  
  const userName = userRecord?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'FRIEND';

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

          {/* Profile Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Your Profile Summary:</Text>
            
            <View style={styles.summaryItem}>
              <FontAwesome name="map-marker" size={16} color="#3C4FE0" />
              <Text style={styles.summaryText}>
                Location: {userRecord?.city ? userRecord.city.charAt(0).toUpperCase() + userRecord.city.slice(1) : 'Not set'}
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
                <Text style={styles.nextStepText}>Browse and apply for jobs</Text>
              </View>
            )}

            {userRoles.isCompany && (
              <View style={styles.nextStepItem}>
                <FontAwesome name="plus-circle" size={16} color="#22C55E" />
                <Text style={styles.nextStepText}>Create your first job posting</Text>
              </View>
            )}

            <View style={styles.nextStepItem}>
              <FontAwesome name="user" size={16} color="#22C55E" />
              <Text style={styles.nextStepText}>Complete your profile details</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            onPress={handleGetStarted}
            style={styles.getStartedButton}
          >
            <Text style={styles.buttonText}>Get Started</Text>
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

const getStyles = () => StyleSheet.create({
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  nextStepsContainer: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  nextStepText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  actions: {
    paddingBottom: 24,
    gap: 12,
  },
  getStartedButton: {
    minHeight: 56,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 14,
    color: '#3C4FE0',
    fontWeight: '500',
  },
});

export default OnboardingSuccessScreen; 