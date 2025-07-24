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
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { user, userRecord, updateUserRecord } = useAuth();

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
    setSelectedRoles(prev => ({
      isSeeker: role === 'isSeeker',
      isPoster: role === 'isPoster',
    }));
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
      // Update user record with role selections
      await updateUserRecord({
        is_seeker: selectedRoles.isSeeker,
      });

      // Navigate based on selected roles
      if (selectedRoles.isSeeker && selectedRoles.isPoster) {
        // User selected both roles - start with seeker profile
        navigation.navigate('SeekerProfileSetup', { selectedRoles });
      } else if (selectedRoles.isSeeker) {
        // User selected only seeker role
        navigation.navigate('SeekerProfileSetup', { selectedRoles });
      } else if (selectedRoles.isPoster) {
        // User selected only poster role
        navigation.navigate('CompanyProfileSetup', { selectedRoles });
      }
    } catch (error) {
      console.error('Error updating user roles:', error);
      Alert.alert(
        'Error',
        'Failed to save your role selection. Please try again.',
      );
    }
  };

  const styles = getStyles();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
            <Text style={styles.heroSubtitle}>
              Tell us what you'd like to do on our platform
            </Text>
          </View>
        </View>

        {/* Role Selection Section */}
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>
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
                <View style={[styles.roleIcon, { backgroundColor: '#3B82F6' }]}>
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

const getStyles = () =>
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
      borderColor: '#3B82F6',
      backgroundColor: '#EFF6FF',
      shadowColor: '#3B82F6',
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
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F6',
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
      shadowColor: '#3C4FE0',
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
  });

export default OnboardingScreen;
