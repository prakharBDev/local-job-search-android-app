import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../contexts/ThemeContext';
import { onboardingService } from '../../services';
import DebugUtils from '../../utils/debug';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { user, userRecord, updateUserRecord, checkAuthStatus } = useAuth();
  const { theme } = useTheme();

  // Get user name from authentication data
  const userName =
    userRecord?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'FRIEND';

  const [selectedRoles, setSelectedRoles] = useState({
    isSeeker: false,
    isPoster: false,
  });

  const toggleRole = role => {
    setSelectedRoles({
      isSeeker: role === 'isSeeker',
      isPoster: role === 'isPoster',
    });
  };

  const handleBackToCitySelection = () => {
    Alert.alert(
      'Go Back to City Selection',
      'Are you sure you want to go back to city selection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Go Back',
          onPress: async () => {
            try {
              
              // Reset city selection and role to force back to city selection
              const updateResult = await updateUserRecord({ 
                city: null,
                is_seeker: null
              });
              
              // Clear onboarding cache to force fresh check
              onboardingService.clearOnboardingCache(user.id);
              
              // Force a re-check of onboarding status
              await checkAuthStatus();
              
              // Give a moment for the state to update and check navigation states
              setTimeout(async () => {
                
                // Force another onboarding status check
                try {
                  const statusResult = await onboardingService.getOnboardingStatus(user.id);
                  
                  // Trigger another auth check if needed
                  if (statusResult?.status?.needsCitySelection) {
                    await checkAuthStatus();
                  }
                } catch (statusError) {
                  console.error('Error checking fresh status:', statusError);
                }
              }, 2000);
              
            } catch (error) {
              // Store error for debugging in release builds
              await DebugUtils.logError('OnboardingScreen', 'handleBackToCitySelection', error, {
                userId: user?.id,
                userRecord: userRecord,
              });
              
              console.error('Error resetting city selection:', error);
              Alert.alert(
                'Error',
                'Failed to go back to city selection. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const handleContinue = async () => {
    if (!selectedRoles.isSeeker && !selectedRoles.isPoster) {
      Alert.alert(
        'Selection Required',
        'Please select at least one role to continue.',
      );
      return;
    }

    try {
      // Determine the role to save (prioritize seeker if both selected)
      const isSeeker = selectedRoles.isSeeker;
      
      // Update user record with role selection
      const updateResult = await updateUserRecord({
        is_seeker: isSeeker,
        last_onboarding_step: 'role_selected',
      });

      if (updateResult.error) {
        throw new Error(updateResult.error);
      }

      // Clear onboarding cache to force fresh check
      onboardingService.clearOnboardingCache(user.id);

      // Navigate based on selected role
      if (isSeeker) {
        // User selected seeker role
        navigation.navigate('SeekerProfileSetup', { selectedRoles });
      } else {
        // User selected poster role
        navigation.navigate('CompanyProfileSetup', { selectedRoles });
      }
    } catch (error) {
      // Store error for debugging in release builds
      await DebugUtils.logError('OnboardingScreen', 'handleContinue', error, {
        selectedRoles,
        userId: user?.id,
      });
      
      console.error('Error updating user roles:', error);
      Alert.alert(
        'Error',
        'Failed to save your role selection. Please try again.',
      );
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackToCitySelection}
      >
        <Feather name="arrow-left" size={24} color={theme?.colors?.text?.primary || '#1E293B'} />
      </TouchableOpacity>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Image */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../assets/onboarding_screen.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <View style={styles.heroContent}>
            <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
            <Text style={styles.heroTitle}>Choose Your Path</Text>
          </View>
        </View>

        {/* Role Selection Section */}
        <View style={styles.selectionSection}>
          <Text style={styles.sectionSubtitle}>
            Choose one option to get started
          </Text>

          {/* Role Cards */}
          <View style={styles.roleCardsContainer}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRoles.isSeeker && styles.roleCardSelected,
              ]}
              onPress={() => toggleRole('isSeeker')}
              activeOpacity={0.7}
            >
              <View style={styles.roleCardHeader}>
                <View style={[styles.roleIcon, { backgroundColor: theme?.colors?.primary?.main || '#6174f9' }]}>
                  <FontAwesome name="search" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.roleCheckbox}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedRoles.isSeeker && styles.checkboxSelected,
                    ]}
                  >
                    {selectedRoles.isSeeker && (
                      <FontAwesome name="check" size={10} color="#FFFFFF" />
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.roleCardContent}>
                <Text style={styles.roleTitle}>Find Jobs</Text>
                <Text style={styles.roleDescription}>
                  Browse and apply for job opportunities in your area
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRoles.isPoster && styles.roleCardSelected,
              ]}
              onPress={() => toggleRole('isPoster')}
              activeOpacity={0.7}
            >
              <View style={styles.roleCardHeader}>
                <View style={[styles.roleIcon, { backgroundColor: '#10B981' }]}>
                  <FontAwesome name="briefcase" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.roleCheckbox}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedRoles.isPoster && styles.checkboxSelected,
                    ]}
                  >
                    {selectedRoles.isPoster && (
                      <FontAwesome name="check" size={10} color="#FFFFFF" />
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.roleCardContent}>
                <Text style={styles.roleTitle}>Post Jobs</Text>
                <Text style={styles.roleDescription}>
                  Create and manage job listings for your business
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleContinue}
              disabled={!selectedRoles.isSeeker && !selectedRoles.isPoster}
              variant="primary"
              size="lg"
              fullWidth={true}
              style={styles.continueButton}
              textStyle={styles.buttonText}
            >
              Continue
            </Button>

            <Text style={styles.helperText}>
              You can add the other role later in your profile settings
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    heroSection: {
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 24,
      paddingHorizontal: 24,
    },
    heroImage: {
      width: '100%',
      height: 280,
      marginBottom: 24,
    },
    heroContent: {
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6B7280',
      marginBottom: 8,
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1F2937',
      textAlign: 'center',
      marginBottom: 8,
    },
    heroSubtitle: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
    },
    selectionSection: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F2937',
      textAlign: 'center',
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 32,
    },
    roleCardsContainer: {
      gap: 16,
      marginBottom: 32,
    },
    roleCard: {
      backgroundColor: '#F9FAFB',
      borderRadius: 16,
      padding: 20,
      borderWidth: 2,
      borderColor: '#E5E7EB',
    },
    roleCardSelected: {
      borderColor: theme?.colors?.primary?.main || '#6174f9',
      backgroundColor: '#EFF6FF',
      shadowColor: theme?.colors?.primary?.main || '#6174f9',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    roleCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    roleIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    roleCheckbox: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#D1D5DB',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    checkboxSelected: {
      borderColor: theme?.colors?.primary?.main || '#6174f9',
      backgroundColor: theme?.colors?.primary?.main || '#6174f9',
    },
    roleCardContent: {
      flex: 1,
    },
    roleTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 8,
    },
    roleDescription: {
      fontSize: 16,
      color: '#6B7280',
      lineHeight: 24,
    },
    buttonContainer: {
      alignItems: 'center',
      paddingHorizontal: 0,
      marginTop: 24,
      width: '100%',
    },
    continueButton: {
      marginBottom: 16,
      borderRadius: 16,
      shadowColor: '#6174f9',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: 0.5,
      flex: 1,
      textAlignVertical: 'center',
    },
    helperText: {
      fontSize: 14,
      color: '#9CA3AF',
      textAlign: 'center',
      lineHeight: 20,
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });

export default OnboardingScreen;
