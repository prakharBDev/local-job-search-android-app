import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../contexts/ThemeContext';

const features = [
  {
    icon: 'target',
    title: 'Smart Matching',
    description: 'AI-powered job recommendations',
    color: ['#3C4FE0', '#6366F1'],
    delay: 0,
  },
  {
    icon: 'zap',
    title: 'Instant Apply',
    description: 'One-swipe job applications',
    color: ['#10B981', '#06B6D4'],
    delay: 200,
  },
  {
    icon: 'globe',
    title: 'Local Focus',
    description: 'Opportunities in your city',
    color: ['#fff', '#F1F5F9'],
    delay: 400,
  },
  {
    icon: 'award',
    title: 'Career Growth',
    description: 'Track your progress',
    color: ['#fff', '#F1F5F9'],
    delay: 600,
  },
];

const FeatureCards = () => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
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
  });

  return (
    <View style={styles.featuresContainer}>
      <View style={styles.featuresInner}>
        <Text style={styles.featuresTitle}>Key Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Feather name={feature.icon} size={24} color={feature.color[0]} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FeatureCards; 