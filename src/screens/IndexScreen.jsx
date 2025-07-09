import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Card, Input } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getStyles = theme =>
  StyleSheet.create({
    // Performance optimized styles for animations
    backgroundContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: screenWidth,
      height: screenHeight,
    },
    floatingShape1: {
      position: 'absolute',
      width: 200,
      height: 200,
      top: '15%',
      left: '70%',
      borderRadius: 100,
      backgroundColor: 'rgba(60, 79, 224, 0.08)',
    },
    floatingShape2: {
      position: 'absolute',
      width: 150,
      height: 150,
      bottom: '30%',
      right: '80%',
      borderRadius: 75,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
    },
    floatingShape3: {
      position: 'absolute',
      width: 120,
      height: 120,
      top: '60%',
      left: '80%',
      borderRadius: 60,
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
    },
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
    },
    // Header styles inspired by LandingScreen
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingTop: theme?.spacing?.[4] || 16,
      paddingBottom: theme?.spacing?.[2] || 8,
    },
    headerLogo: {
      fontSize: 20,
      fontWeight: '700',
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    headerSignUp: {
      fontSize: 14,
      fontWeight: '500',
      color: theme?.colors?.text?.primary || '#1E293B',
      paddingHorizontal: theme?.spacing?.[3] || 12,
      paddingVertical: theme?.spacing?.[2] || 8,
      borderRadius: theme?.borderRadius?.lg || 12,
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
    },
    headerLogoIconCircle: {
      backgroundColor: '#3C4FE0',
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Brand row inspired by LandingScreen
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[3] || 12,
    },
    brandIcon: {
      backgroundColor: theme?.colors?.accent?.green || '#10B981',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme?.spacing?.[3] || 12,
      ...(theme?.shadows?.sm || {}),
    },
    brandName: {
      fontWeight: '700',
      fontSize: 16,
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    brandTagline: {
      fontSize: 12,
      color: theme?.colors?.text?.secondary || '#64748B',
    },
    // Hero section with improved typography
    heroContainer: {
      alignItems: 'center',
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingTop: theme?.spacing?.[8] || 32,
      paddingBottom: theme?.spacing?.[6] || 24,
    },
    heroInner: {
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: '800',
      textAlign: 'center',
      color: theme?.colors?.accent?.green || '#22C55E',
      marginBottom: theme?.spacing?.[2] || 8,
    },
    heroSubtitle: {
      fontSize: 32,
      fontWeight: '800',
      textAlign: 'center',
      color: theme?.colors?.accent?.green || '#22C55E',
      marginBottom: theme?.spacing?.[3] || 12,
    },
    heroDescription: {
      fontSize: 16,
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[2] || 8,
    },
    heroSmallText: {
      fontSize: 14,
      color: theme?.colors?.text?.secondary || '#64748B',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[6] || 24,
    },
    heroGradientBg: { width: '100%', borderRadius: 24, overflow: 'hidden' },
    heroCtaButton: {
      marginTop: 16,
      borderRadius: 32,
      backgroundColor: '#3C4FE0',
      shadowColor: '#3C4FE0',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    heroCtaButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroCtaButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    // Rocket card inspired by LandingScreen
    rocketCard: {
      backgroundColor: theme?.colors?.accent?.green
        ? `${theme.colors.accent.green}20`
        : '#D1FAE5',
      width: 72,
      height: 72,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: theme?.spacing?.[6] || 24,
      ...(theme?.shadows?.sm || {}),
    },
    // Stats section with improved design
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[4] || 16,
      gap: theme?.spacing?.[2] || 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme?.colors?.surface?.card || '#FFFFFF',
      borderRadius: 16,
      padding: theme?.spacing?.[3] || 12,
      alignItems: 'center',
      marginHorizontal: theme?.spacing?.[1] || 4,
      ...(theme?.shadows?.sm || {}),
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
    },
    statNumber: {
      fontSize: 18,
      fontWeight: '700',
      color: theme?.colors?.text?.primary || '#1E293B',
      marginTop: theme?.spacing?.[1] || 4,
      marginBottom: theme?.spacing?.[1] || 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme?.colors?.text?.secondary || '#64748B',
      textAlign: 'center',
    },
    // Auth card with improved styling
    authCardContainer: {
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[6] || 24,
    },
    authCard: {
      maxWidth: 420,
      alignSelf: 'center',
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 28,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    authCardHeader: {
      alignItems: 'center',
      marginBottom: 20,
    },
    authCardHeaderTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#0F172A',
      textAlign: 'center',
    },
    authCardHeaderSubtitle: {
      fontSize: 16,
      color: '#64748B',
      textAlign: 'center',
      marginTop: 6,
    },
    authCardBody: {
      gap: theme?.spacing?.[4] || 16,
    },
    authCardButton: {
      borderRadius: 999,
      overflow: 'hidden',
      marginTop: 8,
      marginBottom: 18,
      height: 54,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      shadowColor: '#10B981',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    authButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    authButtonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 20,
      letterSpacing: 0.2,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 18,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#E5E7EB',
    },
    dividerText: {
      marginHorizontal: 12,
      fontSize: 12,
      color: '#94A3B8',
      textTransform: 'uppercase',
      fontWeight: '600',
      letterSpacing: 1,
    },
    socialButtonsContainer: {
      gap: 14,
      marginBottom: 10,
    },
    socialButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 18,
      marginBottom: 0,
      marginTop: 0,
      marginRight: 0,
      marginLeft: 0,
      marginVertical: 0,
    },
    socialButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialButtonText: {
      color: '#0F172A',
      fontWeight: '600',
      fontSize: 16,
      marginLeft: 10,
    },
    agreementText: {
      fontSize: 12,
      textAlign: 'center',
      color: '#94A3B8',
      marginTop: 18,
    },
    agreementLink: {
      color: '#10B981',
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    // Features section with improved design
    featuresContainer: {
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[6] || 24,
    },
    featuresInner: {
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
    },
    featuresTitle: {
      fontSize: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[6] || 24,
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme?.spacing?.[3] || 12,
      justifyContent: 'space-between',
    },
    featureCard: {
      width: '47%',
      backgroundColor: theme?.colors?.surface?.card || '#FFFFFF',
      borderRadius: 16,
      padding: theme?.spacing?.[4] || 16,
      alignItems: 'center',
      gap: theme?.spacing?.[3] || 12,
      ...(theme?.shadows?.sm || {}),
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
    },
    featureIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      ...(theme?.shadows?.sm || {}),
    },
    featureTitle: {
      fontWeight: '600',
      fontSize: 14,
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
    },
    featureDescription: {
      fontSize: 12,
      color: theme?.colors?.text?.secondary || '#64748B',
      textAlign: 'center',
    },
    // Bottom CTA with improved styling
    bottomCtaContainer: {
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[6] || 24,
    },
    bottomCtaInner: {
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      gap: theme?.spacing?.[4] || 16,
    },
    bottomCtaText: {
      fontSize: 16,
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
    },
    bottomCtaButton: {
      backgroundColor: theme?.colors?.surface?.card || '#FFFFFF',
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      borderRadius: 16,
    },
    bottomCtaButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme?.spacing?.[2] || 8,
    },
    bottomCtaButtonText: {
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    // Role selection with improved design
    roleSelectionContainer: {
      marginBottom: theme?.spacing?.[4] || 16,
      gap: theme?.spacing?.[3] || 12,
    },
    roleSelectionLabel: {
      fontSize: 16,
      color: theme?.colors?.text?.primary || '#1E293B',
      fontWeight: '500',
      textAlign: 'center',
    },
    roleOptionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme?.spacing?.[3] || 12,
    },
    roleOption: {
      flex: 1,
      padding: theme?.spacing?.[3] || 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      backgroundColor: theme?.colors?.surface?.card || '#FFFFFF',
      alignItems: 'center',
      gap: theme?.spacing?.[2] || 8,
    },
    roleOptionActive: {
      borderColor: theme?.colors?.primary?.main || '#3C4FE0',
      backgroundColor: theme?.colors?.primary?.main
        ? `${theme.colors.primary.main}10`
        : '#EEF2FF',
    },
    roleOptionIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
      alignItems: 'center',
      justifyContent: 'center',
    },
    roleOptionIconActive: {
      backgroundColor: theme?.colors?.primary?.main || '#3C4FE0',
    },
    roleOptionText: {
      fontSize: 14,
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
      fontWeight: '500',
    },
    roleOptionTextActive: {
      color: theme?.colors?.primary?.main || '#3C4FE0',
    },
    roleOptionBadge: {
      backgroundColor: theme?.colors?.primary?.main || '#3C4FE0',
      paddingHorizontal: theme?.spacing?.[2] || 8,
      paddingVertical: theme?.spacing?.[1] || 4,
      borderRadius: 8,
    },
    roleOptionBadgeText: {
      fontSize: 10,
      color: theme?.colors?.text?.white || '#FFFFFF',
      fontWeight: '600',
    },
    phoneInput: {
      backgroundColor: '#F8FAFC',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      paddingVertical: 14,
      paddingHorizontal: 20,
      fontSize: 16,
      color: '#334155',
      marginBottom: 12,
    },
    headerSignUpButton: {
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
  });

const IndexScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme || {});
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber] = useState('');
  const [email] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState('getHired'); // 'getHired' or 'hireSomeone'

  // Use useRef to persist animated values across renders
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateFloating = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim1, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim1, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim2, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim2, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim3, {
            toValue: 1,
            duration: 3500,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim3, {
            toValue: 0,
            duration: 3500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateFloating();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const demoUser = {
        id: `demo-user-${Date.now()}`,
        name: phoneNumber.trim() || 'Demo User',
        email: email.trim() || 'demo@jobconnect.app',
        mode: userRole === 'getHired' ? 'seeker' : 'employer',
      };

      await login(demoUser);
    } catch (error) {
      // Handle login error gracefully
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: 'target',
      title: 'Smart Matching',
      description: 'AI-powered job recommendations',
      color: ['#3C4FE0', '#6366F1'], // Blue
      delay: 0,
    },
    {
      icon: 'zap',
      title: 'Instant Apply',
      description: 'One-swipe job applications',
      color: ['#10B981', '#06B6D4'], // Green
      delay: 200,
    },
    {
      icon: 'globe',
      title: 'Local Focus',
      description: 'Opportunities in your city',
      color: ['#fff', '#F1F5F9'], // White
      delay: 400,
    },
    {
      icon: 'award',
      title: 'Career Growth',
      description: 'Track your progress',
      color: ['#fff', '#F1F5F9'], // White
      delay: 600,
    },
  ];

  const stats = [
    {
      number: '10K+',
      label: 'Jobs Posted',
      icon: 'briefcase',
      type: 'Feather',
    },
    { number: '5K+', label: 'Happy Users', icon: 'heart', type: 'Feather' },
    {
      number: '500+',
      label: 'Companies',
      icon: 'star',
      type: 'Feather',
    },
  ];

  // Memoize expensive array creation
  const floatingElements = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        icon: ['sparkles', 'star', 'target', 'zap'][i % 4],
        left: `${((i * 47) % 85) + 10}%`,
        top: `${((i * 73) % 70) + 15}%`,
        delay: i * 300,
        duration: 4000 + (i % 3) * 1000,
      })),
    [],
  );

  const AnimatedBackground = () => (
    <View style={styles.backgroundContainer}>
      <Animated.View
        style={[
          styles.floatingShape1,
          {
            transform: [
              {
                translateY: floatingAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.floatingShape2,
          {
            transform: [
              {
                translateY: floatingAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.floatingShape3,
          {
            transform: [
              {
                translateY: floatingAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 8],
                }),
              },
            ],
          },
        ]}
      />

      {floatingElements.map(element => (
        <Animated.View
          key={element.id}
          style={{
            position: 'absolute',
            left: element.left,
            top: element.top,
            opacity: 0.06,
            transform: [
              {
                translateY: floatingAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, element.id % 2 === 0 ? 8 : -8],
                }),
              },
            ],
          }}
        >
          <Feather
            name={element.icon}
            size={20}
            color={theme?.colors?.text?.tertiary || '#94A3B8'}
          />
        </Animated.View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedBackground />

      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{ paddingBottom: theme?.spacing?.[8] || 32 }}
      >
        {/* Subheading: green icon + JobConnect + tagline */}
        <View style={{ position: 'relative' }}>
          {/* Sign Up button absolutely positioned */}
          <TouchableOpacity
            onPress={() => setIsLogin(!isLogin)}
            style={[
              styles.headerSignUpButton,
              { position: 'absolute', top: 0, right: 0, zIndex: 10 },
            ]}
          >
            <Text style={styles.headerSignUp}>Sign Up</Text>
          </TouchableOpacity>

          {/* Brand row below */}
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Feather
                name="send"
                size={20}
                color={theme?.colors?.text?.white || '#FFFFFF'}
              />
            </View>
            <View>
              <Text style={styles.brandName}>JobConnect</Text>
              <Text style={styles.brandTagline}>Your career, reimagined</Text>
            </View>
          </View>
        </View>

        {/* Hero Section with improved typography */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={[
              theme?.colors?.background?.primary || '#FFFFFF',
              '#F8FAFC',
            ]}
            style={styles.heroGradientBg}
          >
            <View style={styles.heroInner}>
              <Text style={styles.heroTitle}>Swipe Into</Text>
              <Text style={styles.heroSubtitle}>Your Dream Job</Text>
              <Text style={styles.heroDescription}>
                Discover opportunities with a swipe
              </Text>
              <Text style={styles.heroSmallText}>
                Revolutionary job discovery that feels like magic
              </Text>
              {/* Rocket card inspired by LandingScreen */}
              <View style={styles.rocketCard}>
                <Feather
                  name="rocket"
                  size={36}
                  color={theme?.colors?.primary?.main || '#3C4FE0'}
                />
              </View>
              {/* 3. Add prominent CTA button below hero section */}
              <Button
                variant="primary"
                size="lg"
                style={styles.heroCtaButton}
                onPress={handleLogin}
              >
                <View style={styles.heroCtaButtonContent}>
                  <Feather
                    name="briefcase"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.heroCtaButtonText}>Find Jobs ✨</Text>
                </View>
              </Button>
            </View>
          </LinearGradient>
        </View>

        {/* Stats section with improved design */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard}>
              <Feather
                name={stat.icon}
                size={20}
                color={theme?.colors?.primary?.main || '#3C4FE0'}
              />
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Auth Card with improved styling */}
        <View style={styles.authCardContainer}>
          <Card style={styles.authCard}>
            <View style={styles.authCardHeader}>
              <Text style={styles.authCardHeaderTitle}>
                Welcome to JobConnect
              </Text>
              <Text style={styles.authCardHeaderSubtitle}>
                Explore the amazing features and interface
              </Text>
            </View>

            <View style={styles.authCardBody}>
              {!isLogin && (
                <Input
                  label="Email (Optional)"
                  placeholder="your@email.com"
                  variant="glass"
                  leftIcon={
                    <Feather
                      name="mail"
                      size={16}
                      color={theme?.colors?.text?.tertiary || '#94A3B8'}
                    />
                  }
                />
              )}
              {isLogin && (
                <Input
                  label="Phone Number"
                  placeholder="+91 XXXXX XXXXX"
                  variant="glass"
                  leftIcon={
                    <Feather
                      name="phone"
                      size={16}
                      color={theme?.colors?.text?.tertiary || '#94A3B8'}
                    />
                  }
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                />
              )}

              <View style={styles.roleSelectionContainer}>
                <Text style={styles.roleSelectionLabel}>
                  What do you want to do?
                </Text>
                <View style={styles.roleOptionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      userRole === 'getHired' && styles.roleOptionActive,
                    ]}
                    onPress={() => setUserRole('getHired')}
                  >
                    <View
                      style={[
                        styles.roleOptionIcon,
                        userRole === 'getHired' && styles.roleOptionIconActive,
                      ]}
                    >
                      <Feather
                        name="search"
                        size={12}
                        color={
                          userRole === 'getHired'
                            ? theme?.colors?.text?.white || '#FFFFFF'
                            : theme?.colors?.text?.secondary || '#64748B'
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.roleOptionText,
                        userRole === 'getHired' && styles.roleOptionTextActive,
                      ]}
                    >
                      Find a job
                    </Text>
                    {userRole === 'getHired' && (
                      <View style={styles.roleOptionBadge}>
                        <Text style={styles.roleOptionBadgeText}>Popular</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      userRole === 'hireSomeone' && styles.roleOptionActive,
                    ]}
                    onPress={() => setUserRole('hireSomeone')}
                  >
                    <View
                      style={[
                        styles.roleOptionIcon,
                        userRole === 'hireSomeone' &&
                          styles.roleOptionIconActive,
                      ]}
                    >
                      <Feather
                        name="plus"
                        size={12}
                        color={
                          userRole === 'hireSomeone'
                            ? theme?.colors?.text?.white || '#FFFFFF'
                            : theme?.colors?.text?.secondary || '#64748B'
                        }
                      />
                    </View>
                    <Text
                      style={[
                        styles.roleOptionText,
                        userRole === 'hireSomeone' &&
                          styles.roleOptionTextActive,
                      ]}
                    >
                      Post a job
                    </Text>
                    {userRole === 'hireSomeone' && (
                      <View style={styles.roleOptionBadge}>
                        <Text style={styles.roleOptionBadgeText}>Verified</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
              </View>

              <View
                style={[
                  styles.socialButtonsContainer,
                  { flexDirection: 'row', gap: 12 },
                ]}
              >
                <TouchableOpacity style={styles.socialButton}>
                  <View style={styles.socialButtonContent}>
                    <FontAwesome name="google" size={20} color="#222" />
                    <Text style={styles.socialButtonText}>
                      Continue with Google
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <View style={styles.socialButtonContent}>
                    <Feather name="phone" size={20} color="#10B981" />
                    <Text style={styles.socialButtonText}>
                      Connect with WhatsApp
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                style={{
                  borderRadius: 999,
                  overflow: 'hidden',
                  marginTop: 8,
                  marginBottom: 18,
                }}
              >
                <LinearGradient
                  colors={['#10B981', '#06B6D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: '100%',
                    height: 54,
                    borderRadius: 999,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: 20,
                      letterSpacing: 0.2,
                    }}
                  >
                    Enter Dashboard
                  </Text>
                  <Feather
                    name="sparkles"
                    size={20}
                    color="#fff"
                    style={{ marginLeft: 8 }}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.agreementText}>
                By continuing you agree to our{' '}
                <Text style={styles.agreementLink} onPress={() => {}}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={styles.agreementLink} onPress={() => {}}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </Card>
        </View>

        {/* Features section with improved design */}
        <View style={styles.featuresContainer}>
          <View style={styles.featuresInner}>
            <Text style={styles.featuresTitle}>Why Choose Our Platform?</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <TouchableOpacity key={index} style={styles.featureCard}>
                  <LinearGradient
                    colors={feature.color}
                    style={styles.featureIcon}
                  >
                    <Feather
                      name={feature.icon}
                      size={20}
                      color={theme?.colors?.text?.white || '#FFFFFF'}
                    />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Bottom CTA with improved styling */}
        <View style={styles.bottomCtaContainer}>
          <View style={styles.bottomCtaInner}>
            <Text style={styles.bottomCtaText}>
              Ready to revolutionize your job search?
            </Text>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              style={styles.bottomCtaButton}
            >
              <View style={styles.bottomCtaButtonContent}>
                <Feather
                  name="briefcase"
                  size={20}
                  color={theme?.colors?.text?.primary || '#1E293B'}
                />
                <Text style={styles.bottomCtaButtonText}>
                  Post a Job for Employers
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndexScreen;
