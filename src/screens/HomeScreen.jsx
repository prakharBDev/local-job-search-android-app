import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedText, ThemedCard, ThemedButton } from '../components/themed';
import AboutScreen from './AboutScreen';
import SettingsScreen from './SettingsScreen';

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
      <ThemedCard variant="elevated" style={styles.card}>
        <ThemedText variant="h2" align="center" color="primary">
          Home Screen
        </ThemedText>
        <ThemedText
          variant="body"
          align="center"
          color="secondary"
          style={{ marginTop: theme.spacing.sm }}
        >
          Welcome to your React Native App with BlueWhite Theme!
        </ThemedText>

        <View style={styles.buttonContainer}>
          <ThemedButton variant="primary" size="md" style={{ flex: 1 }}>
            Primary Button
          </ThemedButton>
          <ThemedButton variant="outline" size="md" style={{ flex: 1 }}>
            Outline Button
          </ThemedButton>
        </View>
      </ThemedCard>

      <AboutScreen />
      <SettingsScreen />
    </View>
  );
};

export default HomeScreen;
