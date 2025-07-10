import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import Card from '../../components/blocks/Card';
import Input from '../../components/elements/Input';
import { supabase } from '../../utils/supabase';

const ProfileSetupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { state, checkAuthStatus } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.95));
  
  // Form data for different roles
  const [seekerData, setSeekerData] = useState({
    experience_level: 'fresher',
    tenth_percentage: '',
    twelfth_percentage: '',
    graduation_percentage: '',
  });
  
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_description: '',
  });

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const roles = [
    {
      id: 'seeker',
      name: 'Job Seeker',
      description: 'Looking for job opportunities',
      icon: 'user',
      color: ['#3B82F6', '#2563EB'],
    },
    {
      id: 'poster',
      name: 'Job Poster',
      description: 'Hiring for my company',
      icon: 'briefcase',
      color: ['#10B981', '#059669'],
    },
  ];

  const experienceLevels = [
    { id: 'fresher', name: 'Fresher (0-1 years)' },
    { id: 'entry', name: 'Entry Level (1-3 years)' },
    { id: 'mid', name: 'Mid Level (3-7 years)' },
    { id: 'senior', name: 'Senior Level (7+ years)' },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleComplete = async () => {
    if (!selectedRole) {
      Alert.alert('Please select a role', 'You need to choose whether you are looking for jobs or hiring.');
      return;
    }

    setIsLoading(true);
    try {
      const userId = state.user?.id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Update user role preferences
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          is_seeker: selectedRole === 'seeker',
          is_poster: selectedRole === 'poster',
        })
        .eq('id', userId);

      if (userUpdateError) throw userUpdateError;

      // Create appropriate profile
      if (selectedRole === 'seeker') {
        const { error: seekerError } = await supabase
          .from('seeker_profiles')
          .insert([{
            user_id: userId,
            experience_level: seekerData.experience_level,
            tenth_percentage: seekerData.tenth_percentage ? parseFloat(seekerData.tenth_percentage) : null,
            twelfth_percentage: seekerData.twelfth_percentage ? parseFloat(seekerData.twelfth_percentage) : null,
            graduation_percentage: seekerData.graduation_percentage ? parseFloat(seekerData.graduation_percentage) : null,
          }]);

        if (seekerError) throw seekerError;
      } else {
        if (!companyData.company_name.trim()) {
          Alert.alert('Company name required', 'Please enter your company name.');
          return;
        }

        const { error: companyError } = await supabase
          .from('company_profiles')
          .insert([{
            user_id: userId,
            company_name: companyData.company_name.trim(),
            company_description: companyData.company_description.trim() || null,
          }]);

        if (companyError) throw companyError;
      }

      // Refresh auth status to update the UI
      await checkAuthStatus();
      
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
      <LinearGradient
        colors={[
          theme?.colors?.background?.primary || '#FFFFFF',
          theme?.colors?.background?.secondary || '#F8FAFC',
        ]}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.iconGradient}
                >
                  <Feather name="user-plus" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Tell us about yourself to get personalized job recommendations
              </Text>
            </View>

            {/* Role Selection */}
            <View style={styles.rolesContainer}>
              <Text style={styles.sectionTitle}>I am a...</Text>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleCard,
                    selectedRole === role.id && styles.roleCardSelected,
                  ]}
                  onPress={() => handleRoleSelect(role.id)}
                  activeOpacity={0.8}
                >
                  <Card style={styles.roleCardInner}>
                    <View style={styles.roleCardContent}>
                      <LinearGradient
                        colors={role.color}
                        style={styles.roleIcon}
                      >
                        <Feather name={role.icon} size={24} color="#FFFFFF" />
                      </LinearGradient>
                      <View style={styles.roleInfo}>
                        <Text style={styles.roleName}>{role.name}</Text>
                        <Text style={styles.roleDescription}>{role.description}</Text>
                      </View>
                      {selectedRole === role.id && (
                        <View style={styles.selectedIndicator}>
                          <Feather name="check-circle" size={24} color={role.color[0]} />
                        </View>
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>

            {/* Role-specific form */}
            {selectedRole === 'seeker' && (
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Experience Details</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Experience Level</Text>
                  <View style={styles.experienceContainer}>
                    {experienceLevels.map((level) => (
                      <TouchableOpacity
                        key={level.id}
                        style={[
                          styles.experienceButton,
                          seekerData.experience_level === level.id && styles.experienceButtonSelected,
                        ]}
                        onPress={() => setSeekerData(prev => ({ ...prev, experience_level: level.id }))}
                      >
                        <Text style={[
                          styles.experienceText,
                          seekerData.experience_level === level.id && styles.experienceTextSelected,
                        ]}>
                          {level.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <Text style={styles.subSectionTitle}>Academic Scores (Optional)</Text>
                <Input
                  label="10th Percentage"
                  value={seekerData.tenth_percentage}
                  onChangeText={(text) => setSeekerData(prev => ({ ...prev, tenth_percentage: text }))}
                  placeholder="e.g., 85.5"
                  keyboardType="decimal-pad"
                />
                <Input
                  label="12th Percentage"
                  value={seekerData.twelfth_percentage}
                  onChangeText={(text) => setSeekerData(prev => ({ ...prev, twelfth_percentage: text }))}
                  placeholder="e.g., 78.2"
                  keyboardType="decimal-pad"
                />
                <Input
                  label="Graduation Percentage"
                  value={seekerData.graduation_percentage}
                  onChangeText={(text) => setSeekerData(prev => ({ ...prev, graduation_percentage: text }))}
                  placeholder="e.g., 82.1"
                  keyboardType="decimal-pad"
                />
              </View>
            )}

            {selectedRole === 'poster' && (
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Company Details</Text>
                <Input
                  label="Company Name *"
                  value={companyData.company_name}
                  onChangeText={(text) => setCompanyData(prev => ({ ...prev, company_name: text }))}
                  placeholder="Enter your company name"
                />
                <Input
                  label="Company Description"
                  value={companyData.company_description}
                  onChangeText={(text) => setCompanyData(prev => ({ ...prev, company_description: text }))}
                  placeholder="Brief description of your company"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            {/* Complete Button */}
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleComplete}
                loading={isLoading}
                disabled={!selectedRole}
                style={[
                  styles.completeButton,
                  !selectedRole && styles.completeButtonDisabled,
                ]}
              >
                Complete Setup
              </Button>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme?.colors?.text?.primary || '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: theme?.colors?.text?.secondary || '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  rolesContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme?.colors?.text?.primary || '#1E293B',
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme?.colors?.text?.primary || '#1E293B',
    marginBottom: 12,
    marginTop: 16,
  },
  roleCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  roleCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  roleCardInner: {
    padding: 0,
    margin: 0,
  },
  roleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme?.colors?.text?.primary || '#1E293B',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: theme?.colors?.text?.secondary || '#64748B',
    lineHeight: 20,
  },
  selectedIndicator: {
    marginLeft: 12,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme?.colors?.text?.primary || '#1E293B',
    marginBottom: 8,
  },
  experienceContainer: {
    gap: 8,
  },
  experienceButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme?.colors?.border?.primary || '#E2E8F0',
    backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
  },
  experienceButtonSelected: {
    borderColor: theme?.colors?.primary?.main || '#3B82F6',
    backgroundColor: `${theme?.colors?.primary?.main || '#3B82F6'}10`,
  },
  experienceText: {
    fontSize: 14,
    color: theme?.colors?.text?.primary || '#1E293B',
    textAlign: 'center',
  },
  experienceTextSelected: {
    color: theme?.colors?.primary?.main || '#3B82F6',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 32,
  },
  completeButton: {
    height: 56,
    borderRadius: 16,
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
});

export default ProfileSetupScreen; 