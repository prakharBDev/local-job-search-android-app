import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.text.primary,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      color: theme.colors.text.secondary,
      lineHeight: 24,
    },
    version: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      fontStyle: 'italic',
    },
  });

const AboutScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Screen</Text>
      <Text style={styles.description}>
        This is a basic React Native app created for Android development.
      </Text>
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
};

export default AboutScreen;
