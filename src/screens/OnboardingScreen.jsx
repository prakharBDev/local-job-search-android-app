import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
    },
    skipContainer: {
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    skipButton: {
      paddingHorizontal: 0,
      paddingVertical: 8,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    iconContainer: {
      marginBottom: 32,
    },
    icon: {
      fontSize: 80,
      textAlign: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 16,
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
      paddingHorizontal: 20,
      color: theme?.colors?.text?.secondary || '#475569',
    },
    featuresContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 40,
    },
    featureCard: {
      flex: 1,
      marginHorizontal: 8,
      padding: 16,
      alignItems: 'center',
    },
    featureTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
      textAlign: 'center',
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    featureDescription: {
      fontSize: 12,
      textAlign: 'center',
      lineHeight: 16,
      color: theme?.colors?.text?.secondary || '#475569',
    },
    bottomSection: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 32,
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    actionButtons: {
      width: '100%',
    },
    nextButton: {
      width: '100%',
    },
  });

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = getStyles(theme || {});
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: 'Welcome to JobPortal',
      description:
        'Discover amazing job opportunities and connect with top employers in your field.',
      icon: '\uD83D\uDC4B',
    },
    {
      title: 'Find Your Dream Job',
      description:
        'Browse through thousands of job listings from leading companies worldwide.',
      icon: '\uD83D\uDCBC',
    },
    {
      title: 'Apply with Ease',
      description:
        'Submit applications quickly and track your progress in real-time.',
      icon: '\uD83D\uDE80',
    },
    {
      title: 'Get Started',
      description:
        'Join thousands of professionals who found their perfect job through our platform.',
      icon: '\u2728',
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.goBack(); // or navigation.navigate('ProfileMain');
    }
  };

  const handleSkip = () => {
    navigation.goBack(); // or navigation.navigate('ProfileMain');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme?.colors?.background?.primary || '#FFFFFF'}
        translucent={false}
      />
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <Button
          title="Skip"
          variant="ghost"
          onPress={handleSkip}
          style={styles.skipButton}
        />
      </View>
      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{currentStepData.icon}</Text>
        </View>
        {/* Title */}
        <Text style={styles.title}>{currentStepData.title}</Text>
        {/* Description */}
        <Text style={styles.description}>{currentStepData.description}</Text>
        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          <Card variant="glass" style={styles.featureCard}>
            <Text style={styles.featureTitle}>Easy Application</Text>
            <Text style={styles.featureDescription}>
              One-click apply to multiple jobs
            </Text>
          </Card>
          <Card variant="glass" style={styles.featureCard}>
            <Text style={styles.featureTitle}>Real-time Updates</Text>
            <Text style={styles.featureDescription}>
              Get instant notifications on application status
            </Text>
          </Card>
        </View>
      </View>
      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index === currentStep
                      ? theme?.colors?.primary?.main || '#3C4FE0'
                      : theme?.colors?.border?.primary || '#E2E8F0',
                },
              ]}
            />
          ))}
        </View>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title={
              currentStep === onboardingSteps.length - 1
                ? 'Get Started'
                : 'Next'
            }
            variant="primary"
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
