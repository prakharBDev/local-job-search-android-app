import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const AppHeader = memo(({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  background = bluewhiteTheme.colors.background.primary,
  centered = true,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <View style={[styles.container, { backgroundColor: background }, style]}>
        {/* Left Icon */}
        <View style={styles.leftSection}>
          {leftIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLeftPress}
              activeOpacity={0.7}
            >
              {leftIcon}
            </TouchableOpacity>
          )}
        </View>

        {/* Center Content */}
        <View style={[styles.centerSection, centered && styles.centered]}>
          <Text style={[styles.title, { color: theme?.colors?.text?.primary || bluewhiteTheme.colors.text.primary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme?.colors?.text?.secondary || bluewhiteTheme.colors.text.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Icon */}
        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
              activeOpacity={0.7}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: bluewhiteTheme.colors.background.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: bluewhiteTheme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: bluewhiteTheme.colors.background.tertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'flex-start',
  },
  centered: {
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: bluewhiteTheme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: bluewhiteTheme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: bluewhiteTheme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default AppHeader; 