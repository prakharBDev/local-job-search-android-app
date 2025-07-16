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
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import Card from '../../components/blocks/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { getStyles } from './IndexScreen.styles.js';

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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const socialButtonScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  // Animated background elements
  const backgroundAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const backgroundRotations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const backgroundScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  // Animated Background Component
  const AnimatedBackground = () => {
    const elements = [
      { type: 'circle', color: '#3B82F6', size: 80, style: 'floatingElement' },
      {
        type: 'small',
        color: '#10B981',
        size: 40,
        style: 'floatingElementSmall',
      },
      {
        type: 'tiny',
        color: '#F59E0B',
        size: 20,
        style: 'floatingElementTiny',
      },
      {
        type: 'square',
        color: '#EC4899',
        size: 60,
        style: 'floatingElementSquare',
      },
      { type: 'circle', color: '#3B82F6', size: 80, style: 'floatingElement' },
      {
        type: 'small',
        color: '#10B981',
        size: 40,
        style: 'floatingElementSmall',
      },
      {
        type: 'tiny',
        color: '#F59E0B',
        size: 20,
        style: 'floatingElementTiny',
      },
      {
        type: 'square',
        color: '#EC4899',
        size: 60,
        style: 'floatingElementSquare',
      },
      { type: 'circle', color: '#3B82F6', size: 80, style: 'floatingElement' },
      {
        type: 'small',
        color: '#10B981',
        size: 40,
        style: 'floatingElementSmall',
      },
    ];

    const positions = [
      { left: screenWidth * 0.1, top: 150 },
      { left: screenWidth * 0.8, top: 250 },
      { left: screenWidth * 0.2, top: 400 },
      { left: screenWidth * 0.9, top: 500 },
      { left: screenWidth * 0.05, top: 650 },
      { left: screenWidth * 0.7, top: 750 },
      { left: screenWidth * 0.3, top: 850 },
      { left: screenWidth * 0.85, top: 950 },
      { left: screenWidth * 0.15, top: 1050 },
      { left: screenWidth * 0.6, top: 1150 },
    ];

    return (
      <View style={styles.animatedBackground}>
        {/* Floating elements */}
        {backgroundAnimations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles[elements[index].style],
              {
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50 - index * 10],
                    }),
                  },
                  {
                    translateX: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, (index % 2 === 0 ? 1 : -1) * 20],
                    }),
                  },
                  {
                    rotate: backgroundRotations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        '0deg',
                        elements[index].type === 'square' ? '405deg' : '360deg',
                      ],
                    }),
                  },
                  {
                    scale: backgroundScales[index].interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.2, 1],
                    }),
                  },
                ],
                opacity: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 0.8, 0.3],
                }),
                left: positions[index].left,
                top: positions[index].top,
              },
            ]}
          />
        ))}

        {/* Gradient overlays */}
        <View style={styles.gradientOverlay} />
        <View style={styles.gradientOverlayTop} />
        <View style={styles.gradientOverlayBottom} />
      </View>
    );
  };

  useEffect(() => {
    // Start background animations
    const startBackgroundAnimations = () => {
      backgroundAnimations.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 4000 + index * 800,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 4000 + index * 800,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });

      backgroundRotations.forEach((rotation, index) => {
        Animated.loop(
          Animated.timing(rotation, {
            toValue: 1,
            duration: 10000 + index * 1500,
            useNativeDriver: true,
          }),
        ).start();
      });

      backgroundScales.forEach((scale, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1,
              duration: 2000 + index * 300,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0,
              duration: 2000 + index * 300,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });
    };

    startBackgroundAnimations();

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
      () => setIsKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false),
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
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
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
    setPhone(text);
    if (phoneError) {
      setPhoneError(validatePhone(text));
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
    const phoneErr = isLogin ? validatePhone(phone) : '';

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
        phone: phone.trim() || '+91 9876543210',
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

  const handleSocialLogin = (provider, index) => {
    animateButton(socialButtonScales[index]);

    // Provide user feedback
    Alert.alert('Coming Soon', `${provider} login will be available soon!`, [
      { text: 'OK', style: 'default' },
    ]);
  };

  const handleRoleChange = role => {
    setUserRole(role);
    // Haptic feedback could be added here
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear validation errors when switching modes
    setEmailError('');
    setPhoneError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible && styles.scrollContentKeyboard,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
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

          {/* Hero Section - Hide when keyboard is visible */}
          {!isKeyboardVisible && (
            <Animated.View
              style={[
                styles.heroSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
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
            </Animated.View>
          )}

          {/* Auth Card */}
          <Animated.View
            style={[
              styles.authContainer,
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
                  <View style={styles.inputContainer}>
                    <Input
                      label="Email Address"
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={handleEmailChange}
                      onBlur={() => setEmailError(validateEmail(email))}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      leftIcon={
                        <Feather name="mail" size={20} color="#94A3B8" />
                      }
                      error={emailError}
                      accessibilityLabel="Email address"
                    />
                    {emailError ? (
                      <Text style={styles.errorText}>{emailError}</Text>
                    ) : null}
                  </View>

                  {isLogin && (
                    <View style={styles.inputContainer}>
                      <Input
                        label="Phone Number"
                        placeholder="+91 XXXXX XXXXX"
                        value={phone}
                        onChangeText={handlePhoneChange}
                        onBlur={() => setPhoneError(validatePhone(phone))}
                        keyboardType="phone-pad"
                        leftIcon={
                          <Feather name="phone" size={20} color="#94A3B8" />
                        }
                        error={phoneError}
                        accessibilityLabel="Phone number"
                      />
                      {phoneError ? (
                        <Text style={styles.errorText}>{phoneError}</Text>
                      ) : null}
                    </View>
                  )}
                </View>

                {/* Social Login */}
                <View style={styles.socialButtons}>
                  <Animated.View
                    style={{ transform: [{ scale: socialButtonScales[0] }] }}
                  >
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('Google', 0)}
                      activeOpacity={0.8}
                      accessibilityLabel="Continue with Google"
                    >
                      <FontAwesome name="google" size={20} color="#4285F4" />
                      <Text style={styles.socialButtonText}>Google</Text>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* <Animated.View
                    style={{ transform: [{ scale: socialButtonScales[1] }] }}
                  >
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('LinkedIn', 1)}
                      activeOpacity={0.8}
                      accessibilityLabel="Continue with LinkedIn"
                    >
                      <FontAwesome name="linkedin" size={20} color="#0077B5" />
                      <Text style={styles.socialButtonText}>LinkedIn</Text>
                    </TouchableOpacity>
                  </Animated.View> */}
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
                    <Feather name="zap" size={24} color="#3B82F6" />
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
                onPress={handleLogin}
                style={styles.footerButton}
                accessibilityLabel="Explore job opportunities"
              >
                <View style={styles.buttonContent}>
                  <Feather name="briefcase" size={20} color="#1E88E5" />
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
