import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
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

const CreateJobScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    skills: [''],
    experienceLevel: 'mid',
    location: '',
    salaryRange: { min: '', max: '' },
    jobType: 'full-time',
    status: 'draft',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    const validRequirements = formData.requirements.filter(req => req.trim());
    if (validRequirements.length === 0) {
      newErrors.requirements = ['At least one requirement is needed'];
    }

    const validSkills = formData.skills.filter(skill => skill.trim());
    if (validSkills.length === 0) {
      newErrors.skills = ['At least one skill is needed'];
    }

    if (formData.salaryRange.min && formData.salaryRange.max) {
      const minSalary = parseInt(formData.salaryRange.min);
      const maxSalary = parseInt(formData.salaryRange.max);
      if (isNaN(minSalary) || isNaN(maxSalary)) {
        newErrors.salaryRange = {
          min: 'Invalid salary',
          max: 'Invalid salary',
        };
      } else if (minSalary >= maxSalary) {
        newErrors.salaryRange = {
          min: 'Min salary must be less than max',
          max: '',
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Clean up arrays
      const cleanRequirements = formData.requirements.filter(req => req.trim());
      const cleanSkills = formData.skills.filter(skill => skill.trim());

      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: cleanRequirements,
        skills: cleanSkills,
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        salaryRange:
          formData.salaryRange.min && formData.salaryRange.max
            ? {
                min: parseInt(formData.salaryRange.min),
                max: parseInt(formData.salaryRange.max),
              }
            : undefined,
        jobType: formData.jobType,
        status: isDraft ? 'draft' : 'active',
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Success',
        `Job ${isDraft ? 'saved as draft' : 'posted'} successfully!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
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

  const renderArrayField = (field, placeholder) => {
    return (
      <View style={getStyles(theme).arrayFieldContainer}>
        {formData[field].map((item, index) => (
          <View key={index} style={getStyles(theme).arrayItem}>
            <TextInput
              style={[
                getStyles(theme).input,
                getStyles(theme).arrayInput,
                errors[field] && getStyles(theme).inputError,
              ]}
              value={item}
              onChangeText={value => updateArrayField(field, index, value)}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.text.secondary}
            />
            <Pressable
              style={getStyles(theme).arrayItemButton}
              onPress={() => removeArrayField(field, index)}
              disabled={formData[field].length === 1}
            >
              <Feather
                name="x"
                size={16}
                color={
                  formData[field].length === 1
                    ? theme.colors.text.tertiary
                    : theme.colors.text.secondary
                }
              />
            </Pressable>
          </View>
        ))}
        <Pressable
          style={getStyles(theme).addButton}
          onPress={() => addArrayField(field)}
        >
          <Feather name="plus" size={16} color={theme.colors.primary.cyan} />
          <Text style={getStyles(theme).addButtonText}>Add {field.slice(0, -1)}</Text>
        </Pressable>
      </View>
    );
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
                      <Text style={getStyles(theme).headerTitle}>Create Job Posting</Text>
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
                      style={[getStyles(theme).input, errors.title && getStyles(theme).inputError]}
                      value={formData.title}
                      onChangeText={value =>
                        setFormData(prev => ({ ...prev, title: value }))
                      }
                      placeholder="e.g. Senior React Native Developer"
                      placeholderTextColor={theme.colors.text.secondary}
                    />
                    {errors.title && (
                      <Text style={getStyles(theme).errorText}>{errors.title}</Text>
                    )}
                  </View>

                  {/* Job Description */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>Job Description *</Text>
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
                      <Text style={getStyles(theme).errorText}>{errors.description}</Text>
                    )}
                  </View>

                  {/* Location */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>Location *</Text>
                    <TextInput
                      style={[
                        getStyles(theme).input,
                        errors.location && getStyles(theme).inputError,
                      ]}
                      value={formData.location}
                      onChangeText={value =>
                        setFormData(prev => ({ ...prev, location: value }))
                      }
                      placeholder="e.g. San Francisco, CA or Remote"
                      placeholderTextColor={theme.colors.text.secondary}
                    />
                    {errors.location && (
                      <Text style={getStyles(theme).errorText}>{errors.location}</Text>
                    )}
                  </View>

                  {/* Experience Level */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>Experience Level</Text>
                    <View style={getStyles(theme).pickerContainer}>
                      {['entry', 'mid', 'senior'].map(level => (
                        <Pressable
                          key={level}
                          style={[
                            getStyles(theme).pickerOption,
                            formData.experienceLevel === level &&
                              getStyles(theme).pickerOptionSelected,
                          ]}
                          onPress={() =>
                            setFormData(prev => ({
                              ...prev,
                              experienceLevel: level,
                            }))
                          }
                        >
                          <Text
                            style={[
                              getStyles(theme).pickerOptionText,
                              formData.experienceLevel === level &&
                                getStyles(theme).pickerOptionTextSelected,
                            ]}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Job Type */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>Job Type</Text>
                    <View style={getStyles(theme).pickerContainer}>
                      {['full-time', 'part-time', 'remote', 'contract'].map(
                        type => (
                          <Pressable
                            key={type}
                            style={[
                              getStyles(theme).pickerOption,
                              formData.jobType === type &&
                                getStyles(theme).pickerOptionSelected,
                            ]}
                            onPress={() =>
                              setFormData(prev => ({ ...prev, jobType: type }))
                            }
                          >
                            <Text
                              style={[
                                getStyles(theme).pickerOptionText,
                                formData.jobType === type &&
                                  getStyles(theme).pickerOptionTextSelected,
                              ]}
                            >
                              {type
                                .split('-')
                                .map(
                                  word =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                                )
                                .join(' ')}
                            </Text>
                          </Pressable>
                        ),
                      )}
                    </View>
                  </View>

                  {/* Salary Range */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>
                      Salary Range (Optional)
                    </Text>
                    <View style={getStyles(theme).salaryContainer}>
                      <View style={getStyles(theme).salaryField}>
                        <Text style={getStyles(theme).salaryLabel}>Min</Text>
                        <TextInput
                          style={[
                            getStyles(theme).input,
                            getStyles(theme).salaryInput,
                            errors.salaryRange?.min && getStyles(theme).inputError,
                          ]}
                          value={formData.salaryRange.min}
                          onChangeText={value =>
                            setFormData(prev => ({
                              ...prev,
                              salaryRange: { ...prev.salaryRange, min: value },
                            }))
                          }
                          placeholder="60000"
                          placeholderTextColor={theme.colors.text.secondary}
                          keyboardType="numeric"
                        />
                      </View>
                      <Text style={getStyles(theme).salaryDivider}>to</Text>
                      <View style={getStyles(theme).salaryField}>
                        <Text style={getStyles(theme).salaryLabel}>Max</Text>
                        <TextInput
                          style={[
                            getStyles(theme).input,
                            getStyles(theme).salaryInput,
                            errors.salaryRange?.max && getStyles(theme).inputError,
                          ]}
                          value={formData.salaryRange.max}
                          onChangeText={value =>
                            setFormData(prev => ({
                              ...prev,
                              salaryRange: { ...prev.salaryRange, max: value },
                            }))
                          }
                          placeholder="90000"
                          placeholderTextColor={theme.colors.text.secondary}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    {errors.salaryRange?.min && (
                      <Text style={getStyles(theme).errorText}>
                        {errors.salaryRange.min}
                      </Text>
                    )}
                  </View>

                  {/* Requirements */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>Requirements *</Text>
                    {renderArrayField(
                      'requirements',
                      'e.g. 3+ years React Native',
                    )}
                    {errors.requirements && (
                      <Text style={getStyles(theme).errorText}>
                        {errors.requirements[0]}
                      </Text>
                    )}
                  </View>

                  {/* Skills */}
                  <View style={getStyles(theme).fieldContainer}>
                    <Text style={getStyles(theme).fieldLabel}>Skills *</Text>
                    {renderArrayField('skills', 'e.g. React Native')}
                    {errors.skills && (
                      <Text style={getStyles(theme).errorText}>{errors.skills[0]}</Text>
                    )}
                  </View>
                </Card>
              </View>

              {/* Action Buttons */}
              <View style={getStyles(theme).actionContainer}>
                <View style={getStyles(theme).actionContent}>
                  <Button
                    onPress={() => handleSubmit(true)}
                    variant="outline"
                    style={getStyles(theme).actionButton}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onPress={() => handleSubmit(false)}
                    style={getStyles(theme).actionButton}
                    disabled={isLoading}
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
