import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';

const ModeToggle = ({ style, showLabels = true, size = 'medium' }) => {
  const { currentMode, isSeekerMode, isPosterMode, toggleMode, isLoading } =
    useUser();
  const { theme } = useTheme();
  const styles = getStyles(theme || {});

  const sizes = {
    small: {
      container: { height: 32, width: 160 },
      toggle: { height: 28, width: 28 },
      text: { fontSize: 12 },
    },
    medium: {
      container: { height: 40, width: 200 },
      toggle: { height: 36, width: 36 },
      text: { fontSize: 14 },
    },
    large: {
      container: { height: 48, width: 240 },
      toggle: { height: 44, width: 44 },
      text: { fontSize: 16 },
    },
  };

  const currentSize = sizes[size];

  const handleToggle = async () => {
    if (!isLoading) {
      await toggleMode();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showLabels && (
        <View style={styles.labelsContainer}>
          <Text
            style={[
              styles.label,
              {
                color: isSeekerMode
                  ? theme?.colors?.primary?.cyan || '#3C4FE0'
                  : theme?.colors?.text?.secondary || '#475569',
              },
            ]}
          >
            Job Seeker
          </Text>
          <Text
            style={[
              styles.label,
              {
                color: isPosterMode
                  ? theme?.colors?.primary?.cyan || '#3C4FE0'
                  : theme?.colors?.text?.secondary || '#475569',
              },
            ]}
          >
            Job Poster
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.toggleContainer,
          currentSize.container,
          {
            backgroundColor: isPosterMode
              ? theme?.colors?.primary?.cyan || '#3C4FE0'
              : theme?.colors?.background?.secondary || '#F8FAFC',
          },
        ]}
        onPress={handleToggle}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.toggleButton,
            currentSize.toggle,
            {
              backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
              transform: [
                {
                  translateX: isSeekerMode
                    ? 2
                    : currentSize.container.width -
                      currentSize.toggle.width -
                      2,
                },
              ],
            },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={theme?.colors?.primary?.cyan || '#3C4FE0'}
            />
          ) : (
            <Text style={[styles.toggleIcon, currentSize.text]}>
              {isSeekerMode ? '👤' : '🏢'}
            </Text>
          )}
        </View>

        <View style={styles.trackIcons}>
          <Text
            style={[
              styles.trackIcon,
              isSeekerMode ? styles.trackIconActive : styles.trackIconInactive,
            ]}
          >
            👤
          </Text>
          <Text
            style={[
              styles.trackIcon,
              isPosterMode ? styles.trackIconActive : styles.trackIconInactive,
            ]}
          >
            🏢
          </Text>
        </View>
      </TouchableOpacity>

      {showLabels && (
        <Text style={styles.currentModeText}>
          {currentMode === 'seeker' ? 'Finding Jobs' : 'Posting Jobs'}
        </Text>
      )}
    </View>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    labelsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 20,
      position: 'relative',
      elevation: 2,
      shadowColor: theme?.colors?.shadow?.primary || '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    toggleButton: {
      position: 'absolute',
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: theme?.colors?.shadow?.primary || '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      zIndex: 2,
    },
    toggleIcon: {
      fontWeight: 'bold',
    },
    trackIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      width: '100%',
      zIndex: 1,
    },
    trackIcon: {
      fontSize: 16,
    },
    trackIconActive: {
      opacity: 1,
    },
    trackIconInactive: {
      opacity: 0.3,
    },
    currentModeText: {
      marginTop: 8,
      fontSize: 12,
      color: theme?.colors?.text?.secondary || '#475569',
      fontWeight: '500',
    },
  });

export default ModeToggle;
