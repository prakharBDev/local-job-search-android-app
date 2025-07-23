
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
import { categoriesService } from '../../services';

const CategorySelectionScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(route.params.selectedCategories || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await categoriesService.getAllCategories();
        if (error) throw error;
        setCategories(data || []);
        setFilteredCategories(data || []);
      } catch (err) {
        Alert.alert('Error fetching categories', err.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredCategories(
        categories.filter(category =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  const handleToggleCategory = category => {
    if (selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const { data, error } = await categoriesService.createCategory(newCategoryName);
      if (error) throw error;
      const newCategory = data;
      setCategories([...categories, newCategory]);
      setSelectedCategories([...selectedCategories, newCategory]);
      setNewCategoryName('');
    } catch (err) {
      Alert.alert('Error adding category', err.message);
    }
  };

  const handleDone = () => {
    route.params.onCategoriesSelected(selectedCategories);
    navigation.goBack();
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView>
        {filteredCategories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleToggleCategory(category)}
          >
            <Text style={styles.categoryName}>{category.name}</Text>
            {selectedCategories.find(c => c.id === category.id) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          style={styles.newCategoryInput}
          placeholder="Add new category..."
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <Button onPress={handleAddNewCategory}>Add</Button>
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
    categoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    categoryName: {
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
    newCategoryInput: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
      padding: 10,
      borderRadius: 8,
      marginRight: 10,
    },
  });

export default CategorySelectionScreen;
