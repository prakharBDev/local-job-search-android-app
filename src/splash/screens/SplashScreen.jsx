import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.primary?.cyan || '#3C4FE0',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme?.spacing?.[8] || 32,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: theme?.spacing?.[6] || 24,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme?.colors?.text?.white || '#FFFFFF',
      marginBottom: theme?.spacing?.[2] || 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme?.colors?.text?.white || '#FFFFFF',
      opacity: 0.9,
      textAlign: 'center',
    },
    footer: {
      fontSize: 14,
      color: theme?.colors?.text?.white || '#FFFFFF',
      opacity: 0.7,
      textAlign: 'center',
    },
  });

const SplashScreen = ({ onFinish }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme || {});
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/rocket_1323780.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>JobPortal</Text>
        <Text style={styles.subtitle}>Find Your Dream Job</Text>
      </View>
      <Text style={styles.footer}>Connecting Talent with Opportunity</Text>
    </View>
  );
};

export default SplashScreen;
