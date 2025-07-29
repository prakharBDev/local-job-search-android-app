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
import { companyService, onboardingService } from '../../services';
import { supabase } from '../../utils/supabase';

const CompanyProfileSetupScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { user, userRecord, updateUserRecord } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [userDataFromDB, setUserDataFromDB] = useState(null);

  // Get route params for navigation flow
  const { selectedRoles } = route.params || {};

  const cities = ['Morena', 'Gwalior'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Real Estate',
    'Transportation',
    'Food & Beverage',
    'Other',
  ];

  // Get user data from Google login and database
  const userEmail = user?.email || userRecord?.email || userDataFromDB?.email || '';
  const userName = userRecord?.name || userDataFromDB?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  // Remove +91 prefix from phone number for display since Input component adds it
  const userPhone = (userRecord?.phone_number || userDataFromDB?.phone_number) ? 
    (userRecord?.phone_number || userDataFromDB?.phone_number).replace(/^\+91\s*/, '') : '';



  // Fetch user data from database if not available in context
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }
        
        setUserDataFromDB(data);
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      }
    };

    fetchUserData();
  }, [user?.id]);

  // Update profile data when user data is available
  useEffect(() => {
    if (userDataFromDB) {
      const email = userDataFromDB.email || user?.email || '';
      const name = userDataFromDB.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
      const phone = userDataFromDB.phone_number ? userDataFromDB.phone_number.replace(/^\+91\s*/, '') : '';
      
      setProfileData(prev => ({
        ...prev,
        company_name: name ? `${name}'s Organisation` : '',
        contact_email: email,
        contact_phone: phone,
      }));
    }
  }, [userDataFromDB, user]);

  const [profileData, setProfileData] = useState({
    company_name: '',
    company_description: '',
    company_size: '',
    industry: '',
    contact_email: '',
    contact_phone: '',
    website: '',
  });

  const validateForm = () => {
    if (!selectedCity) {
      Alert.alert('City Required', 'Please select your city.');
      return false;
    }
    if (!profileData.company_name.trim()) {
      Alert.alert('Company Name Required', 'Please enter your company name.');
      return false;
    }
    if (!profileData.contact_email.trim()) {
      Alert.alert('Contact Email Required', 'Please enter a contact email.');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.contact_email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
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
      const phoneToSave =
        userRecord?.phone_number ||
        user?.phone_number ||
        user?.user_metadata?.phone_number;


      await updateUserRecord({
        name:
          user?.user_metadata?.full_name ||
          user?.email?.split('@')[0] ||
          user?.name,
        phone_number: phoneToSave,
        city: selectedCity.toLowerCase(),
        is_seeker: selectedRoles?.isSeeker || false,
      });


      // Create company profile using user.id from AuthContext
      // Only include fields that exist in the company_profiles table schema
      const profile = {
        user_id: user.id,
        company_name: profileData.company_name,
        company_description: profileData.company_description,
        contact_email: profileData.contact_email,
      };

      // Check if company profile already exists and update it instead of creating new
      const { data: existingProfile } = await companyService.getCompanyProfile(user.id);
      
      let profileResult;
      if (existingProfile) {
        profileResult = await companyService.updateCompanyProfile(existingProfile.id, {
          company_name: profile.company_name,
          company_description: profile.company_description,
          contact_email: profile.contact_email,
        });
      } else {
        profileResult = await companyService.createCompanyProfile(profile);
      }

      const { data: finalProfile, error } = profileResult;

      if (error) {
        console.error('Company profile operation failed:', error);
        throw error;
      }


      // Clear onboarding cache to force fresh check
      onboardingService.clearOnboardingCache(user.id);

      // Mark onboarding as completed (this is the final step)
      await updateUserRecord({
        onboarding_completed: true,
        last_onboarding_step: 'completed',
      });

      // Navigate to success screen
      navigation.replace('OnboardingSuccess');
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
          <Text style={styles.title}>Company Profile Setup</Text>
          <Text style={styles.subtitle}>
            Tell us about your company to get started
          </Text>

          {/* City Selection */}
          <Text style={styles.label}>Select Your City *</Text>
          <View style={styles.cityContainer}>
            {cities.map(city => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityButton,
                  selectedCity === city && styles.cityButtonSelected,
                ]}
                onPress={() => setSelectedCity(city)}
              >
                <Text
                  style={[
                    styles.cityButtonText,
                    selectedCity === city && styles.cityButtonTextSelected,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Company Name *"
            value={profileData.company_name}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, company_name: text }))
            }
            placeholder="Your Company Name"
          />

          <Input
            label="Company Description (Optional)"
            value={profileData.company_description}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, company_description: text }))
            }
            placeholder="What your company does"
            multiline
            numberOfLines={3}
          />

          {/* Company Size Selection */}
          <Text style={styles.label}>Company Size (Optional)</Text>
          <View style={styles.optionsContainer}>
            {companySizes.map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionButton,
                  profileData.company_size === size &&
                    styles.optionButtonSelected,
                ]}
                onPress={() =>
                  setProfileData(prev => ({ ...prev, company_size: size }))
                }
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    profileData.company_size === size &&
                      styles.optionButtonTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Industry Selection */}
          <Text style={styles.label}>Industry (Optional)</Text>
          <View style={styles.optionsContainer}>
            {industries.map(industry => (
              <TouchableOpacity
                key={industry}
                style={[
                  styles.optionButton,
                  profileData.industry === industry &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => setProfileData(prev => ({ ...prev, industry }))}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    profileData.industry === industry &&
                      styles.optionButtonTextSelected,
                  ]}
                >
                  {industry}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Contact Email *"
            value={profileData.contact_email}
            placeholder="contact@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.prefilledInput}
            editable={false}
          />
          <Text style={styles.helperText}>
            Pre-filled from your Google account (read-only)
          </Text>

          <Input
            label="Contact Phone"
            value={profileData.contact_phone}
            placeholder="98765 43210"
            keyboardType="phone-pad"
            prefix="+91 "
            style={styles.prefilledInput}
            editable={false}
          />
          <Text style={styles.helperText}>
            Pre-filled from your login details (read-only)
          </Text>

          <Input
            label="Website (Optional)"
            value={profileData.website}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, website: text }))
            }
            placeholder="https://www.company.com"
            keyboardType="url"
            autoCapitalize="none"
          />

          <View style={styles.verificationContainer}>
            <Text style={styles.verificationText}>
              Verification Status: Not Verified
            </Text>
            <Text style={styles.verificationSubtext}>
              Your company will be verified by our team within 24-48 hours
            </Text>
          </View>

          <Button
            onPress={handleComplete}
            loading={isLoading}
            variant="cta"
            style={styles.completeButton}
          >
            Complete Setup
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
      backgroundColor: theme?.colors?.background?.primary || '#F8FAFC',
    },
    content: {
      padding: 24,
      paddingTop: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: 8,
      color: theme?.colors?.text?.primary || '#0F172A',
      textAlign: 'center',
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 32,
      color: theme?.colors?.text?.secondary || '#475569',
      textAlign: 'center',
      lineHeight: 24,
    },
    label: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 24,
      marginBottom: 12,
      color: theme?.colors?.text?.primary || '#0F172A',
      letterSpacing: -0.2,
    },
    cityContainer: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 24,
    },
    cityButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme?.colors?.interactive?.border?.primary || '#E2E8F0',
      backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    cityButtonSelected: {
      borderColor: theme?.colors?.primary?.main || '#6174f9',
      backgroundColor: theme?.colors?.primary?.main || '#6174f9',
      shadowColor: theme?.colors?.primary?.main || '#6174f9',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    cityButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme?.colors?.text?.secondary || '#64748B',
    },
    cityButtonTextSelected: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 24,
    },
    optionButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme?.colors?.interactive?.border?.primary || '#E2E8F0',
      backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    optionButtonSelected: {
      borderColor: theme?.colors?.primary?.main || '#6174f9',
      backgroundColor: theme?.colors?.primary?.main || '#6174f9',
      shadowColor: theme?.colors?.primary?.main || '#6174f9',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    optionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme?.colors?.text?.secondary || '#64748B',
    },
    optionButtonTextSelected: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    verificationContainer: {
      marginTop: 24,
      padding: 20,
      backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme?.colors?.interactive?.border?.primary || '#E2E8F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    verificationText: {
      fontStyle: 'italic',
      color: theme?.colors?.text?.secondary || '#64748B',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 6,
    },
    verificationSubtext: {
      color: theme?.colors?.text?.tertiary || '#94A3B8',
      fontSize: 14,
      lineHeight: 20,
    },
    completeButton: {
      marginTop: 32,
      marginBottom: 24,
    },
    prefilledInput: {
      backgroundColor: theme?.colors?.background?.tertiary || '#F8FAFC',
      borderColor: theme?.colors?.interactive?.border?.secondary || '#E2E8F0',
      opacity: 1,
      color: theme?.colors?.text?.primary || '#1E293B',
      fontWeight: '500',
    },
    helperText: {
      fontSize: 13,
      color: theme?.colors?.text?.secondary || '#64748B',
      marginTop: 6,
      marginBottom: 12,
      fontStyle: 'italic',
      fontWeight: '400',
      lineHeight: 18,
    },
  });

export default CompanyProfileSetupScreen;
