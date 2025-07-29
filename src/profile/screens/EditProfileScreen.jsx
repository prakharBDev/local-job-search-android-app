import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  SafeAreaView,
  TextInput,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import Card from '../../components/blocks/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import {
  seekerService,
  companyService,
  categoriesService,
  skillsService,
} from '../../services';
import { apiClient } from '../../services/api';
import { theme } from '../../theme';

const EditProfileScreen = ({ navigation, route }) => {
  const { user, userRecord, updateUserRecord, checkAuthStatus } = useAuth();
  const { currentMode } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [jobCategories, setJobCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [allSkills, setAllSkills] = useState([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  // Job Seeker form state
  const [jobSeekerData, setJobSeekerData] = useState({
    name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: (() => {
      const phoneValue =
        userRecord?.phone_number ||
        user?.user_metadata?.phone_number ||
        user?.phone_number ||
        user?.phone ||
        '';
      // Ensure phone number has +91 prefix
      if (phoneValue && !phoneValue.startsWith('+91')) {
        return `+91${phoneValue.replace(/[^0-9]/g, '')}`;
      }
      return phoneValue;
    })(),
    city: (() => {
      const cityValue = user?.user_metadata?.city || user?.city || '';
      return cityValue
        ? cityValue.charAt(0).toUpperCase() + cityValue.slice(1).toLowerCase()
        : '';
    })(),
    education10th: user?.user_metadata?.education10th || '',
    education12th: user?.user_metadata?.education12th || '',
    graduationPercentage: user?.user_metadata?.graduationPercentage || '',
    skills: '', // Initialize as empty string, will be loaded from database
    experienceLevel: user?.user_metadata?.experienceLevel || 'fresher',
    jobCategories: [],
    bio: '',
    newSkill: '',
  });

  // Job Poster form state
  const [jobPosterData, setJobPosterData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: (() => {
      const phoneValue =
        userRecord?.phone_number ||
        user?.user_metadata?.phone_number ||
        user?.phone ||
        '';
      // Ensure phone number has +91 prefix
      if (phoneValue && !phoneValue.startsWith('+91')) {
        return `+91${phoneValue.replace(/[^0-9]/g, '')}`;
      }
      return phoneValue;
    })(),
    companyName: '',
    city: (() => {
      const cityValue = user?.user_metadata?.city || user?.city || '';
      return cityValue
        ? cityValue.charAt(0).toUpperCase() + cityValue.slice(1).toLowerCase()
        : '';
    })(),
    companySize: '',
    industry: '',
    description: '',
    website: '',
    bio: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Job categories will be fetched from database

  // Cities for selection
  const cities = ['Morena', 'Gwalior'];

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

  // Debug: Log component state
  useEffect(() => {
    // Entrance animation
    // Animated.parallel([
    //   Animated.timing(fadeAnim, {
    //     toValue: 1,
    //     duration: 800,
    //     useNativeDriver: true,
    //   }),
    //   Animated.timing(slideAnim, {
    //     toValue: 0,
    //     duration: 800,
    //     useNativeDriver: true,
    //   }),
    // ]).start();

    // Load categories, skills and user profile data
    loadCategories();
    loadSkills();
    loadUserProfileData();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const { data: categories, error } =
        await categoriesService.getAllCategories();

      if (error) {
        console.error('Error loading categories:', error);
        return;
      }

      setJobCategories(categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadSkills = async () => {
    try {
      setIsLoadingSkills(true);
      const { data: skills, error } = await skillsService.getAllSkills();

      if (error) {
        console.error('Error loading skills:', error);
        return;
      }

      setAllSkills(skills || []);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const loadUserProfileData = async () => {
    if (!user?.id) {
      setIsLoadingProfile(false);
      return;
    }

    try {
      if (currentMode === 'seeker') {
        // Load seeker profile data
        const { data: seekerProfile, error: seekerError } =
          await seekerService.getSeekerProfile(user.id);

        if (seekerError && seekerError.code !== 'PGRST116') {
          console.error('Error loading seeker profile:', seekerError);
          return;
        }

        if (seekerProfile) {
          // Skills and categories are already included in the profile data
          const skills = seekerProfile.seeker_skills || [];
          const categories = seekerProfile.seeker_categories || [];

          const skillsString =
            skills
              ?.map(s => s.skills?.name)
              .filter(Boolean)
              .join(', ') || '';

          setJobSeekerData(prev => ({
            ...prev,
            name:
              seekerProfile.users?.name ||
              user?.user_metadata?.full_name ||
              user?.email?.split('@')[0] ||
              '',
            email: user?.email || '',
            phone: (() => {
              const phoneValue =
                userRecord?.phone_number ||
                user?.user_metadata?.phone_number ||
                user?.phone_number ||
                user?.phone ||
                seekerProfile.users?.phone_number ||
                '';
              // Ensure phone number has +91 prefix
              if (phoneValue && !phoneValue.startsWith('+91')) {
                return `+91${phoneValue.replace(/[^0-9]/g, '')}`;
              }
              return phoneValue;
            })(),
            city: (() => {
              const cityValue =
                user?.user_metadata?.city ||
                user?.city ||
                seekerProfile.users?.city ||
                '';
              return cityValue
                ? cityValue.charAt(0).toUpperCase() +
                    cityValue.slice(1).toLowerCase()
                : '';
            })(),
            education10th: seekerProfile.tenth_percentage?.toString() || '',
            education12th: seekerProfile.twelfth_percentage?.toString() || '',
            graduationPercentage:
              seekerProfile.graduation_percentage?.toString() || '',
            experienceLevel: seekerProfile.experience_level || 'fresher',
            skills: skillsString,
            jobCategories:
              categories?.map(c => c.job_categories?.name).filter(Boolean) ||
              [],
            bio: seekerProfile.bio || '',
          }));
        }
      } else {
        // Load company profile data
        const { data: companyProfile, error: companyError } =
          await companyService.getCompanyProfile(user.id);

        if (companyError && companyError.code !== 'PGRST116') {
          console.error('Error loading company profile:', companyError);
          return;
        }

        console.log('Loaded company data:', companyProfile);

        if (companyProfile) {
          console.log('Setting company data with:', {
            company_name: companyProfile.company_name,
            industry: companyProfile.industry,
            company_size: companyProfile.company_size,
            company_description: companyProfile.company_description,
            website: companyProfile.website,
            contact_email: companyProfile.contact_email,
            users: companyProfile.users,
          });

          // Check if company profile is empty (all fields undefined/null)
          const isProfileEmpty =
            !companyProfile.company_name &&
            !companyProfile.industry &&
            !companyProfile.company_size &&
            !companyProfile.company_description &&
            !companyProfile.website &&
            !companyProfile.contact_email;

          if (isProfileEmpty) {
            console.log(
              'Company profile exists but is empty, populating with default data...',
            );
            // Update the existing company profile with default data
            try {
              const { data: updatedProfile, error: updateError } =
                await companyService.updateCompanyProfile(companyProfile.id, {
                  company_name: user?.user_metadata?.full_name || 'My Company',
                  company_description: '',
                  industry: '',
                  company_size: '',
                  website: '',
                  contact_email: user?.email || '',
                });

              if (updateError) {
                console.error('Error updating company profile:', updateError);
              } else {
                console.log(
                  'Updated company profile with default data:',
                  updatedProfile,
                );
                // Reload the profile data to get the updated information
                loadUserProfileData();
                return; // Exit early to avoid setting empty data
              }
            } catch (error) {
              console.error('Error updating company profile:', error);
            }
          }

          setJobPosterData(prev => ({
            ...prev,
            name:
              user?.user_metadata?.full_name ||
              user?.email?.split('@')[0] ||
              '',
            email: user?.email || '',
            phone: (() => {
              const phoneValue =
                userRecord?.phone_number ||
                user?.user_metadata?.phone_number ||
                user?.phone_number ||
                user?.phone ||
                companyProfile.users?.phone_number ||
                companyProfile.phone_number ||
                '';
              // Ensure phone number has +91 prefix
              if (phoneValue && !phoneValue.startsWith('+91')) {
                return `+91${phoneValue.replace(/[^0-9]/g, '')}`;
              }
              return phoneValue;
            })(),
            companyName: companyProfile.company_name || '',
            city: (() => {
              const cityValue =
                userRecord?.city ||
                user?.user_metadata?.city ||
                user?.city ||
                companyProfile.users?.city ||
                companyProfile.city ||
                '';
              return cityValue
                ? cityValue.charAt(0).toUpperCase() +
                    cityValue.slice(1).toLowerCase()
                : '';
            })(),
            companySize: companyProfile.company_size || '',
            industry: companyProfile.industry || '',
            description: companyProfile.company_description || '',
            website: companyProfile.website || '',
            bio: '', // Bio field doesn't exist for company profiles
          }));
        } else {
          console.log('No company profile found, creating one...');
          // Create a default company profile
          try {
            const { data: newProfile, error: createError } =
              await companyService.createCompanyProfile({
                user_id: user.id,
                company_name: user?.user_metadata?.full_name || 'My Company',
                company_description: '',
              });

            if (createError) {
              console.error('Error creating company profile:', createError);
            } else {
              console.log('Created new company profile:', newProfile);
              // Reload the profile data
              loadUserProfileData();
            }
          } catch (error) {
            console.error('Error creating company profile:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

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
      // Prepare user updates
      const userUpdates = {};
      if (currentMode === 'seeker') {
        if (jobSeekerData.name !== user?.user_metadata?.full_name) {
          userUpdates.full_name = jobSeekerData.name;
        }
        if (jobSeekerData.phone !== user?.user_metadata?.phone_number) {
          userUpdates.phone_number = jobSeekerData.phone;
        }
        if (jobSeekerData.city !== user?.user_metadata?.city) {
          userUpdates.city = jobSeekerData.city;
        }
      } else {
        if (jobPosterData.name !== user?.user_metadata?.full_name) {
          userUpdates.full_name = jobPosterData.name;
        }
        if (jobPosterData.phone !== user?.user_metadata?.phone_number) {
          userUpdates.phone_number = jobPosterData.phone;
        }
        if (jobPosterData.city !== user?.user_metadata?.city) {
          userUpdates.city = jobPosterData.city;
        }
      }

      // Update user metadata if there are changes
      if (Object.keys(userUpdates).length > 0) {
        await updateUserRecord(userUpdates);

        // Refresh user data to ensure ProfileScreen gets updated metadata
        await checkAuthStatus();
      }

      // Update profile-specific data
      if (currentMode === 'seeker') {
        // Get existing seeker profile
        const { data: existingProfile, error: profileError } =
          await seekerService.getSeekerProfile(user.id);

        // Prepare seeker profile updates
        const seekerUpdates = {
          tenth_percentage: jobSeekerData.education10th
            ? parseInt(jobSeekerData.education10th)
            : null,
          twelfth_percentage: jobSeekerData.education12th
            ? parseInt(jobSeekerData.education12th)
            : null,
          graduation_percentage: jobSeekerData.graduationPercentage
            ? parseInt(jobSeekerData.graduationPercentage)
            : null,
          experience_level: jobSeekerData.experienceLevel,
          bio: jobSeekerData.bio,
        };

        let seekerProfileId;
        if (existingProfile && !profileError) {
          // Update existing profile
          const { data: updatedProfile, error: updateError } =
            await seekerService.updateSeekerProfile(user.id, seekerUpdates);
          if (updateError) {
            throw updateError;
          }
          seekerProfileId = updatedProfile.id;

          // Clear profile cache to ensure fresh data is loaded
          apiClient.clearCache(`seeker_profile_${user.id}`);
        } else {
          // Create new profile
          const { data: newProfile, error: createError } =
            await seekerService.createSeekerProfile(user.id, seekerUpdates);
          if (createError) {
            throw createError;
          }
          seekerProfileId = newProfile.id;

          // Clear profile cache to ensure fresh data is loaded
          apiClient.clearCache(`seeker_profile_${user.id}`);
        }

        // Save skills
        if (seekerProfileId) {
          // First remove all existing skills
          const { data: existingSkills } = await seekerService.getSeekerSkills(
            user.id,
          );
          if (existingSkills && existingSkills.length > 0) {
            const existingSkillIds = existingSkills.map(s => s.skill_id);
            await seekerService.removeSeekerSkills(user.id, existingSkillIds);
          }

          // Then add new skills if any
          if (jobSeekerData.skills && jobSeekerData.skills.trim()) {
            const skillNames = jobSeekerData.skills
              .split(',')
              .map(s => s.trim())
              .filter(Boolean);

            if (skillNames.length > 0) {
              const skillIds = [];

              for (const skillName of skillNames) {
                let skill = allSkills.find(
                  s => s.name.toLowerCase() === skillName.toLowerCase(),
                );

                if (!skill) {
                  // Create new skill if it doesn't exist
                  const { data: newSkill, error: createError } =
                    await skillsService.createSkill(skillName);
                  if (createError) {
                    console.error('Error creating skill:', createError);
                    continue; // Skip this skill if creation fails
                  }
                  skill = newSkill;
                }

                if (skill?.id) {
                  skillIds.push(skill.id);
                }
              }

              if (skillIds.length > 0) {
                // Add the new skills
                const { error: addSkillsError } =
                  await seekerService.addSeekerSkills(user.id, skillIds);
                if (addSkillsError) {
                  console.error('Error adding skills:', addSkillsError);
                }
              }
            }
          }

          // Clear skills cache to ensure fresh data is loaded
          apiClient.clearCache(`seeker_skills_${user.id}`);
        }

        // Save categories
        if (seekerProfileId && jobSeekerData.jobCategories.length > 0) {
          // Get category IDs from category names
          const categoryIds = jobSeekerData.jobCategories
            .map(categoryName => {
              const category = jobCategories.find(
                cat => cat.name === categoryName,
              );
              return category?.id;
            })
            .filter(Boolean);

          if (categoryIds.length > 0) {
            // First remove all existing categories
            const { data: existingCategories } =
              await seekerService.getSeekerCategories(user.id);
            if (existingCategories && existingCategories.length > 0) {
              const existingCategoryIds = existingCategories.map(
                c => c.category_id,
              );
              await seekerService.removeSeekerCategories(
                user.id,
                existingCategoryIds,
              );
            }

            // Then add the new categories
            await seekerService.addSeekerCategories(user.id, categoryIds);

            // Clear categories cache to ensure fresh data is loaded
            apiClient.clearCache(`seeker_categories_${user.id}`);
          }
        }
      } else {
        // Get existing company profile
        const { data: existingProfile } =
          await companyService.getCompanyProfile(user.id);

        // Only include fields that exist in the current database schema
        const companyUpdates = {
          company_name: jobPosterData.companyName,
          company_description: jobPosterData.description,
        };

        // Add optional fields if they exist in the database
        if (jobPosterData.industry) {
          companyUpdates.industry = jobPosterData.industry;
        }
        if (jobPosterData.companySize) {
          companyUpdates.company_size = jobPosterData.companySize;
        }
        if (jobPosterData.website) {
          companyUpdates.website = jobPosterData.website;
        }

        if (existingProfile) {
          await companyService.updateCompanyProfile(
            existingProfile.id,
            companyUpdates,
          );
        } else {
          await companyService.createCompanyProfile({
            ...companyUpdates,
            user_id: user.id,
          });
        }
      }

      // Show success message
      Alert.alert(
        'Profile Updated!',
        'Your profile has been successfully updated.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back or refresh the profile
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error saving profile:', error);

      // Show user-friendly error message
      let errorMessage = 'Failed to update profile. Please try again.';

      if (error.message) {
        if (error.message.includes('Seeker profile not found')) {
          errorMessage = 'Profile not found. Please try again.';
        } else if (error.message.includes('validation')) {
          errorMessage = 'Please check your input and try again.';
        } else if (
          error.message.includes('network') ||
          error.message.includes('connection')
        ) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        }
      }

      Alert.alert('Error', errorMessage);
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

  const toggleSkill = skillName => {
    const currentSkills = (jobSeekerData.skills || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const updatedSkills = currentSkills.includes(skillName)
      ? currentSkills.filter(s => s !== skillName)
      : [...currentSkills, skillName];

    setJobSeekerData({ ...jobSeekerData, skills: updatedSkills.join(', ') });
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
          leftIcon={
            <Feather name="user" size={20} color={theme.colors.textSecondary} />
          }
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
          leftIcon={
            <Feather name="mail" size={20} color={theme.colors.textSecondary} />
          }
          error={errors.email}
          editable={false}
          style={{ opacity: 0.6 }}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              placeholder="Enter phone number"
              value={(() => {
                const displayValue = jobSeekerData.phone
                  ? jobSeekerData.phone.replace('+91', '').trim()
                  : '';
                return displayValue;
              })()}
              onChangeText={text => {
                // Only allow digits
                const digitsOnly = text.replace(/[^0-9]/g, '');
                // Limit to 10 digits
                const limitedDigits = digitsOnly.slice(0, 10);
                const newPhone = `+91${limitedDigits}`;
                setJobSeekerData({ ...jobSeekerData, phone: newPhone });
              }}
              keyboardType="phone-pad"
              style={[
                styles.phoneInput,
                {
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  // Force black text color for better visibility
                  color: '#000000',
                },
              ]}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>City</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.optionScroll}
          >
            {cities.map(city => {
              // Case-insensitive comparison
              const isSelected =
                jobSeekerData.city &&
                jobSeekerData.city.toLowerCase() === city.toLowerCase();

              return (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.optionChip,
                    isSelected && styles.optionChipActive,
                  ]}
                  onPress={() => setJobSeekerData({ ...jobSeekerData, city })}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      isSelected && styles.optionChipTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
          leftIcon={
            <Feather
              name="edit-3"
              size={20}
              color={theme.colors.textSecondary}
            />
          }
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
          leftIcon={
            <Feather name="book" size={20} color={theme.colors.textSecondary} />
          }
        />

        <Input
          label="12th Percentage"
          placeholder="Enter 12th percentage"
          value={jobSeekerData.education12th}
          onChangeText={text =>
            setJobSeekerData({ ...jobSeekerData, education12th: text })
          }
          keyboardType="numeric"
          leftIcon={
            <Feather name="book" size={20} color={theme.colors.textSecondary} />
          }
        />

        <Input
          label="Graduation Percentage (Optional)"
          placeholder="Enter graduation percentage"
          value={jobSeekerData.graduationPercentage}
          onChangeText={text =>
            setJobSeekerData({ ...jobSeekerData, graduationPercentage: text })
          }
          keyboardType="numeric"
          leftIcon={
            <Feather
              name="award"
              size={20}
              color={theme.colors.textSecondary}
            />
          }
        />
      </View>

      <Text style={styles.sectionTitle}>Skills & Experience</Text>

      <View style={styles.formFields}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Skills</Text>
          {isLoadingSkills ? (
            <View style={styles.loadingContainer}>
              <Feather
                name="loader"
                size={20}
                color={theme.colors.primary.main}
              />
              <Text style={styles.loadingText}>Loading skills...</Text>
            </View>
          ) : (
            <View style={styles.skillsGrid}>
              {allSkills.map(skill => {
                const isSelected = jobSeekerData.skills
                  ?.split(',')
                  .some(
                    s => s.trim().toLowerCase() === skill.name.toLowerCase(),
                  );

                return (
                  <TouchableOpacity
                    key={skill.id}
                    style={[
                      styles.skillChip,
                      isSelected && styles.skillChipActive,
                    ]}
                    onPress={() => toggleSkill(skill.name)}
                  >
                    <Text
                      style={[
                        styles.skillChipText,
                        isSelected && styles.skillChipTextActive,
                      ]}
                    >
                      {skill.name}
                    </Text>
                    {isSelected && (
                      <Feather
                        name="check"
                        size={16}
                        color={theme.colors.white}
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {errors.skills && (
            <Text style={styles.errorText}>{errors.skills}</Text>
          )}

          {/* Add custom skill input */}
          <View style={styles.customSkillContainer}>
            <Input
              placeholder="Add a custom skill and press Enter"
              value={jobSeekerData.newSkill || ''}
              onChangeText={text =>
                setJobSeekerData({ ...jobSeekerData, newSkill: text })
              }
              onSubmitEditing={() => {
                if (jobSeekerData.newSkill && jobSeekerData.newSkill.trim()) {
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
              leftIcon={
                <Feather
                  name="plus"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />
          </View>
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

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Job Categories</Text>
          {isLoadingCategories ? (
            <View style={styles.loadingContainer}>
              <Feather
                name="loader"
                size={20}
                color={theme.colors.primary.main}
              />
              <Text style={styles.loadingText}>Loading categories...</Text>
            </View>
          ) : (
            <View style={styles.categoryGrid}>
              {jobCategories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    jobSeekerData.jobCategories.includes(category.name) &&
                      styles.categoryChipActive,
                  ]}
                  onPress={() => toggleJobCategory(category.name)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      jobSeekerData.jobCategories.includes(category.name) &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
          leftIcon={
            <Feather name="user" size={20} color={theme.colors.textSecondary} />
          }
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
          leftIcon={
            <Feather name="mail" size={20} color={theme.colors.textSecondary} />
          }
          error={errors.email}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              placeholder="Enter phone number"
              value={
                jobPosterData.phone
                  ? jobPosterData.phone.replace('+91', '').trim()
                  : ''
              }
              onChangeText={text => {
                // Only allow digits
                const digitsOnly = text.replace(/[^0-9]/g, '');
                // Limit to 10 digits
                const limitedDigits = digitsOnly.slice(0, 10);
                setJobPosterData({
                  ...jobPosterData,
                  phone: `+91${limitedDigits}`,
                });
              }}
              keyboardType="phone-pad"
              style={[
                styles.phoneInput,
                {
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  // Force black text color for better visibility
                  color: '#000000',
                },
              ]}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <Input
          label="Bio"
          placeholder="Tell us about yourself"
          value={jobPosterData.bio}
          onChangeText={text =>
            setJobPosterData({ ...jobPosterData, bio: text })
          }
          multiline
          numberOfLines={3}
          leftIcon={
            <Feather
              name="edit-3"
              size={20}
              color={theme.colors.textSecondary}
            />
          }
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
          leftIcon={
            <Feather name="home" size={20} color={theme.colors.textSecondary} />
          }
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
          leftIcon={
            <Feather
              name="briefcase"
              size={20}
              color={theme.colors.textSecondary}
            />
          }
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
          leftIcon={
            <Feather
              name="file-text"
              size={20}
              color={theme.colors.textSecondary}
            />
          }
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
          leftIcon={
            <Feather
              name="globe"
              size={20}
              color={theme.colors.textSecondary}
            />
          }
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.backgroundLight}
      />

      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      > */}
      {/* App Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather
            name="arrow-left"
            size={24}
            color={theme.colors.text.white}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>
            Update your {currentMode === 'seeker' ? 'job seeker' : 'job poster'}{' '}
            information
          </Text>
        </View>
        <View style={styles.modeBadge}>
          <Text style={styles.modeText}>
            {currentMode === 'seeker' ? '👤' : '💼'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Card style={styles.formCard}>
            {isLoadingProfile ? (
              <View style={styles.loadingContainer}>
                <Feather
                  name="loader"
                  size={24}
                  color={theme.colors.primary.main}
                />
                <Text style={styles.loadingText}>Loading profile data...</Text>
              </View>
            ) : currentMode === 'seeker' ? (
              renderJobSeekerForm()
            ) : (
              renderJobPosterForm()
            )}
          </Card>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.navigationContainer}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleSave}
          disabled={
            isLoading ||
            isLoadingProfile ||
            isLoadingCategories ||
            isLoadingSkills
          }
        >
          <View style={styles.buttonContent}>
            {isLoading ? (
              <>
                <Feather name="loader" size={20} color={theme.colors.white} />
                <Text style={styles.buttonText}>Saving...</Text>
              </>
            ) : isLoadingProfile || isLoadingCategories || isLoadingSkills ? (
              <>
                <Feather name="loader" size={20} color={theme.colors.white} />
                <Text style={styles.buttonText}>Loading...</Text>
              </>
            ) : (
              <>
                <Feather name="check" size={20} color={theme.colors.white} />
                <Text style={styles.buttonText}>Save Changes</Text>
              </>
            )}
          </View>
        </Button>
      </View>
      {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.interactive.border.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1000,
    position: 'relative',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  modeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeText: {
    fontSize: 18,
    color: theme.colors.text.white,
  },
  keyboardAvoid: {
    flex: 1,
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
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 15,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
  },
  formContainer: {
    gap: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
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
    color: theme.colors.text.primary,
    marginBottom: 16,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.status.error,
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
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  optionChipActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  optionChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  optionChipTextActive: {
    color: theme.colors.text.white,
    fontWeight: '600',
  },
  experienceGrid: {
    gap: 16,
  },
  experienceCard: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  experienceCardActive: {
    backgroundColor: theme.colors.primary.light,
    borderColor: theme.colors.primary.main,
    shadowColor: theme.colors.primary.main,
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
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    flex: 1,
    letterSpacing: -0.1,
  },
  experienceTextActive: {
    color: theme.colors.text.white,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  categoryChip: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  categoryChipTextActive: {
    color: theme.colors.text.white,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  navigationContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: theme.colors.background.secondary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.interactive.border.primary,
  },
  saveButton: {
    backgroundColor: theme.colors.status.success,
    borderRadius: 18,
    height: 56,
    shadowColor: theme.colors.status.success,
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
    color: theme.colors.text.white,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  skillChipActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
    shadowColor: theme.colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  skillChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  skillChipTextActive: {
    color: theme.colors.text.white,
    fontWeight: '600',
  },
  removeSkillButton: {
    padding: 4,
  },
  checkIcon: {
    marginLeft: 8,
  },
  customSkillContainer: {
    marginTop: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.interactive.border.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  countryCodeContainer: {
    backgroundColor: theme.colors.interactive.border.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontFamily: 'System',
    letterSpacing: -0.1,
  },
  phoneInput: {
    flex: 1,
  },
});

export default EditProfileScreen;
