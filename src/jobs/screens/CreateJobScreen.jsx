import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Animated,
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
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Card from '../../components/blocks/Card';
import { theme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { AppHeader, Icon } from '../../components/elements';
import { getStyles } from './CreateJobScreen.styles.js';
import { useAuth } from '../../contexts/AuthContext';
import { jobService, categoriesService, companyService } from '../../services';
import { seedDatabase, checkSeedingStatus } from '../../utils/seedData';

const CreateJobScreen = () => {
  const navigation = useNavigation();
  const { userRoles, userRecord, isLoading: authLoading } = useAuth();
  const [companyProfile, setCompanyProfile] = useState(null);

  // Fetch company profile when component mounts
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (userRecord?.id && userRoles?.isCompany) {
        try {
          const { data, error } = await companyService.getCompanyProfile(userRecord.id);
          if (error) {
            console.error('Error fetching company profile:', error);
          } else {
            setCompanyProfile(data);
          }
        } catch (error) {
          console.error('Error in fetchCompanyProfile:', error);
        }
      }
    };

    fetchCompanyProfile();
  }, [userRecord?.id, userRoles?.isCompany]);

  // Redirect job seekers away from this screen
  useEffect(() => {
    if (!authLoading && userRoles) {
      setIsCheckingRole(false);
      if (!userRoles.isCompany) {
        Alert.alert(
          'Access Denied',
          'Only job posters can create job postings. Please contact support if you believe this is an error.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } else if (!authLoading && !userRoles) {
      // If auth is not loading but userRoles is still undefined, show loading
      setIsCheckingRole(true);
    }
  }, [userRoles, authLoading, navigation]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    category_id: '',
    city: userRecord?.city || 'morena',
    requirements: [''],
    skills: [''],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Job title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.salary.trim()) {
      newErrors.salary = 'Salary is required';
    } else {
      const salary = parseInt(formData.salary.replace(/,/g, ''));
      if (isNaN(salary) || salary <= 0) {
        newErrors.salary = 'Please enter a valid salary amount';
      }
    }

    const validRequirements = formData.requirements.filter(req => req.trim());
    if (validRequirements.length === 0) {
      newErrors.requirements = ['At least one requirement is needed'];
    }

    const validSkills = formData.skills.filter(skill => skill.trim());
    if (validSkills.length === 0) {
      newErrors.skills = ['At least one skill is needed'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

    const handleSubmit = async (isDraft = false) => {
      if (!isDraft && !validateForm()) {
        Alert.alert(
          'Validation Error',
          'Please fix the errors in the form before submitting.',
          [{ text: 'OK', style: 'default' }],
        );
        return;
      }

      animateButton();
      setIsLoading(true);

      try {
        // Clean up arrays
        const cleanRequirements = formData.requirements.filter(req => req.trim());
        const cleanSkills = formData.skills.filter(skill => skill.trim());

        // Prepare job data for API
        const jobPayload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          salary: formData.salary.replace(/,/g, ''), // Keep as string as per schema
          city: formData.city || userRecord?.city,
          company_id: companyProfile?.id, // Use the fetched company profile ID
          is_active: !isDraft, // Use is_active instead of status
        };

        console.log('Creating job with payload:', jobPayload);

        // Create job using the job service
        const { data: createdJob, error } = await jobService.createJob(jobPayload);

        if (error) {
          console.error('Job creation error:', error);
          throw error;
        }

        console.log('Job created successfully:', createdJob);

        Alert.alert(
          'Success!',
          `Job ${isDraft ? 'saved as draft' : 'published'} successfully!`,
          [
            {
              text: 'Continue',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } catch (error) {
        console.error('Job creation failed:', error);
        Alert.alert(
          'Error',
          'Failed to save job. Please check your connection and try again.',
          [{ text: 'OK', style: 'default' }],
        );
      } finally {
        setIsLoading(false);
      }
    };

  const updateArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));

    // Clear field errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addArrayField = field => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSalaryChange = (value) => {
    // Remove non-numeric characters except commas
    const cleanValue = value.replace(/[^\d,]/g, '');
    
    // Format with commas for thousands
    let formattedValue = cleanValue;
    if (cleanValue) {
      const numericValue = cleanValue.replace(/,/g, '');
      formattedValue = parseInt(numericValue).toLocaleString('en-IN');
    }
    
    setFormData(prev => ({
      ...prev,
      salary: formattedValue,
    }));

    // Clear salary errors when user starts typing
    if (errors.salary) {
      setErrors(prev => ({ ...prev, salary: null }));
    }
  };

  const renderArrayField = (field, placeholder, label) => {
    const fieldErrors = errors[field];

    return (
      <View style={getStyles(theme).arrayFieldContainer}>
        <Text style={getStyles(theme).arrayFieldLabel}>
          {label} <Text style={getStyles(theme).requiredStar}>*</Text>
        </Text>
        <View style={getStyles(theme).arrayFieldContent}>
          {formData[field].map((item, index) => (
            <Animated.View
              key={index}
              style={[
                getStyles(theme).arrayItem,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <View style={getStyles(theme).arrayItemContent}>
                <TextInput
                  style={[
                    getStyles(theme).input,
                    getStyles(theme).arrayInput,
                    fieldErrors && getStyles(theme).inputError,
                    focusedField === `${field}-${index}` &&
                      getStyles(theme).inputFocused,
                  ]}
                  value={item}
                  onChangeText={value => updateArrayField(field, index, value)}
                  onFocus={() => setFocusedField(`${field}-${index}`)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={placeholder}
                  placeholderTextColor={theme.colors.text.secondary}
                  accessibilityLabel={`${label} ${index + 1}`}
                />
                <Pressable
                  style={[
                    getStyles(theme).arrayItemButton,
                    formData[field].length === 1 &&
                      getStyles(theme).arrayItemButtonDisabled,
                  ]}
                  onPress={() => removeArrayField(field, index)}
                  disabled={formData[field].length === 1}
                  accessibilityLabel={`Remove ${label.toLowerCase()} ${
                    index + 1
                  }`}
                >
                  <Feather
                    name="x"
                    size={16}
                    color={
                      formData[field].length === 1
                        ? theme.colors.text.tertiary
                        : '#EF4444'
                    }
                  />
                </Pressable>
              </View>
            </Animated.View>
          ))}
          <Pressable
            style={getStyles(theme).addButton}
            onPress={() => addArrayField(field)}
            accessibilityLabel={`Add ${label.toLowerCase()}`}
          >
            <Feather name="plus" size={16} color="#6174f9" />
            <Text style={getStyles(theme).addButtonText}>
              Add {label.slice(0, -1)}
            </Text>
          </Pressable>
        </View>
        {fieldErrors && (
          <Text style={getStyles(theme).errorText}>
            {Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors}
          </Text>
        )}
      </View>
    );
  };

  const renderPickerField = (field, options, label, formatOption) => {
    return (
      <View style={getStyles(theme).fieldContainer}>
        <Text style={getStyles(theme).fieldLabel}>{label}</Text>
        <View style={getStyles(theme).pickerContainer}>
          {options.map((option, index) => (
            <Pressable
              key={option}
              style={[
                getStyles(theme).pickerOption,
                formData[field] === option &&
                  getStyles(theme).pickerOptionSelected,
              ]}
              onPress={() => handleFieldChange(field, option)}
              accessibilityLabel={formatOption ? formatOption(option) : option}
              accessibilityState={{ selected: formData[field] === option }}
            >
              <Text
                style={[
                  getStyles(theme).pickerOptionText,
                  formData[field] === option &&
                    getStyles(theme).pickerOptionTextSelected,
                ]}
              >
                {formatOption ? formatOption(option) : option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  // Show loading screen while checking role
  if (isCheckingRole) {
    return (
      <SafeAreaView style={getStyles(theme).container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={{ marginTop: 16, color: theme.colors.text.primary }}>
            Checking permissions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={getStyles(theme).container}>
      <KeyboardAvoidingView
        style={getStyles(theme).keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={getStyles(theme).scrollView}
            contentContainerStyle={[
              getStyles(theme).scrollViewContent,
              isKeyboardVisible && getStyles(theme).scrollViewContentKeyboard,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* App Header */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <AppHeader
                title="Create Job Posting"
                subtitle="Fill in the details to attract the right candidates"
                leftIcon={<Icon name="arrow-left" size={20} color="#1E293B" />}
                onLeftPress={() => navigation.goBack()}
                background="#F7F9FC"
              />
            </Animated.View>

            {/* Form */}
            <Animated.View
              style={[
                getStyles(theme).formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Card style={getStyles(theme).formCard}>
                {/* Job Title */}
                <View style={getStyles(theme).fieldContainer}>
                  <Text style={getStyles(theme).fieldLabel}>
                    Job Title{' '}
                    <Text style={getStyles(theme).requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      getStyles(theme).input,
                      errors.title && getStyles(theme).inputError,
                      focusedField === 'title' && getStyles(theme).inputFocused,
                    ]}
                    value={formData.title}
                    onChangeText={value => handleFieldChange('title', value)}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g. Senior React Native Developer"
                    placeholderTextColor={theme.colors.text.secondary}
                    accessibilityLabel="Job title"
                    autoCapitalize="words"
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
                    Job Description{' '}
                    <Text style={getStyles(theme).requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      getStyles(theme).input,
                      getStyles(theme).textArea,
                      errors.description && getStyles(theme).inputError,
                      focusedField === 'description' &&
                        getStyles(theme).inputFocused,
                    ]}
                    value={formData.description}
                    onChangeText={value =>
                      handleFieldChange('description', value)
                    }
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Describe the role, responsibilities, company culture, and what makes this opportunity exciting..."
                    placeholderTextColor={theme.colors.text.secondary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    accessibilityLabel="Job description"
                  />
                  <Text style={getStyles(theme).characterCount}>
                    {formData.description.length} characters (minimum 50)
                  </Text>
                  {errors.description && (
                    <Text style={getStyles(theme).errorText}>
                      {errors.description}
                    </Text>
                  )}
                </View>

                {/* Location */}
                <View style={getStyles(theme).fieldContainer}>
                  <Text style={getStyles(theme).fieldLabel}>
                    Location{' '}
                    <Text style={getStyles(theme).requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      getStyles(theme).input,
                      errors.location && getStyles(theme).inputError,
                      focusedField === 'location' &&
                        getStyles(theme).inputFocused,
                    ]}
                    value={formData.location}
                    onChangeText={value => handleFieldChange('location', value)}
                    onFocus={() => setFocusedField('location')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g. San Francisco, CA or Remote"
                    placeholderTextColor={theme.colors.text.secondary}
                    accessibilityLabel="Job location"
                    autoCapitalize="words"
                  />
                  {errors.location && (
                    <Text style={getStyles(theme).errorText}>
                      {errors.location}
                    </Text>
                  )}
                </View>

                {/* Experience Level */}
                {renderPickerField(
                  'experienceLevel',
                  ['entry', 'mid', 'senior'],
                  'Experience Level',
                  level => level.charAt(0).toUpperCase() + level.slice(1),
                )}

                {/* Job Type */}
                {renderPickerField(
                  'jobType',
                  ['full-time', 'part-time', 'remote', 'contract'],
                  'Job Type',
                  type =>
                    type
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' '),
                )}

                {/* Salary */}
                <View style={getStyles(theme).fieldContainer}>
                  <Text style={getStyles(theme).fieldLabel}>
                    Salary <Text style={getStyles(theme).requiredStar}>*</Text>
                  </Text>
                  <View style={getStyles(theme).salaryInputContainer}>
                    <Text style={getStyles(theme).salarySymbol}>₹</Text>
                    <TextInput
                      style={[
                        getStyles(theme).input,
                        getStyles(theme).salaryInput,
                        errors.salary && getStyles(theme).inputError,
                        focusedField === 'salary' && getStyles(theme).inputFocused,
                      ]}
                      value={formData.salary}
                      onChangeText={handleSalaryChange}
                      onFocus={() => setFocusedField('salary')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="50,000"
                      placeholderTextColor={theme.colors.text.secondary}
                      keyboardType="numeric"
                      accessibilityLabel="Salary per month"
                    />
                    <Text style={getStyles(theme).salaryUnit}>per month</Text>
                  </View>
                  {errors.salary && (
                    <Text style={getStyles(theme).errorText}>
                      {errors.salary}
                    </Text>
                  )}
                </View>

                {/* Requirements */}
                {renderArrayField(
                  'requirements',
                  'e.g. 3+ years of React Native experience',
                  'Requirements',
                )}

                {/* Skills */}
                {renderArrayField(
                  'skills',
                  'e.g. React Native, JavaScript, TypeScript',
                  'Skills',
                )}
              </Card>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View
              style={[
                getStyles(theme).actionContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: buttonScale },
                  ],
                },
              ]}
            >
              <View style={getStyles(theme).actionContent}>
                <TouchableOpacity
                  onPress={() => handleSubmit(true)}
                  style={[
                    getStyles(theme).actionButton,
                    getStyles(theme).saveDraftButton,
                  ]}
                  disabled={isLoading}
                  accessibilityLabel="Save as draft"
                  activeOpacity={0.8}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Feather name="save" size={18} color="#6174f9" />
                    <Text
                      style={[
                        getStyles(theme).buttonText,
                        getStyles(theme).saveDraftButtonText,
                      ]}
                    >
                      Save Draft
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSubmit(false)}
                  style={[
                    getStyles(theme).actionButton,
                    getStyles(theme).publishButton,
                  ]}
                  disabled={isLoading}
                  accessibilityLabel="Publish job posting"
                  activeOpacity={0.8}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Feather name="send" size={18} color="#FFFFFF" />
                    )}
                    <Text
                      style={[
                        getStyles(theme).buttonText,
                        getStyles(theme).publishButtonText,
                      ]}
                    >
                      {isLoading ? 'Publishing...' : 'Publish Job'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateJobScreen;
