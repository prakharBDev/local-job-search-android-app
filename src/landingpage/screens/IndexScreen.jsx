import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import Card from '../../components/blocks/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { getStyles } from './IndexScreen.styles.js';
import AnimatedBackground from '../components/AnimatedBackground';

const { width: screenWidth } = Dimensions.get('window');

const IndexScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme || {});
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState('seeker');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const phoneInputRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const socialButtonScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    // Configure Google Sign-In
    const webClientId = Config.GOOGLE_WEB_CLIENT_ID;
    try {
      GoogleSignin.configure({
        scopes: ['email', 'profile'],
        webClientId,
        offlineAccess: true,
      });
    } catch (error) {
      console.error('GoogleSignin.configure failed:', error);
    }
    // Entrance animation with staggered effect
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        // Scroll to the auth card when keyboard appears
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Email validation
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Phone validation
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

  // Handle input changes with validation
  const handleEmailChange = text => {
    setEmail(text);
    if (emailError) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePhoneChange = text => {
    // Remove +91 prefix if user tries to type it
    const cleanText = text.replace(/^\+91\s*/, '');
    // Only allow digits and limit to 10 digits
    const digitsOnly = cleanText.replace(/\D/g, '');
    const limitedText = digitsOnly.slice(0, 10);
    setPhone(limitedText);
    if (phoneError) {
      setPhoneError(validatePhone(`+91 ${limitedText}`));
    }
  };

  // Button press animation
  const animateButton = scale => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    // Validate inputs
    const emailErr = validateEmail(email);
    const phoneErr = isLogin ? validatePhone(`+91 ${phone}`) : '';

    setEmailError(emailErr);
    setPhoneError(phoneErr);

    if (emailErr || phoneErr) {
      Alert.alert('Invalid Input', 'Please check your email and phone number', [
        { text: 'OK', style: 'default' },
      ]);
      return;
    }

    animateButton(buttonScale);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const demoUser = {
        id: `demo-user-${Date.now()}`,
        name: 'Demo User',
        email: email.trim(),
        phone: phone.trim() ? `+91 ${phone.trim()}` : '+91 9876543210',
        mode: userRole,
      };

      await login(demoUser);

      // Success feedback
      Alert.alert(
        'Welcome!',
        `Successfully ${
          isLogin ? 'logged in' : 'created account'
        } as ${userRole}`,
        [{ text: 'Continue', style: 'default' }],
      );
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.', [
        { text: 'OK', style: 'default' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) {
      return;
    }

    // Validate phone number before proceeding with Google Sign-In
    const phoneErr = validatePhone(`+91 ${phone}`);
    if (phoneErr) {
      setPhoneError(phoneErr);
      Alert.alert(
        'Phone Number Required',
        'Please enter a valid phone number before signing in with Google.',
      );
      return;
    }

    // Check if phone number is exactly 10 digits
    if (phone.length !== 10 || !/^[1-9][\d]{9}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit phone number before signing in with Google.',
      );
      return;
    }

    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices();
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          await GoogleSignin.signOut();
        }
      } catch (currentUserError) {
        // Ignore if no current user
      }
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error('Google Sign-In did not return an ID token.');
      }
      // Sign in with Supabase using the Google ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (error) {
        console.error('Supabase signInWithIdToken error:', error);
        throw error;
      }
      const { session, user } = data;
      if (!session || !user) {
        throw new Error('Invalid authentication data');
      }
      // Check if user exists in our database
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      
      let userRecord = existingUser;
      let isNewUser = false;
      if (userError && userError.code === 'PGRST116') {
        isNewUser = true;
        const newUserData = {
          id: user.id, // Use the Supabase auth user ID directly
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          phone_number: `+91 ${phone}`, // Add phone number to new user
          google_id: user.id || user.user_metadata?.sub,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          city: 'morena',
        };
        
        
        // Try to insert with explicit ID first
        let { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert([newUserData])
          .select()
          .single();
          
        // If that fails, try without specifying ID (let database generate it)
        if (createError && createError.code === '23505') { // Unique constraint violation
          const { id, ...userDataWithoutId } = newUserData;
          const { data: retryUser, error: retryError } = await supabase
            .from('users')
            .insert([userDataWithoutId])
            .select()
            .single();
            
          if (retryError) {
            console.error('Retry user creation error:', retryError);
            throw retryError;
          }
          createdUser = retryUser;
          createError = null;
        }
        
        
        if (createError) {
          console.error('User creation error:', createError);
          throw createError;
        }
        userRecord = createdUser;
      } else if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      } else {
        // Update last login and phone number for existing user
        const { error: updateError } = await supabase
          .from('users')
          .update({
            updated_at: new Date().toISOString(),
            phone_number: `+91 ${phone}`, // Update phone number if it changed
          })
          .eq('id', user.id);
        if (updateError) {
          console.warn('Failed to update user:', updateError);
        }
      }
      // Log in the user in AuthContext with phone number
      await login({
        session,
        user,
        userRecord,
        isNewUser,
        phoneNumber: `+91 ${phone}`,
      });
      console.log('Google sign-in successful for:', user.email);
      Alert.alert(
        'Welcome!',
        isNewUser
          ? "Account created successfully! Let's set up your profile."
          : `Welcome back, ${userRecord.name || 'User'}!`,
        [{ text: 'Continue', style: 'default' }],
      );
    } catch (error) {
      let errorMessage = 'Google Sign-In failed. Please try again.';
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return; // User cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign-in already in progress. Please wait.';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available or outdated.';
      } else if (error.message && error.message.includes('DEVELOPER_ERROR')) {
        errorMessage = `Configuration Error: ${error.message}\n\nPlease check:\n- Package name: com.basicapp\n- SHA-1 fingerprint\n- Google Cloud Console setup`;
      }
      console.error('Google Sign-In error:', error);
      Alert.alert('Authentication Error', errorMessage, [
        { text: 'OK', style: 'default' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if phone number is valid for Google Sign-In
  const isPhoneValidForGoogleSignIn = () => {
    return phone.length === 10 && !phoneError && /^[1-9][\d]{9}$/.test(phone);
  };

  const handleSocialLogin = (provider, index) => {
    if (provider === 'Google') {
      // Validate phone number before Google Sign-In
      if (!isPhoneValidForGoogleSignIn()) {
        const phoneErr = validatePhone(`+91 ${phone}`);
        setPhoneError(phoneErr || 'Please enter a valid 10-digit phone number');
        Alert.alert(
          'Phone Number Required',
          'Please enter a valid phone number before signing in with Google.',
        );
        return;
      }
      handleGoogleSignIn();
    }
    animateButton(socialButtonScales[index]);
  };

  const handleRoleChange = role => {
    setUserRole(role);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmailError('');
    setPhoneError('');
  };

  // Handle "Explore Opportunities" button click - scroll to login section
  const handleExploreOpportunities = () => {
    // Scroll to the auth card section
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible && styles.scrollContentKeyboard,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Header - Always visible but smaller when keyboard is visible */}
          <Animated.View
            style={[
              styles.header,
              isKeyboardVisible && styles.headerKeyboard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.brandContainer}>
              <View style={styles.brandIcon}>
                <Feather name="briefcase" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.brandText}>
                <Text style={styles.brandName}>JobConnect</Text>
                <Text style={styles.brandTagline}>Find your perfect match</Text>
              </View>
            </View>
          </Animated.View>

          {/* Hero Section - Minimize when keyboard is visible instead of hiding */}
          <Animated.View
            style={[
              styles.heroSection,
              isKeyboardVisible && styles.heroSectionKeyboard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {!isKeyboardVisible ? (
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>
                  Discover Your{'\n'}Dream Career
                </Text>
                <Text style={styles.heroSubtitle}>
                  Connect with opportunities that match your skills and
                  aspirations
                </Text>

                <View style={styles.heroStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>10K+</Text>
                    <Text style={styles.statLabel}>Active Jobs</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>5K+</Text>
                    <Text style={styles.statLabel}>Companies</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>50K+</Text>
                    <Text style={styles.statLabel}>Success Stories</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.heroContentKeyboard}>
                <Text style={styles.heroTitleKeyboard}>
                  Welcome to JobConnect
                </Text>
                <Text style={styles.heroSubtitleKeyboard}>
                  Sign in to continue your journey
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Auth Card */}
          <Animated.View
            style={[
              styles.authContainer,
              isKeyboardVisible && styles.authContainerKeyboard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Card style={styles.authCard}>
              <View style={styles.authHeader}>
                <Text style={styles.authTitle}>
                  {isLogin ? 'Welcome Back!' : 'Get Started'}
                </Text>
                <Text style={styles.authSubtitle}>
                  {isLogin
                    ? 'Sign in to continue your job search journey'
                    : 'Join thousands of professionals finding their perfect job match'}
                </Text>
              </View>

              <View style={styles.authForm}>
                {/* Form Fields */}
                <View style={styles.formFields}>
                  {isLogin && (
                    <View style={styles.inputContainer}>
                      <Input
                        ref={phoneInputRef}
                        label="Phone Number"
                        placeholder="XXXXX XXXXX"
                        value={phone}
                        onChangeText={handlePhoneChange}
                        onBlur={() =>
                          setPhoneError(validatePhone(`+91 ${phone}`))
                        }
                        keyboardType="phone-pad"
                        leftIcon={
                          <Feather name="phone" size={20} color="#94A3B8" />
                        }
                        prefix="+91 "
                        error={phoneError}
                        accessibilityLabel="Phone number"
                      />
                    </View>
                  )}
                </View>

                {/* Social Login */}
                <View style={styles.socialButtons}>
                  <Animated.View
                    style={{ transform: [{ scale: socialButtonScales[0] }] }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.socialButton,
                        (isLoading || !isPhoneValidForGoogleSignIn()) &&
                          styles.socialButtonDisabled,
                      ]}
                      onPress={() => handleSocialLogin('Google', 0)}
                      activeOpacity={0.8}
                      accessibilityLabel="Continue with Google"
                      disabled={isLoading || !isPhoneValidForGoogleSignIn()}
                    >
                      {isLoading ? (
                        <>
                          <FontAwesome
                            name="google"
                            size={20}
                            color="#94A3B8"
                          />
                          <Text
                            style={[
                              styles.socialButtonText,
                              { color: '#94A3B8' },
                            ]}
                          >
                            Signing in...
                          </Text>
                        </>
                      ) : (
                        <>
                          <FontAwesome
                            name="google"
                            size={20}
                            color={
                              isPhoneValidForGoogleSignIn()
                                ? '#4285F4'
                                : '#94A3B8'
                            }
                          />
                          <Text
                            style={[
                              styles.socialButtonText,
                              !isPhoneValidForGoogleSignIn() && {
                                color: '#94A3B8',
                              },
                            ]}
                          >
                            Google
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Phone validation message */}
                  {!isPhoneValidForGoogleSignIn() && phone.length > 0 && (
                    <Text style={styles.validationText}>
                      Please enter a valid 10-digit phone number to continue
                      with Google Sign-In
                    </Text>
                  )}
                </View>

                {/* Terms */}
                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </Card>
          </Animated.View>

          {/* Features Section - Hide when keyboard is visible */}
          {!isKeyboardVisible && (
            <Animated.View
              style={[
                styles.featuresSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.featuresTitle}>Why Choose JobConnect?</Text>

              <View style={styles.featuresGrid}>
                <TouchableOpacity
                  style={styles.featureCard}
                  activeOpacity={0.8}
                  accessibilityLabel="Smart Matching feature"
                >
                  <View
                    style={[styles.featureIcon, { backgroundColor: '#EFF6FF' }]}
                  >
                    <Feather name="zap" size={24} color="#6174f9" />
                  </View>
                  <Text style={styles.featureTitle}>Smart Matching</Text>
                  <Text style={styles.featureDescription}>
                    AI-powered job recommendations based on your skills and
                    preferences
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featureCard}
                  activeOpacity={0.8}
                  accessibilityLabel="Verified Companies feature"
                >
                  <View
                    style={[styles.featureIcon, { backgroundColor: '#F0FDF4' }]}
                  >
                    <Feather name="shield" size={24} color="#22C55E" />
                  </View>
                  <Text style={styles.featureTitle}>Verified Companies</Text>
                  <Text style={styles.featureDescription}>
                    All companies are verified to ensure legitimate
                    opportunities
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featureCard}
                  activeOpacity={0.8}
                  accessibilityLabel="Career Growth feature"
                >
                  <View
                    style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}
                  >
                    <Feather name="trending-up" size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.featureTitle}>Career Growth</Text>
                  <Text style={styles.featureDescription}>
                    Track your progress and get insights for career advancement
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featureCard}
                  activeOpacity={0.8}
                  accessibilityLabel="Community feature"
                >
                  <View
                    style={[styles.featureIcon, { backgroundColor: '#FDF2F8' }]}
                  >
                    <Feather name="users" size={24} color="#EC4899" />
                  </View>
                  <Text style={styles.featureTitle}>Community</Text>
                  <Text style={styles.featureDescription}>
                    Connect with professionals and expand your network
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Footer CTA - Hide when keyboard is visible */}
          {!isKeyboardVisible && (
            <Animated.View
              style={[
                styles.footerCta,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.footerCtaText}>
                Ready to take the next step in your career?
              </Text>

              <Button
                variant="outline"
                size="lg"
                onPress={handleExploreOpportunities}
                style={styles.footerButton}
                accessibilityLabel="Explore job opportunities"
              >
                <View style={styles.buttonContent}>
                  <Feather name="briefcase" size={20} color="#6174f9" />
                  <Text style={styles.footerButtonText}>
                    Explore Opportunities
                  </Text>
                </View>
              </Button>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <AnimatedBackground />
    </SafeAreaView>
  );
};

export default IndexScreen;
