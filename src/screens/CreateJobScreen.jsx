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
import { Button, Card } from '../components/ui';
import { theme } from '../theme';
import { useNavigation } from '@react-navigation/native';

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
      <View style={styles.arrayFieldContainer}>
        {formData[field].map((item, index) => (
          <View key={index} style={styles.arrayItem}>
            <TextInput
              style={[
                styles.input,
                styles.arrayInput,
                errors[field] && styles.inputError,
              ]}
              value={item}
              onChangeText={value => updateArrayField(field, index, value)}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.text.secondary}
            />
            <Pressable
              style={styles.arrayItemButton}
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
          style={styles.addButton}
          onPress={() => addArrayField(field)}
        >
          <Feather name="plus" size={16} color={theme.colors.primary.emerald} />
          <Text style={styles.addButtonText}>Add {field.slice(0, -1)}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F5E8', '#F3E5F5', '#E3F2FD']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                  <View style={styles.headerRow}>
                    <Pressable
                      style={styles.backButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Feather
                        name="arrow-left"
                        size={20}
                        color={theme.colors.text.primary}
                      />
                    </Pressable>
                    <View style={styles.headerTitleContainer}>
                      <Text style={styles.headerTitle}>Create Job Posting</Text>
                      <Text style={styles.headerSubtitle}>
                        Fill in the details for your job posting
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                <Card style={styles.formCard}>
                  {/* Job Title */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Job Title *</Text>
                    <TextInput
                      style={[styles.input, errors.title && styles.inputError]}
                      value={formData.title}
                      onChangeText={value =>
                        setFormData(prev => ({ ...prev, title: value }))
                      }
                      placeholder="e.g. Senior React Native Developer"
                      placeholderTextColor={theme.colors.text.secondary}
                    />
                    {errors.title && (
                      <Text style={styles.errorText}>{errors.title}</Text>
                    )}
                  </View>

                  {/* Job Description */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Job Description *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textArea,
                        errors.description && styles.inputError,
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
                      <Text style={styles.errorText}>{errors.description}</Text>
                    )}
                  </View>

                  {/* Location */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Location *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors.location && styles.inputError,
                      ]}
                      value={formData.location}
                      onChangeText={value =>
                        setFormData(prev => ({ ...prev, location: value }))
                      }
                      placeholder="e.g. San Francisco, CA or Remote"
                      placeholderTextColor={theme.colors.text.secondary}
                    />
                    {errors.location && (
                      <Text style={styles.errorText}>{errors.location}</Text>
                    )}
                  </View>

                  {/* Experience Level */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Experience Level</Text>
                    <View style={styles.pickerContainer}>
                      {['entry', 'mid', 'senior'].map(level => (
                        <Pressable
                          key={level}
                          style={[
                            styles.pickerOption,
                            formData.experienceLevel === level &&
                              styles.pickerOptionSelected,
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
                              styles.pickerOptionText,
                              formData.experienceLevel === level &&
                                styles.pickerOptionTextSelected,
                            ]}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Job Type */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Job Type</Text>
                    <View style={styles.pickerContainer}>
                      {['full-time', 'part-time', 'remote', 'contract'].map(
                        type => (
                          <Pressable
                            key={type}
                            style={[
                              styles.pickerOption,
                              formData.jobType === type &&
                                styles.pickerOptionSelected,
                            ]}
                            onPress={() =>
                              setFormData(prev => ({ ...prev, jobType: type }))
                            }
                          >
                            <Text
                              style={[
                                styles.pickerOptionText,
                                formData.jobType === type &&
                                  styles.pickerOptionTextSelected,
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
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>
                      Salary Range (Optional)
                    </Text>
                    <View style={styles.salaryContainer}>
                      <View style={styles.salaryField}>
                        <Text style={styles.salaryLabel}>Min</Text>
                        <TextInput
                          style={[
                            styles.input,
                            styles.salaryInput,
                            errors.salaryRange?.min && styles.inputError,
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
                      <Text style={styles.salaryDivider}>to</Text>
                      <View style={styles.salaryField}>
                        <Text style={styles.salaryLabel}>Max</Text>
                        <TextInput
                          style={[
                            styles.input,
                            styles.salaryInput,
                            errors.salaryRange?.max && styles.inputError,
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
                      <Text style={styles.errorText}>
                        {errors.salaryRange.min}
                      </Text>
                    )}
                  </View>

                  {/* Requirements */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Requirements *</Text>
                    {renderArrayField(
                      'requirements',
                      'e.g. 3+ years React Native',
                    )}
                    {errors.requirements && (
                      <Text style={styles.errorText}>
                        {errors.requirements[0]}
                      </Text>
                    )}
                  </View>

                  {/* Skills */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Skills *</Text>
                    {renderArrayField('skills', 'e.g. React Native')}
                    {errors.skills && (
                      <Text style={styles.errorText}>{errors.skills[0]}</Text>
                    )}
                  </View>
                </Card>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionContainer}>
                <View style={styles.actionContent}>
                  <Button
                    onPress={() => handleSubmit(true)}
                    variant="outline"
                    style={styles.actionButton}
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onPress={() => handleSubmit(false)}
                    style={styles.actionButton}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: theme.spacing[8],
  },
  headerContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
  },
  headerContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: theme.spacing[2],
    marginRight: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  headerSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  },
  formContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  formCard: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing[6],
  },
  fieldContainer: {
    marginBottom: theme.spacing[6],
  },
  fieldLabel: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing[3],
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.bodySmall.fontSize,
    marginTop: theme.spacing[1],
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  pickerOption: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
  },
  pickerOptionSelected: {
    backgroundColor: theme.colors.primary.emerald,
    borderColor: theme.colors.primary.emerald,
  },
  pickerOptionText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  pickerOptionTextSelected: {
    color: theme.colors.text.white,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  salaryField: {
    flex: 1,
  },
  salaryLabel: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },
  salaryInput: {
    textAlign: 'center',
  },
  salaryDivider: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    paddingTop: 20,
  },
  arrayFieldContainer: {
    gap: theme.spacing[2],
  },
  arrayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  arrayInput: {
    flex: 1,
  },
  arrayItemButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.primary.emerald,
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
    gap: theme.spacing[1],
  },
  addButtonText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary.emerald,
    fontWeight: '500',
  },
  actionContainer: {
    paddingHorizontal: theme.spacing[4],
  },
  actionContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  actionButton: {
    flex: 1,
  },
});

export default CreateJobScreen;
