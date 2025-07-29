import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({ onFinish }) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Simple timeout - no data dependencies
    const timer = setTimeout(() => {
      onFinish && onFinish();
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme?.colors?.primary?.main || '#6174f9'} />
      <LinearGradient
        colors={[theme?.colors?.primary?.main || '#6174f9', '#6174f9', '#6174f9']}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* App Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>JB</Text>
            </View>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>JobPortal</Text>
          <Text style={styles.appTagline}>Find Your Perfect Job</Text>

          {/* Loading Indicator */}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Welcome</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#6174f9',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    logoContainer: {
      marginBottom: 24,
    },
    logoCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    appName: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    appTagline: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 60,
    },
    loadingContainer: {
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      marginTop: 16,
      textAlign: 'center',
    },
  });

export default SplashScreen;
