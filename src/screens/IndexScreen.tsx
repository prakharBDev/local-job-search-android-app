import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Card, Input } from '../components/ui';
import { theme } from '../theme';

// Mock icons (we'll replace with actual icons later)
const IconPlaceholder = ({
  name: _name,
  size = 20,
  color = theme.colors.text.primary,
}: {
  name: string;
  size?: number;
  color?: string;
}) => (
  <View
    style={{
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: size / 4,
    }}
  />
);

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const IndexScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

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
        ]),
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
        ]),
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
        ]),
      ).start();
    };

    animateFloating();
  }, [floatingAnim1, floatingAnim2, floatingAnim3]);

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
    { number: '10K+', label: 'Jobs Posted', icon: 'briefcase' },
    { number: '5K+', label: 'Happy Users', icon: 'heart' },
    { number: '500+', label: 'Companies', icon: 'star' },
  ];

  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    icon: ['sparkles', 'star', 'target', 'zap', 'heart'][i % 5],
    left: `${((i * 47) % 90) + 5}%`,
    top: `${((i * 73) % 80) + 10}%`,
    delay: i * 200,
    duration: 3000 + (i % 3) * 1000,
  }));

  const AnimatedBackground = () => (
    <View
              style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: screenWidth,
          height: screenHeight,
        }}
    >
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
      {floatingElements.map(element => (
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
          }}
        >
          <IconPlaceholder
            name={element.icon}
            size={24}
            color={theme.colors.text.tertiary}
          />
        </Animated.View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#E3F2FD', '#F3E5F5', '#FCE4EC']} // Blue to purple to pink gradient
        style={{ flex: 1 }}
      >
        <AnimatedBackground />

        <ScrollView
          style={{ flex: 1, zIndex: 10 }}
          contentContainerStyle={{ paddingBottom: theme.spacing[8] }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: theme.spacing[4],
              paddingVertical: theme.spacing[6],
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: 400,
                alignSelf: 'center',
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing[3],
                }}
              >
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
                  <IconPlaceholder
                    name="rocket"
                    size={24}
                    color={theme.colors.text.white}
                  />
                </LinearGradient>
                <View>
                  <Text
                    style={{
                      fontWeight: theme.typography.h5.fontWeight,
                      fontSize: 18,
                      color: theme.colors.text.primary,
                    }}
                  >
                    JobConnect
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.caption.fontSize,
                      color: theme.colors.text.secondary,
                    }}
                  >
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
                <Text
                  style={{
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.bodySmall.fontSize,
                    fontWeight: theme.typography.button.fontWeight,
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Section */}
          <View
            style={{
              paddingHorizontal: theme.spacing[4],
              paddingVertical: theme.spacing[8],
              alignItems: 'center',
            }}
          >
            <View
              style={{
                maxWidth: 400,
                alignItems: 'center',
                gap: theme.spacing[6],
              }}
            >
              <View style={{ alignItems: 'center', gap: theme.spacing[4] }}>
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: theme.typography.h1.fontWeight,
                    textAlign: 'center',
                    lineHeight: 52,
                    color: theme.colors.text.primary,
                  }}
                >
                  <Text>Swipe Into</Text>
                  {'\n'}
                  <Text>Your Dream Job</Text>
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.bodyLarge.fontSize,
                    fontWeight: '500',
                    color: theme.colors.text.primary,
                    textAlign: 'center',
                  }}
                >
                  Discover opportunities with a swipe
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.body.fontSize,
                    color: theme.colors.text.secondary,
                    textAlign: 'center',
                  }}
                >
                  Revolutionary job discovery that feels like magic
                </Text>
              </View>

              {/* Interactive Stats */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: theme.spacing[4],
                  paddingVertical: theme.spacing[6],
                }}
              >
                {stats.map((stat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: theme.borderRadius['2xl'],
                      padding: theme.spacing[4],
                      alignItems: 'center',
                      ...theme.shadows.lg,
                      borderWidth: 1,
                      borderColor: theme.colors.border.primary,
                    }}
                  >
                    <IconPlaceholder
                      name={stat.icon}
                      size={24}
                      color={theme.colors.primary.emerald}
                    />
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: theme.typography.h3.fontWeight,
                        color: theme.colors.text.primary,
                        marginTop: theme.spacing[2],
                        marginBottom: theme.spacing[1],
                      }}
                    >
                      {stat.number}
                    </Text>
                    <Text
                      style={{
                        fontSize: theme.typography.caption.fontSize,
                        color: theme.colors.text.secondary,
                        textAlign: 'center',
                      }}
                    >
                      {stat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Auth Card */}
          <View
            style={{
              paddingHorizontal: theme.spacing[4],
              paddingBottom: theme.spacing[8],
            }}
          >
            <Card
              variant="glass"
              style={{
                maxWidth: 400,
                alignSelf: 'center',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                ...theme.shadows.xl,
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  marginBottom: theme.spacing[4],
                }}
              >
                <Text
                  style={{
                    fontSize: theme.typography.h4.fontSize,
                    fontWeight: theme.typography.h4.fontWeight,
                    color: theme.colors.text.primary,
                  }}
                >
                  {isLogin ? 'Welcome Back' : 'Join the Revolution'}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.body.fontSize,
                    color: theme.colors.text.secondary,
                    textAlign: 'center',
                  }}
                >
                  Start your journey to career success
                </Text>
              </View>

              <View style={{ gap: theme.spacing[4] }}>
                {/* Phone input */}
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  variant="glass"
                  leftIcon={
                    <IconPlaceholder
                      name="phone"
                      size={16}
                      color={theme.colors.text.tertiary}
                    />
                  }
                />

                {!isLogin && (
                  <Input
                    label="Email (Optional)"
                    placeholder="your@email.com"
                    variant="glass"
                    leftIcon={
                      <IconPlaceholder
                        name="mail"
                        size={16}
                        color={theme.colors.text.tertiary}
                      />
                    }
                  />
                )}

                <Button
                  variant="gradient"
                  size="lg"
                  style={{
                    backgroundColor: theme.colors.primary.emerald,
                    ...theme.shadows.lg,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.text.white,
                      marginRight: theme.spacing[2],
                    }}
                  >
                    {isLogin ? 'Enter Dashboard' : 'Begin Journey'}
                  </Text>
                  <IconPlaceholder
                    name="sparkles"
                    size={20}
                    color={theme.colors.text.white}
                  />
                </Button>

                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: theme.spacing[4],
                  }}
                >
                  <View
                    style={{
                      height: 1,
                      backgroundColor: theme.colors.border.primary,
                      width: '100%',
                      position: 'absolute',
                      top: '50%',
                    }}
                  />
                  <Text
                    style={{
                      backgroundColor: theme.colors.background.secondary,
                      paddingHorizontal: theme.spacing[4],
                      fontSize: theme.typography.caption.fontSize,
                      color: theme.colors.text.secondary,
                      textTransform: 'uppercase',
                    }}
                  >
                    Or continue with
                  </Text>
                </View>

                {/* Social login options */}
                <View style={{ gap: theme.spacing[3] }}>
                  <Button
                    variant="outline"
                    style={{
                      backgroundColor: '#F5F5F5',
                      borderColor: theme.colors.border.primary,
                    }}
                  >
                    <IconPlaceholder
                      name="google"
                      size={20}
                      color={theme.colors.text.primary}
                    />
                    <Text
                      style={{
                        color: theme.colors.text.primary,
                        marginLeft: theme.spacing[2],
                      }}
                    >
                      Continue with Google
                    </Text>
                  </Button>

                  <Button
                    variant="outline"
                    style={{
                      backgroundColor: '#F5F5F5',
                      borderColor: theme.colors.border.primary,
                    }}
                  >
                    <IconPlaceholder
                      name="phone"
                      size={20}
                      color={theme.colors.text.primary}
                    />
                    <Text
                      style={{
                        color: theme.colors.text.primary,
                        marginLeft: theme.spacing[2],
                      }}
                    >
                      Connect with WhatsApp
                    </Text>
                  </Button>
                </View>

                <Text
                  style={{
                    fontSize: theme.typography.labelSmall.fontSize,
                    textAlign: 'center',
                    color: theme.colors.text.tertiary,
                    marginTop: theme.spacing[4],
                  }}
                >
                  By continuing you agree to our{' '}
                  <Text
                    style={{
                      color: theme.colors.primary.emerald,
                      fontWeight: '500',
                    }}
                  >
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text
                    style={{
                      color: theme.colors.primary.emerald,
                      fontWeight: '500',
                    }}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </Card>
          </View>

          {/* Features Grid */}
          <View
            style={{
              paddingHorizontal: theme.spacing[4],
              paddingVertical: theme.spacing[8],
            }}
          >
            <View style={{ maxWidth: 400, alignSelf: 'center', width: '100%' }}>
              <Text
                style={{
                  fontSize: theme.typography.h4.fontSize,
                  fontWeight: theme.typography.h4.fontWeight,
                  textAlign: 'center',
                  marginBottom: theme.spacing[6],
                  color: theme.colors.text.primary,
                }}
              >
                Why Choose Our Platform?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: theme.spacing[4],
                  justifyContent: 'space-between',
                }}
              >
                {features.map((feature, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: '47%',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: theme.borderRadius['2xl'],
                      padding: theme.spacing[4],
                      alignItems: 'center',
                      gap: theme.spacing[3],
                      ...theme.shadows.lg,
                      borderWidth: 1,
                      borderColor: theme.colors.border.primary,
                    }}
                  >
                    <LinearGradient
                      colors={feature.color}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: theme.borderRadius.xl,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...theme.shadows.lg,
                      }}
                    >
                      <IconPlaceholder
                        name={feature.icon}
                        size={24}
                        color={theme.colors.text.white}
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        fontWeight: theme.typography.label.fontWeight,
                        fontSize: theme.typography.bodySmall.fontSize,
                        color: theme.colors.text.primary,
                        textAlign: 'center',
                      }}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: theme.typography.labelSmall.fontSize,
                        color: theme.colors.text.secondary,
                        textAlign: 'center',
                      }}
                    >
                      {feature.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Bottom CTA */}
          <View
            style={{
              paddingHorizontal: theme.spacing[4],
              paddingVertical: theme.spacing[6],
            }}
          >
            <View
              style={{
                maxWidth: 400,
                alignSelf: 'center',
                width: '100%',
                alignItems: 'center',
                gap: theme.spacing[4],
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.body.fontSize,
                  color: theme.colors.text.secondary,
                  textAlign: 'center',
                }}
              >
                Ready to revolutionize your job search?
              </Text>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                style={{
                  backgroundColor: '#F5F5F5',
                  borderColor: theme.colors.border.primary,
                }}
              >
                <IconPlaceholder
                  name="briefcase"
                  size={20}
                  color={theme.colors.text.primary}
                />
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    marginLeft: theme.spacing[2],
                  }}
                >
                  Post a Job for Employers
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default IndexScreen;
