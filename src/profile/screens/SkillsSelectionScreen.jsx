import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/elements/Button';
import { skillsService } from '../../services';

const SkillsSelectionScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState(route.params.selectedSkills || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSkillName, setNewSkillName] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await skillsService.getAllSkills();
        if (error) throw error;
        setSkills(data || []);
        setFilteredSkills(data || []);
      } catch (err) {
        Alert.alert('Error fetching skills', err.message);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredSkills(
        skills.filter(skill =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredSkills(skills);
    }
  }, [searchQuery, skills]);

  const handleToggleSkill = skill => {
    if (selectedSkills.find(s => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddNewSkill = async () => {
    if (!newSkillName.trim()) return;
    try {
      const { data, error } = await skillsService.createSkill(newSkillName);
      if (error) throw error;
      const newSkill = data;
      setSkills([...skills, newSkill]);
      setSelectedSkills([...selectedSkills, newSkill]);
      setNewSkillName('');
    } catch (err) {
      Alert.alert('Error adding skill', err.message);
    }
  };

  const handleDone = () => {
    // Navigate back with all the form data preserved
    navigation.navigate({
      name: 'SeekerProfileSetup',
      params: { 
        updatedSkills: selectedSkills,
        // Preserve all other form data
        selectedCity: route.params?.selectedCity,
        selectedCategories: route.params?.selectedCategories,
        experience_level: route.params?.experience_level,
        tenth_percentage: route.params?.tenth_percentage,
        twelfth_percentage: route.params?.twelfth_percentage,
        graduation_percentage: route.params?.graduation_percentage,
        nextScreen: route.params?.nextScreen,
        selectedRoles: route.params?.selectedRoles,
      },
      merge: true,
    });
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search skills..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView>
        {filteredSkills.map(skill => (
          <TouchableOpacity
            key={skill.id}
            style={styles.skillItem}
            onPress={() => handleToggleSkill(skill)}
          >
            <Text style={styles.skillName}>{skill.name}</Text>
            {selectedSkills.find(s => s.id === skill.id) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          style={styles.newSkillInput}
          placeholder="Add new skill..."
          value={newSkillName}
          onChangeText={setNewSkillName}
        />
        <Button onPress={handleAddNewSkill}>Add</Button>
      </View>
      <Button onPress={handleDone}>Done</Button>
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    searchInput: {
      backgroundColor: theme.colors.background.secondary,
      padding: 10,
      borderRadius: 8,
    },
    skillItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    skillName: {
      color: theme.colors.text.primary,
    },
    checkmark: {
      color: theme.colors.primary.main,
    },
    footer: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    newSkillInput: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
      padding: 10,
      borderRadius: 8,
      marginRight: 10,
    },
  });

export default SkillsSelectionScreen;