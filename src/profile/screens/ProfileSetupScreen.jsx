import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import { AppHeader, Icon } from '../../components/elements';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';

const ProfileSetupScreen = ({ navigation, route }) => {
  const { user, updateUserRecord } = useAuth();
  const { currentMode } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Job Seeker form state
  const [jobSeekerData, setJobSeekerData] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
    city: user?.user_metadata?.city || '',
    education10th: user?.user_metadata?.education10th || '',
    education12th: user?.user_metadata?.education12th || '',
    graduationPercentage: user?.user_metadata?.graduationPercentage || '',
    skills: user?.user_metadata?.skills || '',
    experienceLevel: user?.user_metadata?.experienceLevel || 'fresher',
    jobCategories: [],
    newSkill: '',
  });

  // Job Poster form state
  const [jobPosterData, setJobPosterData] = useState({
    companyName: '',
    city: '',
    companySize: '',
    industry: '',
    description: '',
    website: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Job categories for selection
  const jobCategories = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Design',
    'Engineering',
    'Operations',
    'HR',
    'Legal',
    'Other',
  ];

  // Cities for selection
  const cities = ['Morena', 'Gwalior', 'Bhopal', 'Indore', 'Jabalpur', 'Other'];

  // Experience levels
  const experienceLevels = [
    { id: 'fresher', label: 'Fresher (0-1 years)', icon: '🌱' },
    { id: 'junior', label: 'Junior (1-3 years)', icon: '🚀' },
    { id: 'mid', label: 'Mid-level (3-5 years)', icon: '💼' },
    { id: 'senior', label: 'Senior (5+ years)', icon: '👑' },
  ];

  // Company sizes
  const companySizes = [
    { id: 'startup', label: 'Startup (1-10)', icon: '🚀' },
    { id: 'small', label: 'Small (11-50)', icon: '🏢' },
    { id: 'medium', label: 'Medium (51-200)', icon: '🏬' },
    { id: 'large', label: 'Large (200+)', icon: '🏭' },
  ];

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Update progress animation
    Animated.timing(progressAnim, {
      toValue: currentMode === 'seeker' ? currentStep / 4 : currentStep / 3,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Validation functions
  const validateJobSeekerStep = step => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!jobSeekerData.name.trim()) {
          newErrors.name = 'Name is required';
        }
        if (!jobSeekerData.city) {
          newErrors.city = 'City is required';
        }
        break;
      case 2:
        if (!jobSeekerData.education10th.trim()) {
          newErrors.education10th = '10th percentage is required';
        }
        if (!jobSeekerData.education12th.trim()) {
          newErrors.education12th = '12th percentage is required';
        }
        if (
          jobSeekerData.graduationPercentage &&
          isNaN(jobSeekerData.graduationPercentage)
        ) {
          newErrors.graduationPercentage = 'Invalid percentage';
        }
        break;
      case 3:
        if (!jobSeekerData.skills.trim()) {
          newErrors.skills = 'Skills are required';
        }
        break;
      case 4:
        if (jobSeekerData.jobCategories.length === 0) {
          newErrors.jobCategories = 'Select at least one category';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateJobPosterStep = step => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!jobPosterData.companyName.trim()) {
          newErrors.companyName = 'Company name is required';
        }
        if (!jobPosterData.city) {
          newErrors.city = 'City is required';
        }
        break;
      case 2:
        if (!jobPosterData.companySize) {
          newErrors.companySize = 'Company size is required';
        }
        if (!jobPosterData.industry.trim()) {
          newErrors.industry = 'Industry is required';
        }
        break;
      case 3:
        if (!jobPosterData.description.trim()) {
          newErrors.description = 'Description is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const isValid =
      currentMode === 'seeker'
        ? validateJobSeekerStep(currentStep)
        : validateJobPosterStep(currentStep);

    if (isValid) {
      const maxSteps = currentMode === 'seeker' ? 4 : 3;
      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const profileData =
        currentMode === 'seeker' ? jobSeekerData : jobPosterData;
      // Convert city to lowercase to match database constraint
      const updates = {
        ...profileData,
        city: profileData.city?.toLowerCase(),
        profileCompleted: true,
      };

      await updateUserRecord(updates);

      Alert.alert(
        'Profile Setup Complete!',
        'Your profile has been successfully created.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.replace('Dashboard'),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleJobCategory = category => {
    const currentCategories = jobSeekerData.jobCategories;
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];

    setJobSeekerData({ ...jobSeekerData, jobCategories: updatedCategories });
  };

  const renderJobSeekerStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

            <View style={styles.formFields}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={jobSeekerData.name}
                onChangeText={text =>
                  setJobSeekerData({ ...jobSeekerData, name: text })
                }
                leftIcon={<Feather name="user" size={20} color="#94A3B8" />}
                error={errors.name}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.optionScroll}
                >
                  {cities.map(city => (
                    <TouchableOpacity
                      key={city}
                      style={[
                        styles.optionChip,
                        jobSeekerData.city === city && styles.optionChipActive,
                      ]}
                      onPress={() =>
                        setJobSeekerData({ ...jobSeekerData, city })
                      }
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          jobSeekerData.city === city &&
                            styles.optionChipTextActive,
                        ]}
                      >
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Education Details</Text>
            <Text style={styles.stepSubtitle}>
              Share your educational background
            </Text>

            <View style={styles.formFields}>
              <Input
                label="10th Percentage"
                placeholder="Enter 10th percentage"
                value={jobSeekerData.education10th}
                onChangeText={text =>
                  setJobSeekerData({ ...jobSeekerData, education10th: text })
                }
                keyboardType="numeric"
                leftIcon={<Feather name="book" size={20} color="#94A3B8" />}
                error={errors.education10th}
              />

              <Input
                label="12th Percentage"
                placeholder="Enter 12th percentage"
                value={jobSeekerData.education12th}
                onChangeText={text =>
                  setJobSeekerData({ ...jobSeekerData, education12th: text })
                }
                keyboardType="numeric"
                leftIcon={<Feather name="book" size={20} color="#94A3B8" />}
                error={errors.education12th}
              />

              <Input
                label="Graduation Percentage (Optional)"
                placeholder="Enter graduation percentage"
                value={jobSeekerData.graduationPercentage}
                onChangeText={text =>
                  setJobSeekerData({
                    ...jobSeekerData,
                    graduationPercentage: text,
                  })
                }
                keyboardType="numeric"
                leftIcon={<Feather name="award" size={20} color="#94A3B8" />}
                error={errors.graduationPercentage}
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Skills & Experience</Text>
            <Text style={styles.stepSubtitle}>
              What are your key strengths?
            </Text>

            <View style={styles.formFields}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Skills</Text>
                <View style={styles.skillsGrid}>
                  {jobSeekerData.skills
                    .split(',')
                    .filter(skill => skill.trim())
                    .map((skill, index) => (
                      <View key={index} style={styles.skillChip}>
                        <Text style={styles.skillChipText}>{skill.trim()}</Text>
                        <TouchableOpacity
                          style={styles.removeSkillButton}
                          onPress={() => {
                            const skillsArray = jobSeekerData.skills
                              .split(',')
                              .filter(s => s.trim() !== skill.trim());
                            setJobSeekerData({
                              ...jobSeekerData,
                              skills: skillsArray.join(', '),
                            });
                          }}
                        >
                          <Feather name="x" size={16} color="#94A3B8" />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
                <Input
                  placeholder="Add a skill and press Enter"
                  value={jobSeekerData.newSkill}
                  onChangeText={text =>
                    setJobSeekerData({ ...jobSeekerData, newSkill: text })
                  }
                  onSubmitEditing={() => {
                    if (jobSeekerData.newSkill.trim()) {
                      const currentSkills = jobSeekerData.skills
                        ? `${jobSeekerData.skills}, `
                        : '';
                      setJobSeekerData({
                        ...jobSeekerData,
                        skills: currentSkills + jobSeekerData.newSkill.trim(),
                        newSkill: '',
                      });
                    }
                  }}
                  leftIcon={<Feather name="code" size={20} color="#94A3B8" />}
                  error={errors.skills}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Experience Level</Text>
                <View style={styles.experienceGrid}>
                  {experienceLevels.map(level => (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.experienceCard,
                        jobSeekerData.experienceLevel === level.id &&
                          styles.experienceCardActive,
                      ]}
                      onPress={() =>
                        setJobSeekerData({
                          ...jobSeekerData,
                          experienceLevel: level.id,
                        })
                      }
                    >
                      <Text style={styles.experienceIcon}>{level.icon}</Text>
                      <Text
                        style={[
                          styles.experienceText,
                          jobSeekerData.experienceLevel === level.id &&
                            styles.experienceTextActive,
                        ]}
                      >
                        {level.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Job Interests</Text>
            <Text style={styles.stepSubtitle}>
              What type of roles interest you?
            </Text>

            <View style={styles.formFields}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Job Categories</Text>
                <View style={styles.categoryGrid}>
                  {jobCategories.map(category => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        jobSeekerData.jobCategories.includes(category) &&
                          styles.categoryChipActive,
                      ]}
                      onPress={() => toggleJobCategory(category)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          jobSeekerData.jobCategories.includes(category) &&
                            styles.categoryChipTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.jobCategories && (
                  <Text style={styles.errorText}>{errors.jobCategories}</Text>
                )}
              </View>
            </View>
          </View>
        );
    }
  };

  const renderJobPosterStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Company Information</Text>
            <Text style={styles.stepSubtitle}>Tell us about your company</Text>

            <View style={styles.formFields}>
              <Input
                label="Company Name"
                placeholder="Enter company name"
                value={jobPosterData.companyName}
                onChangeText={text =>
                  setJobPosterData({ ...jobPosterData, companyName: text })
                }
                leftIcon={<Feather name="home" size={20} color="#94A3B8" />}
                error={errors.companyName}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.optionScroll}
                >
                  {cities.map(city => (
                    <TouchableOpacity
                      key={city}
                      style={[
                        styles.optionChip,
                        jobPosterData.city === city && styles.optionChipActive,
                      ]}
                      onPress={() =>
                        setJobPosterData({ ...jobPosterData, city })
                      }
                    >
                      <Text
                        style={[
                          styles.optionChipText,
                          jobPosterData.city === city &&
                            styles.optionChipTextActive,
                        ]}
                      >
                        {city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Company Details</Text>
            <Text style={styles.stepSubtitle}>
              More about your organization
            </Text>

            <View style={styles.formFields}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Company Size</Text>
                <View style={styles.experienceGrid}>
                  {companySizes.map(size => (
                    <TouchableOpacity
                      key={size.id}
                      style={[
                        styles.experienceCard,
                        jobPosterData.companySize === size.id &&
                          styles.experienceCardActive,
                      ]}
                      onPress={() =>
                        setJobPosterData({
                          ...jobPosterData,
                          companySize: size.id,
                        })
                      }
                    >
                      <Text style={styles.experienceIcon}>{size.icon}</Text>
                      <Text
                        style={[
                          styles.experienceText,
                          jobPosterData.companySize === size.id &&
                            styles.experienceTextActive,
                        ]}
                      >
                        {size.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.companySize && (
                  <Text style={styles.errorText}>{errors.companySize}</Text>
                )}
              </View>

              <Input
                label="Industry"
                placeholder="e.g., Technology, Healthcare, Finance"
                value={jobPosterData.industry}
                onChangeText={text =>
                  setJobPosterData({ ...jobPosterData, industry: text })
                }
                leftIcon={
                  <Feather name="briefcase" size={20} color="#94A3B8" />
                }
                error={errors.industry}
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Final Details</Text>
            <Text style={styles.stepSubtitle}>
              Complete your company profile
            </Text>

            <View style={styles.formFields}>
              <Input
                label="Company Description"
                placeholder="Brief description of your company"
                value={jobPosterData.description}
                onChangeText={text =>
                  setJobPosterData({ ...jobPosterData, description: text })
                }
                multiline
                numberOfLines={4}
                leftIcon={
                  <Feather name="file-text" size={20} color="#94A3B8" />
                }
                error={errors.description}
              />

              <Input
                label="Website (Optional)"
                placeholder="https://yourcompany.com"
                value={jobPosterData.website}
                onChangeText={text =>
                  setJobPosterData({ ...jobPosterData, website: text })
                }
                keyboardType="url"
                autoCapitalize="none"
                leftIcon={<Feather name="globe" size={20} color="#94A3B8" />}
              />
            </View>
          </View>
        );
    }
  };

  const maxSteps = currentMode === 'seeker' ? 4 : 3;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* App Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <AppHeader
            title="Profile Setup"
            subtitle={`${
              currentMode === 'seeker' ? 'Job Seeker' : 'Job Poster'
            } Profile`}
            leftIcon={<Icon name="arrow-left" size={20} color="#6174f9" />}
            onLeftPress={
              currentStep === 1 ? () => navigation.goBack() : handleBack
            }
            background="#F8FAFC"
          />
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.formCard}>
              {currentMode === 'seeker'
                ? renderJobSeekerStep()
                : renderJobPosterStep()}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <Animated.View
          style={[
            styles.navigationContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Button
            variant="primary"
            size="lg"
            onPress={handleNext}
            disabled={isLoading}
            style={styles.nextButton}
          >
            <View style={styles.buttonContent}>
              {isLoading ? (
                <>
                  <Feather name="loader" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    {currentStep === maxSteps ? 'Complete Setup' : 'Next'}
                  </Text>
                  <Feather name="arrow-right" size={20} color="#FFFFFF" />
                </>
              )}
            </View>
          </Button>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    marginRight: 20,
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'System',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  stepIndicator: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6174f9',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 4,
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6174f9',
    borderRadius: 12,
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  stepContainer: {
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
    fontFamily: 'System',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 17,
    color: '#64748B',
    marginBottom: 36,
    fontFamily: 'System',
    fontWeight: '500',
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  formFields: {
    gap: 28,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 8,
    marginLeft: 8,
    fontWeight: '500',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  optionScroll: {
    marginBottom: 12,
  },
  optionChip: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  optionChipActive: {
    backgroundColor: '#6174f9',
    borderColor: '#6174f9',
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  optionChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  optionChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  experienceGrid: {
    gap: 16,
  },
  experienceCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  experienceCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#6174f9',
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  experienceIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  experienceText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    flex: 1,
    letterSpacing: -0.1,
  },
  experienceTextActive: {
    color: '#6174f9',
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  categoryChip: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: '#6174f9',
    borderColor: '#6174f9',
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  navigationContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#8B9DC3',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  nextButton: {
    backgroundColor: '#6174f9',
    borderRadius: 18,
    height: 56,
    shadowColor: '#6174f9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  skillChip: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#CBD5E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  skillChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: 'System',
    letterSpacing: -0.1,
    marginRight: 8,
  },
  removeSkillButton: {
    padding: 4,
  },
};

export default ProfileSetupScreen;
