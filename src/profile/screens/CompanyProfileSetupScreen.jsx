import React, { useState } from 'react';
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
import { companyService } from '../../services';
import { supabase } from '../../utils/supabase';

const CompanyProfileSetupScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { user, userRecord, updateUserRecord } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

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
    'Other'
  ];

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
      const phoneToSave = userRecord?.phone_number || user?.phone_number || user?.user_metadata?.phone_number;
      
      await updateUserRecord({
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.name,
        phone_number: phoneToSave,
        city: selectedCity.toLowerCase(),
        is_seeker: selectedRoles?.isSeeker || false,
      });

      // Create company profile using user.id from AuthContext
      const profile = {
        ...profileData,
        user_id: user.id,
      };

      const { data: createdProfile, error } = await companyService.createCompanyProfile(profile);

      if (error) {
        throw error;
      }

      // Navigate to success screen instead of directly to main
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
            {companySizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionButton,
                  profileData.company_size === size && styles.optionButtonSelected
                ]}
                onPress={() => setProfileData(prev => ({ ...prev, company_size: size }))}
              >
                <Text style={[
                  styles.optionButtonText,
                  profileData.company_size === size && styles.optionButtonTextSelected
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Industry Selection */}
          <Text style={styles.label}>Industry (Optional)</Text>
          <View style={styles.optionsContainer}>
            {industries.map((industry) => (
              <TouchableOpacity
                key={industry}
                style={[
                  styles.optionButton,
                  profileData.industry === industry && styles.optionButtonSelected
                ]}
                onPress={() => setProfileData(prev => ({ ...prev, industry: industry }))}
              >
                <Text style={[
                  styles.optionButtonText,
                  profileData.industry === industry && styles.optionButtonTextSelected
                ]}>
                  {industry}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Contact Email *"
            value={profileData.contact_email}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, contact_email: text }))
            }
            placeholder="contact@company.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Contact Phone (Optional)"
            value={profileData.contact_phone}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, contact_phone: text }))
            }
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
          />

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
            <Text style={styles.verificationText}>Verification Status: Not Verified</Text>
            <Text style={styles.verificationSubtext}>
              Your company will be verified by our team within 24-48 hours
            </Text>
          </View>
          
          <Button
            onPress={handleComplete}
            loading={isLoading}
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
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    optionButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
    },
    optionButtonSelected: {
      borderColor: theme?.colors?.primary?.main || '#3C4FE0',
      backgroundColor: theme?.colors?.primary?.main || '#3C4FE0',
    },
    optionButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: theme?.colors?.text?.secondary || '#64748B',
    },
    optionButtonTextSelected: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    verificationContainer: {
      marginTop: 20,
      padding: 16,
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
    },
    verificationText: {
      fontStyle: 'italic',
      color: theme?.colors?.text?.secondary || '#64748B',
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 4,
    },
    verificationSubtext: {
      color: theme?.colors?.text?.tertiary || '#94A3B8',
      fontSize: 12,
    },
    completeButton: {
      marginTop: 20,
    },
  });

export default CompanyProfileSetupScreen;