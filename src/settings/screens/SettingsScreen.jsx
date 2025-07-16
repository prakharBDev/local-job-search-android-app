import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import SettingItem from '../components/SettingItem';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    settingsSection: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: 10,
      padding: 10,
    },
    settingItem: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    settingText: {
      fontSize: 16,
      color: theme.colors.text.primary,
    },
  });

const SettingsScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      <View style={styles.settingsSection}>
        <SettingItem title="Notifications" />
        <SettingItem title="Privacy" />
        <SettingItem title="Account" />
        <SettingItem title="Help & Support" />
      </View>
    </View>
  );
};

export default SettingsScreen;
