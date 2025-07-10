import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedText, ThemedCard, ThemedButton } from '../components/themed';
import AboutScreen from './AboutScreen';
import SettingsScreen from './SettingsScreen';
import HomeCard from './components/HomeCard';

const HomeScreen = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface.card,
      padding: theme.spacing.md,
    },
    card: {
      marginBottom: theme.spacing.lg,
      width: '100%',
      maxWidth: 400,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <HomeCard />

      <AboutScreen />
      <SettingsScreen />
    </View>
  );
};

export default HomeScreen;
