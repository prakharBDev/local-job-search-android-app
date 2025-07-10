import React, { useState, useEffect } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../components/elements/Button';
import Card from '../../components/blocks/Card';
import { theme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { getStyles } from './CreateJobScreen.styles.js';
import { useAuth } from '../../contexts/AuthContext';
import { jobService, categoriesService, companyService } from '../../utils/database';
import { seedDatabase, checkSeedingStatus } from '../../utils/seedData';

const CreateJobScreen = () => {
  const navigation = useNavigation();
  const { state } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    category_id: '',
    city: state.userRecord?.city || 'morena',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [companyProfile, setCompanyProfile] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadInitialData = async () => {
    try {
      // Check if seeding is needed and seed if necessary
      const seedingStatus = await checkSeedingStatus();
      if (seedingStatus.needsCategories || seedingStatus.needsSkills) {
        console.log('Seeding database with initial data...');
        await seedDatabase();
      }

      // Load categories
      const { data: categoriesData, error: categoriesError } = await categoriesService.getAllCategories();
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Load company profile
      if (state.user?.id) {
        const { data: company, error: companyError } = await companyService.getCompanyProfile(state.user.id);
        if (companyError && companyError.code !== 'PGRST116') {
          throw companyError;
        }
        setCompanyProfile(company);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load initial data. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!companyProfile) {
      newErrors.company = 'Company profile is required to post jobs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const jobData = {
        company_id: companyProfile.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        salary: formData.salary.trim() || null,
        category_id: formData.category_id || null,
        city: formData.city,
        is_active: true,
      };

      const { error } = await jobService.createJob(jobData);

      if (error) throw error;

      Alert.alert(
        'Success',
        'Job posted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error('Error creating job:', error);
      Alert.alert('Error', 'Failed to create job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <SafeAreaView style={getStyles(theme).container}>
      <LinearGradient
        colors={['#E8F5E8', '#F3E5F5', '#E3F2FD']}
        style={getStyles(theme).gradient}
      >
        <KeyboardAvoidingView
          style={getStyles(theme).keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={getStyles(theme).scrollView}
              contentContainerStyle={getStyles(theme).scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={getStyles(theme).headerContainer}>
                <View style={getStyles(theme).headerContent}>
                  <View style={getStyles(theme).headerRow}>
                    <Pressable
                      style={getStyles(theme).backButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Feather
                        name="arrow-left"
                        size={20}
                        color={theme.colors.text.primary}
                      />
                    </Pressable>
                    <View style={getStyles(theme).headerTitleContainer}>
                      <Text style={getStyles(theme).headerTitle}>
                        Create Job Posting
                      </Text>
                      <Text style={getStyles(theme).headerSubtitle}>
                        Fill in the details for your job posting
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Form */}
              <View style={getStyles(theme).formContainer}>
                <Card style={getStyles(theme).formCard}>
                  {/* Job Title */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>Job Title *</Text>
                    <TextInput
                      style={[
                        getStyles(theme).input,
                        errors.title && getStyles(theme).inputError,
                      ]}
                      value={formData.title}
                      onChangeText={value =>
                        setFormData(prev => ({ ...prev, title: value }))
                      }
                      placeholder="e.g. Senior React Native Developer"
                      placeholderTextColor={theme.colors.text.secondary}
                    />
                    {errors.title && (
                      <Text style={getStyles(theme).errorText}>
                        {errors.title}
                      </Text>
                    )}
                  </View>

                  {/* Job Description */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>
                      Job Description *
                    </Text>
                    <TextInput
                      style={[
                        getStyles(theme).input,
                        getStyles(theme).textArea,
                        errors.description && getStyles(theme).inputError,
                      ]}
                      value={formData.description}
                      onChangeText={value =>
                        setFormData(prev => ({ ...prev, description: value }))
                      }
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                      placeholderTextColor={theme.colors.text.secondary}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                    {errors.description && (
                      <Text style={getStyles(theme).errorText}>
                        {errors.description}
                      </Text>
                    )}
                  </View>

                  {/* City */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>City</Text>
                    <View style={getStyles(theme).pickerContainer}>
                      {['morena', 'gwalior'].map(city => (
                        <Pressable
                          key={city}
                          style={[
                            getStyles(theme).pickerOption,
                            formData.city === city &&
                              getStyles(theme).pickerOptionSelected,
                          ]}
                          onPress={() =>
                            setFormData(prev => ({ ...prev, city }))
                          }
                        >
                          <Text
                            style={[
                              getStyles(theme).pickerOptionText,
                              formData.city === city &&
                                getStyles(theme).pickerOptionTextSelected,
                            ]}
                          >
                            {city.charAt(0).toUpperCase() + city.slice(1)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Category */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>
                      Job Category (Optional)
                    </Text>
                    <View style={getStyles(theme).pickerContainer}>
                      <Pressable
                        style={[
                          getStyles(theme).pickerOption,
                          !formData.category_id &&
                            getStyles(theme).pickerOptionSelected,
                        ]}
                        onPress={() =>
                          setFormData(prev => ({ ...prev, category_id: '' }))
                        }
                      >
                        <Text
                          style={[
                            getStyles(theme).pickerOptionText,
                            !formData.category_id &&
                              getStyles(theme).pickerOptionTextSelected,
                          ]}
                        >
                          No Category
                        </Text>
                      </Pressable>
                      {categories.map(category => (
                        <Pressable
                          key={category.id}
                          style={[
                            getStyles(theme).pickerOption,
                            formData.category_id === category.id &&
                              getStyles(theme).pickerOptionSelected,
                          ]}
                          onPress={() =>
                            setFormData(prev => ({ ...prev, category_id: category.id }))
                          }
                        >
                          <Text
                            style={[
                              getStyles(theme).pickerOptionText,
                              formData.category_id === category.id &&
                                getStyles(theme).pickerOptionTextSelected,
                            ]}
                          >
                            {category.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Salary */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>
                      Salary (Optional)
                    </Text>
                    <TextInput
                      style={getStyles(theme).input}
                      value={formData.salary}
                      onChangeText={value =>
                        setFormData(prev => ({ ...prev, salary: value }))
                      }
                      placeholder="e.g. ₹20,000-30,000 per month"
                      placeholderTextColor={theme.colors.text.secondary}
                    />
                  </View>
                </Card>
              </View>

              {/* Company Profile Check */}
              {errors.company && (
                <View style={getStyles(theme).actionContainer}>
                  <Card style={getStyles(theme).errorCard}>
                    <Text style={getStyles(theme).errorText}>
                      {errors.company}
                    </Text>
                    <Text style={getStyles(theme).errorSubText}>
                      Please complete your company profile first to post jobs.
                    </Text>
                  </Card>
                </View>
              )}

              {/* Action Buttons */}
              <View style={getStyles(theme).actionContainer}>
                <View style={getStyles(theme).actionContent}>
                  <Button
                    onPress={handleSubmit}
                    style={getStyles(theme).actionButton}
                    disabled={isLoading || !companyProfile}
                  >
                    {isLoading ? 'Publishing...' : 'Publish Job'}
                  </Button>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CreateJobScreen;
