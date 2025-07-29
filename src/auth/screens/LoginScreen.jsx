import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Button from '../../components/elements/Button';
import Card from '../../components/blocks/Card';
import Input from '../../components/elements/Input';
import GoogleSignInButton from '../../shared/components/GoogleSignInButton';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { onboardingService } from '../../services';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: theme?.spacing?.[6] || 24,
      paddingTop: theme?.spacing?.[8] || 32,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: theme?.spacing?.[8] || 32,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: theme?.spacing?.[4] || 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[2] || 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme?.colors?.text?.secondary || '#475569',
      textAlign: 'center',
      maxWidth: 280,
    },
    loginCard: {
      padding: theme?.spacing?.[6] || 24,
    },
    loginTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[2] || 8,
    },
    loginSubtitle: {
      fontSize: 14,
      color: theme?.colors?.text?.secondary || '#475569',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[6] || 24,
      lineHeight: 20,
    },
    phoneInput: {
      marginBottom: theme?.spacing?.[6] || 24,
    },
    googleButton: {
      marginBottom: theme?.spacing?.[6] || 24,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    googleIcon: {
      marginRight: theme?.spacing?.[3] || 12,
    },
    googleButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    features: {
      gap: theme?.spacing?.[3] || 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme?.spacing?.[3] || 12,
    },
    featureText: {
      fontSize: 14,
      color: theme?.colors?.text?.secondary || '#475569',
      flex: 1,
    },
    footer: {
      paddingHorizontal: theme?.spacing?.[6] || 24,
      paddingBottom: theme?.spacing?.[6] || 24,
    },
    footerText: {
      fontSize: 12,
      color: theme?.colors?.text?.tertiary || '#94A3B8',
      textAlign: 'center',
      lineHeight: 16,
    },
    footerLink: {
      color: theme?.colors?.primary?.cyan || '#6174f9',
      fontWeight: '500',
    },
    validationText: {
      color: theme?.colors?.text?.error || '#EF4444',
      fontSize: 12,
      textAlign: 'center',
      marginTop: theme?.spacing?.[2] || 8,
    },
  });

const LoginScreen = ({ onLogin }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const styles = getStyles(theme || {});

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Phone validation function (reusing pattern from IndexScreen)
  const validatePhone = phone => {
    // Remove +91 prefix for validation
    const phoneWithoutPrefix = phone.replace(/^\+91\s*/, '');
    const phoneRegex = /^[1-9][\d]{9}$/; // 10 digits for Indian mobile numbers

    if (!phoneWithoutPrefix.trim()) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(phoneWithoutPrefix.replace(/\s/g, ''))) {
      return 'Please enter a valid 10-digit phone number';
    }
    return '';
  };

  const handlePhoneChange = text => {
    // Remove +91 prefix if user tries to type it
    const cleanText = text.replace(/^\+91\s*/, '');
    // Only allow digits and limit to 10 digits
    const digitsOnly = cleanText.replace(/\D/g, '');
    const limitedText = digitsOnly.slice(0, 10);
    setPhoneNumber(limitedText);

    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError(validatePhone(`+91 ${limitedText}`));
    }
  };

  const handlePhoneBlur = () => {
    const error = validatePhone(`+91 ${phoneNumber}`);
    setPhoneError(error);
  };

  const isPhoneValid = () => {
    // Check if phone number is exactly 10 digits and no validation errors
    return (
      phoneNumber.length === 10 &&
      !phoneError &&
      /^[1-9][\d]{9}$/.test(phoneNumber)
    );
  };

  const handleGoogleSignInSuccess = async result => {
    if (result.error) {
      Alert.alert('Sign In Error', result.error);
      return;
    }

    // Double-check phone validation before proceeding
    if (!isPhoneValid()) {
      const error = validatePhone(`+91 ${phoneNumber}`);
      setPhoneError(error);
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number before signing in.',
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data, userInfo } = result;

      if (data?.session && data?.user) {
        // Use onboarding service to check if user exists
        const {
          exists,
          userRecord,
          error: userCheckError,
        } = await onboardingService.checkUserExists(data.user.id);

        if (userCheckError) {
          console.error('Error checking user existence:', userCheckError);
          // Continue as new user if check fails
        }

        const isNewUser = !exists;

        // Call the login method with phone number
        await login({
          session: data.session,
          user: data.user,
          userRecord: userRecord || null,
          isNewUser,
          phoneNumber: `+91 ${phoneNumber}`,
        });

        // Call the original onLogin callback
        if (onLogin) {
          onLogin({ phoneNumber: `+91 ${phoneNumber}` });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to proceed with login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/rocket_1323780.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to JobPortal</Text>
          <Text style={styles.subtitle}>
            Connect with opportunities and talent
          </Text>
        </View>

        <Card style={styles.loginCard}>
          <Text style={styles.loginTitle}>Get Started</Text>
          <Text style={styles.loginSubtitle}>
            Enter your phone number to continue with Google Sign-In
          </Text>

          <Input
            label="Phone Number *"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            onBlur={handlePhoneBlur}
            placeholder="Enter your phone number"
            prefix="+91 "
            keyboardType="phone-pad"
            error={phoneError}
            style={styles.phoneInput}
            maxLength={10}
            // Additional input restrictions
            autoComplete="tel"
            textContentType="telephoneNumber"
          />

          <GoogleSignInButton
            onSuccess={handleGoogleSignInSuccess}
            disabled={!isPhoneValid() || isLoading}
          />

          {!isPhoneValid() && phoneNumber.length > 0 && (
            <Text style={styles.validationText}>
              Please enter a valid 10-digit phone number to continue
            </Text>
          )}

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <FontAwesome
                name="search"
                size={16}
                color={theme?.colors?.primary?.cyan || '#6174f9'}
              />
              <Text style={styles.featureText}>Find your dream job</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome
                name="briefcase"
                size={16}
                color={theme?.colors?.primary?.cyan || '#6174f9'}
              />
              <Text style={styles.featureText}>Post job opportunities</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome
                name="users"
                size={16}
                color={theme?.colors?.primary?.cyan || '#6174f9'}
              />
              <Text style={styles.featureText}>Connect with professionals</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
