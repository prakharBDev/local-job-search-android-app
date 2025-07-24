import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/themed';
import getStyles from './HomeCard.styles';

const HomeCard = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
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
  );
};

export default HomeCard;
