import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

const SplashScreen = ({ onFinish }) => {
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
          source={require('../assests/rocket_1323780.png')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.emerald,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing[6],
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text.white,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  footer: {
    fontSize: 14,
    color: theme.colors.text.white,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default SplashScreen;
