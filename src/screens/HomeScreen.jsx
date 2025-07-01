import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import AboutScreen from './AboutScreen';
import SettingsScreen from './SettingsScreen';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.subtitle}>Welcome to your React Native App!</Text>
      <AboutScreen />
      <SettingsScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
});

export default HomeScreen;
