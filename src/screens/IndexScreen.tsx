import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Card, Input } from '../components/ui';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import type { AuthStackParamList, UserProfile } from '../types/navigation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const IndexScreen = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animated values for floating elements
  const floatingAnim1 = new Animated.Value(0);
  const floatingAnim2 = new Animated.Value(0);
  const floatingAnim3 = new Animated.Value(0);

  useEffect(() => {
    // Start floating animations
    const animateFloating = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim1, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim1, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim2, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim2, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim3, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim3, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateFloating();
  }, []);

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate authentication - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a user profile object
      const userProfile: UserProfile = {
        id: Date.now().toString(), // In real app, this would come from the API
        name: `User ${phoneNumber}`, // In real app, get from API
        email: email || `user${phoneNumber}@example.com`,
        mode: 'seeker', // Default to seeker, can add user selection later
      };
      
      // Use your existing login method
      await login(userProfile);
      
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: 'target',
      title: 'Smart Matching',
      description: 'AI-powered job recommendations',
      color: [theme.colors.status.info, '#E91E63'],
      delay: 0,
    },
    {
      icon: 'zap',
      title: 'Instant Apply',
      description: 'One-swipe job applications',
      color: ['#00BCD4', theme.colors.status.info],
      delay: 200,
    },
    {
      icon: 'globe',
      title: 'Local Focus',
      description: 'Opportunities in your city',
      color: [theme.colors.primary.emerald, theme.colors.primary.forest],
      delay: 400,
    },
    {
      icon: 'award',
      title: 'Career Growth',
      description: 'Track your progress',
      color: [theme.colors.accent.orange, '#F44336'],
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
    {number: '5K+', label: 'Happy Users', icon: 'heart', type: 'FontAwesome'},
    {
      number: '500+',
      label: 'Companies',
      icon: 'building-o',
      type: 'FontAwesome',
    },
  ];

  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    icon: ['sparkles', 'star', 'target', 'zap', 'heart'][i % 5],
    left: `${(i * 47) % 90 + 5}%`,
    top: `${(i * 73) % 80 + 10}%`,
    delay: i * 200,
    duration: 3000 + (i % 3) * 1000,
  }));

  const AnimatedBackground = () => (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: screenWidth,
      height: screenHeight,
    }}>
      {/* Large background blobs */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 384,
          height: 384,
          top: '10%',
          left: '10%',
          borderRadius: 192,
          backgroundColor: 'rgba(156, 39, 176, 0.4)', // Purple with opacity
          transform: [
            {
              translateY: floatingAnim1.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              }),
            },
          ],
        }}
      />
      
      <Animated.View
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          bottom: '20%',
          right: '15%',
          borderRadius: 160,
          backgroundColor: 'rgba(0, 188, 212, 0.4)', // Cyan with opacity
          transform: [
            {
              translateY: floatingAnim2.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15],
              }),
            },
          ],
        }}
      />
      
      <Animated.View
        style={{
          position: 'absolute',
          width: 256,
          height: 256,
          top: '50%',
          left: '60%',
          borderRadius: 128,
          backgroundColor: 'rgba(76, 175, 80, 0.4)', // Emerald with opacity
          transform: [
            {
              translateY: floatingAnim3.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10],
              }),
            },
          ],
        }}
      />

      {/* Floating particles */}
      {floatingElements.map((element) => (
        <Animated.View
          key={element.id}
          style={{
            position: 'absolute',
            left: element.left,
            top: element.top,
            opacity: 0.1,
            transform: [
              {
                translateY: floatingAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, element.id % 2 === 0 ? 10 : -10],
                }),
              },
            ],
          } as any}
        >
          <Feather name={element.icon as any} size={24} color={theme.colors.text.tertiary} />
        </Animated.View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E3F2FD', '#F3E5F5', '#FCE4EC']} // Blue to purple to pink gradient
        style={styles.container}
      >
        <AnimatedBackground />
        
        <ScrollView 
          style={{ flex: 1, zIndex: 10 }}
          contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
        >
          {/* Header */}
          <View style={{
            paddingHorizontal: theme.spacing[4],
            paddingVertical: theme.spacing[6],
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: 400,
              alignSelf: 'center',
              width: '100%',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
                <LinearGradient
                  colors={[theme.colors.primary.emerald, '#00BCD4']}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...theme.shadows.lg,
                  }}
                >
                  <Feather name="rocket" size={24} color={theme.colors.text.white} />
                </LinearGradient>
                <View>
                  <Text style={{
                    fontWeight: theme.typography.h5.fontWeight,
                    fontSize: 18,
                    color: theme.colors.text.primary,
                  }}>
                    JobConnect
                  </Text>
                  <Text style={{
                    fontSize: theme.typography.caption.fontSize,
                    color: theme.colors.text.secondary,
                  }}>
                    Your career, reimagined
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setIsLogin(!isLogin)}
                style={{
                  paddingHorizontal: theme.spacing[3],
                  paddingVertical: theme.spacing[2],
                  borderRadius: theme.borderRadius.xl,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Text style={{
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.bodySmall.fontSize,
                  fontWeight: theme.typography.button.fontWeight,
                }}>
                  {isLogin ? 'Sign Up' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.heroContainer}>
            <View style={styles.heroInner}>
              <View style={{ alignItems: 'center', gap: theme.spacing[4] }}>
                <Text style={styles.heroTitle}>
                  <Text>Swipe Into</Text>
                  {'\n'}
                  <Text>Your Dream Job</Text>
                </Text>
                <Text style={styles.heroSubtitle}>
                  Discover opportunities with a swipe
                </Text>
                <Text style={styles.heroDescription}>
                  Revolutionary job discovery that feels like magic
                </Text>
              </View>

              {/* Interactive Stats */}
              <View style={styles.statsRow}>
                {stats.map((stat, index) => (
                  <TouchableOpacity key={index} style={styles.statCard}>
                    {stat.type === 'Feather' ? (
                      <Feather name={stat.icon} size={24} color={theme.colors.primary.emerald} />
                    ) : (
                      <FontAwesome name={stat.icon} size={24} color={theme.colors.primary.emerald} />
                    )}
                    <Text style={styles.statNumber}>{stat.number}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Auth Card */}
          <View style={styles.authCardContainer}>
            <Card style={styles.authCard}>
              <View style={styles.authCardHeader}>
                <Text style={styles.authCardHeaderTitle}>
                  {isLogin ? 'Welcome Back' : 'Join the Revolution'}
                </Text>
                <Text style={styles.authCardHeaderSubtitle}>
                  Start your journey to career success
                </Text>
              </View>

              <View style={styles.authCardBody}>
                {/* Phone input */}
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  variant="glass"
                  leftIcon={<FontAwesome name="phone" size={16} color={theme.colors.text.tertiary} />}
                />

                {!isLogin && (
                  <Input
                    label="Email (Optional)"
                    placeholder="your@email.com"
                    variant="glass"
                    leftIcon={<Feather name="mail" size={16} color={theme.colors.text.tertiary} />}
                  />
                )}

                <Button
                  variant="gradient"
                  size="lg"
                  style={styles.authCardButton}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <View style={styles.authButtonContent}>
                    <Text style={styles.authButtonText}>
                      {isLoading ? 'Signing in...' : isLogin ? 'Enter Dashboard' : 'Begin Journey'}
                    </Text>
                    <FontAwesome name="arrow-circle-right" size={20} color={theme.colors.text.white} />
                  </View>
                </Button>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or continue with</Text>
                </View>

                {/* Social login options */}
                <View style={styles.socialButtonsContainer}>
                  <Button variant="outline" style={styles.socialButton}>
                    <View style={styles.socialButtonContent}>
                      <FontAwesome name="google" size={20} color={theme.colors.text.primary} />
                      <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </View>
                  </Button>

                  <Button variant="outline" style={styles.socialButton}>
                    <View style={styles.socialButtonContent}>
                      <FontAwesome name="phone" size={20} color={theme.colors.text.primary} />
                      <Text style={styles.socialButtonText}>Connect with WhatsApp</Text>
                    </View>
                  </Button>
                </View>

                <Text style={styles.agreementText}>
                  By continuing you agree to our{' '}
                  <Text style={styles.agreementLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.agreementLink}>Privacy Policy</Text>
                </Text>
              </View>
            </Card>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresContainer}>
            <View style={styles.featuresInner}>
              <Text style={styles.featuresTitle}>Why Choose Our Platform?</Text>
              <View style={styles.featuresGrid}>
                {features.map((feature, index) => (
                  <TouchableOpacity key={index} style={styles.featureCard}>
                    <LinearGradient colors={feature.color} style={styles.featureIcon}>
                      <Feather name={feature.icon} size={24} color={theme.colors.text.white} />
                    </LinearGradient>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom CTA */}
          <View style={styles.bottomCtaContainer}>
            <View style={styles.bottomCtaInner}>
              <Text style={styles.bottomCtaText}>
                Ready to revolutionize your job search?
              </Text>
              <Button variant="outline" size="lg" fullWidth style={styles.bottomCtaButton}>
                <View style={styles.bottomCtaButtonContent}>
                  <Feather name="briefcase" size={20} color={theme.colors.text.primary} />
                  <Text style={styles.bottomCtaButtonText}>Post a Job for Employers</Text>
                </View>
              </Button>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
  },
  heroContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[8],
  },
  heroInner: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  heroTitle: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    textAlign: 'center',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  heroSubtitle: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: '500',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    paddingVertical: theme.spacing[6],
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing[4],
    alignItems: 'center',
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  authCardContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[8],
  },
  authCard: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...theme.shadows.xl,
  },
  authCardHeader: {
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  authCardHeaderTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text.primary,
  },
  authCardHeaderSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  authCardBody: {
    gap: theme.spacing[4],
  },
  authCardButton: {
    backgroundColor: theme.colors.primary.emerald,
    ...theme.shadows.lg,
  },
  authButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  authButtonText: {
    color: theme.colors.text.white,
  },
  dividerContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing[4],
  },
  dividerLine: {
    height: 1,
    backgroundColor: theme.colors.border.primary,
    width: '100%',
    position: 'absolute',
    top: '50%',
  },
  dividerText: {
    backgroundColor: theme.colors.background.secondary,
    paddingHorizontal: theme.spacing[4],
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
  },
  socialButtonsContainer: {
    gap: theme.spacing[3],
  },
  socialButton: {
    backgroundColor: '#F5F5F5',
    borderColor: theme.colors.border.primary,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  socialButtonText: {
    color: theme.colors.text.primary,
  },
  agreementText: {
    fontSize: theme.typography.labelSmall.fontSize,
    textAlign: 'center',
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[4],
  },
  agreementLink: {
    color: theme.colors.primary.emerald,
    fontWeight: '500',
  },
  featuresContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[8],
  },
  featuresInner: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  featuresTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    color: theme.colors.text.primary,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[4],
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius['2xl'],
    padding: theme.spacing[4],
    alignItems: 'center',
    gap: theme.spacing[3],
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  featureTitle: {
    fontWeight: theme.typography.label.fontWeight,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  bottomCtaContainer: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[6],
  },
  bottomCtaInner: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  bottomCtaText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  bottomCtaButton: {
    backgroundColor: '#F5F5F5',
    borderColor: theme.colors.border.primary,
  },
  bottomCtaButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  bottomCtaButtonText: {
    color: theme.colors.text.primary,
  },

});

export default IndexScreen;