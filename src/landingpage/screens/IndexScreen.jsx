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
import Button from '../../components/elements/Button';
import Input from '../../components/elements/Input';
import Card from '../../components/blocks/Card';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import GoogleSignInButton from '../../shared/components/GoogleSignInButton';
import AnimatedBackground from '../components/AnimatedBackground';
import FeatureCards from '../components/FeatureCards';
import StatsRow from '../components/StatsRow';
import { getStyles } from './IndexScreen.styles.js';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

  const handleGoogleSignInResult = async result => {
    setIsLoading(true);
    try {
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data && result.userRecord !== undefined) {
        await login({
          session: result.data.session,
          user: result.data.user,
          userRecord: result.userRecord,
          isNewUser: result.isNewUser,
        });
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      // Handle login error gracefully
      setIsLoading(false);
    }
  };

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
        <StatsRow />

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
                <View style={styles.socialButton}>
                  <GoogleSignInButton onSuccess={handleGoogleSignInResult} />
                </View>
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
        <FeatureCards />

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
