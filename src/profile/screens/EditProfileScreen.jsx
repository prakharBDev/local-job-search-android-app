import React, { useState, useEffect, useRef, useContext } from 'react';
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
import Card from '../../components/blocks/Card';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';

const EditProfileScreen = ({ navigation, route }) => {
  const { user, updateUser } = useContext(AuthContext);
  const { currentMode } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Job Seeker form state
  const [jobSeekerData, setJobSeekerData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    education10th: user?.education10th || '',
    education12th: user?.education12th || '',
    graduationPercentage: user?.graduationPercentage || '',
    skills: user?.skills || '',
    experienceLevel: user?.experienceLevel || 'fresher',
    jobCategories: user?.jobCategories || [],
    bio: user?.bio || '',
  });

  // Job Poster form state
  const [jobPosterData, setJobPosterData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    city: user?.city || '',
    companySize: user?.companySize || '',
    industry: user?.industry || '',
    description: user?.description || '',
    website: user?.website || '',
    bio: user?.bio || '',
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
  }, []);

  // Validation functions
  const validateJobSeekerForm = () => {
    const newErrors = {};

    if (!jobSeekerData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!jobSeekerData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!jobSeekerData.city) {
      newErrors.city = 'City is required';
    }
    if (!jobSeekerData.skills.trim()) {
      newErrors.skills = 'Skills are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateJobPosterForm = () => {
    const newErrors = {};

    if (!jobPosterData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!jobPosterData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!jobPosterData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!jobPosterData.city) {
      newErrors.city = 'City is required';
    }
    if (!jobPosterData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    const isValid =
      currentMode === 'seeker'
        ? validateJobSeekerForm()
        : validateJobPosterForm();

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const profileData =
        currentMode === 'seeker' ? jobSeekerData : jobPosterData;
      await updateUser({ ...user, ...profileData });

      Alert.alert(
        'Profile Updated!',
        'Your profile has been successfully updated.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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

  const renderJobSeekerForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Personal Information</Text>

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

        <Input
          label="Email"
          placeholder="Enter your email"
          value={jobSeekerData.email}
          onChangeText={text =>
            setJobSeekerData({ ...jobSeekerData, email: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Feather name="mail" size={20} color="#94A3B8" />}
          error={errors.email}
        />

        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          value={jobSeekerData.phone}
          onChangeText={text =>
            setJobSeekerData({ ...jobSeekerData, phone: text })
          }
          keyboardType="phone-pad"
          leftIcon={<Feather name="phone" size={20} color="#94A3B8" />}
          error={errors.phone}
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
                onPress={() => setJobSeekerData({ ...jobSeekerData, city })}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    jobSeekerData.city === city && styles.optionChipTextActive,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        <Input
          label="Bio"
          placeholder="Tell us about yourself"
          value={jobSeekerData.bio}
          onChangeText={text =>
            setJobSeekerData({ ...jobSeekerData, bio: text })
          }
          multiline
          numberOfLines={3}
          leftIcon={<Feather name="edit-3" size={20} color="#94A3B8" />}
        />
      </View>

      <Text style={styles.sectionTitle}>Education</Text>

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
        />

        <Input
          label="Graduation Percentage (Optional)"
          placeholder="Enter graduation percentage"
          value={jobSeekerData.graduationPercentage}
          onChangeText={text =>
            setJobSeekerData({ ...jobSeekerData, graduationPercentage: text })
          }
          keyboardType="numeric"
          leftIcon={<Feather name="award" size={20} color="#94A3B8" />}
        />
      </View>

      <Text style={styles.sectionTitle}>Skills & Experience</Text>

      <View style={styles.formFields}>
        <Input
          label="Skills"
          placeholder="e.g., React Native, JavaScript, UI/UX"
          value={jobSeekerData.skills}
          onChangeText={text =>
            setJobSeekerData({ ...jobSeekerData, skills: text })
          }
          multiline
          numberOfLines={3}
          leftIcon={<Feather name="code" size={20} color="#94A3B8" />}
          error={errors.skills}
        />

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
        </View>
      </View>
    </View>
  );

  const renderJobPosterForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Personal Information</Text>

      <View style={styles.formFields}>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={jobPosterData.name}
          onChangeText={text =>
            setJobPosterData({ ...jobPosterData, name: text })
          }
          leftIcon={<Feather name="user" size={20} color="#94A3B8" />}
          error={errors.name}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          value={jobPosterData.email}
          onChangeText={text =>
            setJobPosterData({ ...jobPosterData, email: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Feather name="mail" size={20} color="#94A3B8" />}
          error={errors.email}
        />

        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          value={jobPosterData.phone}
          onChangeText={text =>
            setJobPosterData({ ...jobPosterData, phone: text })
          }
          keyboardType="phone-pad"
          leftIcon={<Feather name="phone" size={20} color="#94A3B8" />}
        />

        <Input
          label="Bio"
          placeholder="Tell us about yourself"
          value={jobPosterData.bio}
          onChangeText={text =>
            setJobPosterData({ ...jobPosterData, bio: text })
          }
          multiline
          numberOfLines={3}
          leftIcon={<Feather name="edit-3" size={20} color="#94A3B8" />}
        />
      </View>

      <Text style={styles.sectionTitle}>Company Information</Text>

      <View style={styles.formFields}>
        <Input
          label="Company Name"
          placeholder="Enter company name"
          value={jobPosterData.companyName}
          onChangeText={text =>
            setJobPosterData({ ...jobPosterData, companyName: text })
          }
          leftIcon={<Feather name="building" size={20} color="#94A3B8" />}
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
                onPress={() => setJobPosterData({ ...jobPosterData, city })}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    jobPosterData.city === city && styles.optionChipTextActive,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        <Input
          label="Industry"
          placeholder="e.g., Technology, Healthcare, Finance"
          value={jobPosterData.industry}
          onChangeText={text =>
            setJobPosterData({ ...jobPosterData, industry: text })
          }
          leftIcon={<Feather name="briefcase" size={20} color="#94A3B8" />}
          error={errors.industry}
        />

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
                  setJobPosterData({ ...jobPosterData, companySize: size.id })
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
        </View>

        <Input
          label="Company Description"
          placeholder="Brief description of your company"
          value={jobPosterData.description}
          onChangeText={text =>
            setJobPosterData({ ...jobPosterData, description: text })
          }
          multiline
          numberOfLines={4}
          leftIcon={<Feather name="file-text" size={20} color="#94A3B8" />}
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#3B82F6" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <Text style={styles.headerSubtitle}>
              Update your{' '}
              {currentMode === 'seeker' ? 'job seeker' : 'job poster'}{' '}
              information
            </Text>
          </View>

          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>
              {currentMode === 'seeker' ? '👤' : '💼'}
            </Text>
          </View>
        </Animated.View>

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
            <Card style={styles.formCard}>
              {currentMode === 'seeker'
                ? renderJobSeekerForm()
                : renderJobPosterForm()}
            </Card>
          </Animated.View>
        </ScrollView>

        {/* Save Button */}
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
            onPress={handleSave}
            disabled={isLoading}
            style={styles.saveButton}
          >
            <View style={styles.buttonContent}>
              {isLoading ? (
                <>
                  <Feather name="loader" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Feather name="check" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Save Changes</Text>
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
    shadowColor: '#3B82F6',
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
  modeBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeText: {
    fontSize: 20,
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
  formContainer: {
    gap: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'System',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  formFields: {
    gap: 24,
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
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
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
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
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
    color: '#3B82F6',
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
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
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
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    height: 56,
    shadowColor: '#10B981',
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
};

export default EditProfileScreen;
