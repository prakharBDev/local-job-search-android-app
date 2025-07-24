import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import { seekerService, skillsService, categoriesService, onboardingService } from '../../services';
import { supabase } from '../../utils/supabase';

const SeekerProfileSetupScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { user, userRecord, updateUserRecord } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  // Initialize state from route params or defaults
  const [selectedSkills, setSelectedSkills] = useState(route.params?.selectedSkills || []);
  const [selectedCategories, setSelectedCategories] = useState(route.params?.selectedCategories || []);
  const [selectedCity, setSelectedCity] = useState(route.params?.selectedCity || '');

  // Get route params for navigation flow
  const { nextScreen, selectedRoles } = route.params || {};

  const cities = ['Morena', 'Gwalior'];
  const experienceLevels = ['fresher', 'entry', 'mid', 'senior'];

  const [profileData, setProfileData] = useState({
    experience_level: route.params?.experience_level || 'fresher',
    tenth_percentage: route.params?.tenth_percentage || '',
    twelfth_percentage: route.params?.twelfth_percentage || '',
    graduation_percentage: route.params?.graduation_percentage || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: skillsData } = await skillsService.getAllSkills();
        const { data: categoriesData } = await categoriesService.getAllCategories();
        setSkills(skillsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch initial data.');
      }
    };
    fetchData();
  }, []);

  // Listen for navigation focus to update data from selection screens
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Update all form data from route params if they exist
      if (route.params?.updatedSkills) {
        setSelectedSkills(route.params.updatedSkills);
      }
      if (route.params?.updatedCategories) {
        setSelectedCategories(route.params.updatedCategories);
      }
      if (route.params?.selectedCity) {
        setSelectedCity(route.params.selectedCity);
      }
      if (route.params?.experience_level) {
        setProfileData(prev => ({ ...prev, experience_level: route.params.experience_level }));
      }
      if (route.params?.tenth_percentage) {
        setProfileData(prev => ({ ...prev, tenth_percentage: route.params.tenth_percentage }));
      }
      if (route.params?.twelfth_percentage) {
        setProfileData(prev => ({ ...prev, twelfth_percentage: route.params.twelfth_percentage }));
      }
      if (route.params?.graduation_percentage) {
        setProfileData(prev => ({ ...prev, graduation_percentage: route.params.graduation_percentage }));
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);



  const validateForm = () => {
    if (!selectedCity) {
      Alert.alert('City Required', 'Please select your city.');
      return false;
    }
    if (selectedSkills.length === 0) {
      Alert.alert('Skills Required', 'Please select at least one skill.');
      return false;
    }
    if (selectedCategories.length === 0) {
      Alert.alert('Categories Required', 'Please select at least one job category.');
      return false;
    }
    return true;
  };

  const handleComplete = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // user.id comes from AuthContext, which is the single source of truth for authentication
      const phoneToSave = userRecord?.phone_number || user?.phone_number || user?.user_metadata?.phone_number;
      
      await updateUserRecord({
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.name,
        phone_number: phoneToSave,
        city: selectedCity.toLowerCase(),
        is_seeker: true,
      });

      // Check if seeker profile already exists
      const { data: existingProfile, error: checkError } = await seekerService.getSeekerProfile(user.id);
      
      let createdProfile;
      if (existingProfile) {
        const { data: updatedProfile, error: updateError } = await seekerService.updateSeekerProfile(existingProfile.id, profileData);
        if (updateError) throw updateError;
        createdProfile = updatedProfile;
      } else {
        // Create seeker profile using user.id from AuthContext
        const profile = {
          ...profileData,
          user_id: user.id,
        };

        const { data: newProfile, error } = await seekerService.createSeekerProfile(profile);
        if (error) throw error;
        createdProfile = newProfile;
      }

      // Add skills and categories (these methods now handle duplicates)
      const skillsResult = await seekerService.addSeekerSkills(createdProfile.id, selectedSkills.map(s => s.id));
      if (skillsResult.error) {
        console.warn('Warning: Some skills may not have been added:', skillsResult.error);
      }

      const categoriesResult = await seekerService.addSeekerCategories(createdProfile.id, selectedCategories.map(c => c.id));
      if (categoriesResult.error) {
        console.warn('Warning: Some categories may not have been added:', categoriesResult.error);
      }

      // Update onboarding status to mark this step as complete
      await onboardingService.updateOnboardingProgress(user.id, {
        onboarding_completed: true,
        last_onboarding_step: 'seeker_profile_complete'
      });

      if (nextScreen && selectedRoles?.isPoster) {
        navigation.replace('CompanyProfileSetup', { selectedRoles });
      } else {
        // Navigate to success screen instead of directly to main
        navigation.replace('OnboardingSuccess');
      }
    } catch (error) {
      console.error('Profile setup error:', error);
      Alert.alert('Error', 'Failed to set up your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Seeker Profile Setup</Text>
          
          {/* City Selection */}
          <Text style={styles.label}>Select Your City *</Text>
          <View style={styles.cityContainer}>
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityButton,
                  selectedCity === city && styles.cityButtonSelected
                ]}
                onPress={() => setSelectedCity(city)}
              >
                <Text style={[
                  styles.cityButtonText,
                  selectedCity === city && styles.cityButtonTextSelected
                ]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Experience Level */}
          <Text style={styles.label}>Experience Level *</Text>
          <View style={styles.experienceContainer}>
            {experienceLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.experienceButton,
                  profileData.experience_level === level && styles.experienceButtonSelected
                ]}
                onPress={() => setProfileData(prev => ({ ...prev, experience_level: level }))}
              >
                <Text style={[
                  styles.experienceButtonText,
                  profileData.experience_level === level && styles.experienceButtonTextSelected
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Education Details */}
          <Input
            label="10th Percentage (Optional)"
            value={profileData.tenth_percentage}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, tenth_percentage: text }))
            }
            placeholder="e.g., 85.5"
            keyboardType="decimal-pad"
          />
          <Input
            label="12th Percentage (Optional)"
            value={profileData.twelfth_percentage}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, twelfth_percentage: text }))
            }
            placeholder="e.g., 78.2"
            keyboardType="decimal-pad"
          />
          <Input
            label="Graduation Percentage (Optional)"
            value={profileData.graduation_percentage}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, graduation_percentage: text }))
            }
            placeholder="e.g., 82.1"
            keyboardType="decimal-pad"
          />

          {/* Skills Selection */}
          <Text style={styles.label}>Skills *</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() =>
              navigation.navigate('SkillsSelection', {
                selectedSkills,
                // Pass all current form data to preserve state
                selectedCity,
                selectedCategories,
                experience_level: profileData.experience_level,
                tenth_percentage: profileData.tenth_percentage,
                twelfth_percentage: profileData.twelfth_percentage,
                graduation_percentage: profileData.graduation_percentage,
                nextScreen,
                selectedRoles,
              })
            }
          >
            <Text style={styles.selectionButtonText}>
              {selectedSkills.length > 0 
                ? `${selectedSkills.length} skills selected` 
                : 'Select your skills'
              }
            </Text>
          </TouchableOpacity>

          {/* Job Categories Selection */}
          <Text style={styles.label}>Job Categories *</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() =>
              navigation.navigate('CategorySelection', {
                selectedCategories,
                // Pass all current form data to preserve state
                selectedCity,
                selectedSkills,
                experience_level: profileData.experience_level,
                tenth_percentage: profileData.tenth_percentage,
                twelfth_percentage: profileData.twelfth_percentage,
                graduation_percentage: profileData.graduation_percentage,
                nextScreen,
                selectedRoles,
              })
            }
          >
            <Text style={styles.selectionButtonText}>
              {selectedCategories.length > 0 
                ? `${selectedCategories.length} categories selected` 
                : 'Select job categories'
              }
            </Text>
          </TouchableOpacity>

          <Button
            onPress={handleComplete}
            loading={isLoading}
            style={styles.completeButton}
          >
            {nextScreen ? 'Continue to Company Profile' : 'Complete Setup'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 10,
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    cityContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    cityButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
      alignItems: 'center',
    },
    cityButtonSelected: {
      borderColor: theme?.colors?.primary?.main || '#3C4FE0',
      backgroundColor: theme?.colors?.primary?.main || '#3C4FE0',
    },
    cityButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme?.colors?.text?.secondary || '#64748B',
    },
    cityButtonTextSelected: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    experienceContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    experienceButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
    },
    experienceButtonSelected: {
      borderColor: theme?.colors?.primary?.main || '#3C4FE0',
      backgroundColor: theme?.colors?.primary?.main || '#3C4FE0',
    },
    experienceButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme?.colors?.text?.secondary || '#64748B',
    },
    experienceButtonTextSelected: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    selectionButton: {
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
    },
    selectionButtonText: {
      fontSize: 14,
      color: theme?.colors?.text?.secondary || '#64748B',
    },
    completeButton: {
      marginTop: 20,
    },
  });

export default SeekerProfileSetupScreen;