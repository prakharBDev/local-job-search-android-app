import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import { companyService } from '../../services';

const CompanyProfileSetupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    company_name: '',
    company_description: '',
  });

  const handleComplete = async () => {
    if (!profileData.company_name.trim()) {
      Alert.alert('Company name is required');
      return;
    }
    setIsLoading(true);
    try {
      const profile = {
        ...profileData,
        user_id: user.id,
      };
      const { data: createdProfile, error } = await companyService.createCompanyProfile(profile);

      if (error) {
        throw error;
      }

      navigation.navigate('Dashboard');
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
          <Input
            label="Company Name"
            value={profileData.company_name}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, company_name: text }))
            }
            placeholder="Your Company Name"
          />
          <Input
            label="Company Description"
            value={profileData.company_description}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, company_description: text }))
            }
            placeholder="What your company does"
            multiline
          />
          <View style={styles.verificationContainer}>
            <Text style={styles.verificationText}>Verification Status: Not Verified</Text>
          </View>
          <Button
            onPress={handleComplete}
            loading={isLoading}
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
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.text.primary,
    },
    verificationContainer: {
      marginTop: 20,
      padding: 10,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 8,
    },
    verificationText: {
      fontStyle: 'italic',
      color: theme.colors.text.secondary,
    },
  });

export default CompanyProfileSetupScreen;