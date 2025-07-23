import React, { useState, useEffect } from 'react';
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
import { seekerService, skillsService, categoriesService } from '../../services';

const SeekerProfileSetupScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [profileData, setProfileData] = useState({
    experience_level: 'fresher',
    tenth_percentage: '',
    twelfth_percentage: '',
    graduation_percentage: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: skillsData } = await skillsService.getAllSkills();
        const { data: categoriesData } = await categoriesService.getAllCategories();
        setSkills(skillsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch initial data.');
      }
    };
    fetchData();
  }, []);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const profile = {
        ...profileData,
        user_id: user.id,
      };

      const { data: createdProfile, error } = await seekerService.createSeekerProfile(profile);

      if (error) {
        throw error;
      }

      await seekerService.addSeekerSkills(createdProfile.id, selectedSkills.map(s => s.id));
      await seekerService.addSeekerCategories(createdProfile.id, selectedCategories.map(c => c.id));

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
          <Text style={styles.title}>Seeker Profile Setup</Text>
          <Input
            label="10th Percentage"
            value={profileData.tenth_percentage}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, tenth_percentage: text }))
            }
            placeholder="e.g., 85.5"
            keyboardType="decimal-pad"
          />
          <Input
            label="12th Percentage"
            value={profileData.twelfth_percentage}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, twelfth_percentage: text }))
            }
            placeholder="e.g., 78.2"
            keyboardType="decimal-pad"
          />
          <Input
            label="Graduation Percentage"
            value={profileData.graduation_percentage}
            onChangeText={text =>
              setProfileData(prev => ({ ...prev, graduation_percentage: text }))
            }
            placeholder="e.g., 82.1"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Skills</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() =>
              navigation.navigate('SkillsSelection', {
                selectedSkills,
                onSkillsSelected: setSelectedSkills,
              })
            }
          >
            <Text>{selectedSkills.length} skills selected</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Job Categories</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() =>
              navigation.navigate('CategorySelection', {
                selectedCategories,
                onCategoriesSelected: setSelectedCategories,
              })
            }
          >
            <Text>{selectedCategories.length} categories selected</Text>
          </TouchableOpacity>

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
    label: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 10,
      color: theme.colors.text.primary,
    },
    selectionButton: {
      backgroundColor: theme.colors.background.secondary,
      padding: 15,
      borderRadius: 8,
      marginBottom: 20,
    },
  });

export default SeekerProfileSetupScreen;