import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import Card from '../../components/blocks/Card';
import DebugUtils from '../../utils/debug';
import { onboardingService } from '../../services/index.js';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CitySelectionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { updateUserRecord, user, checkAuthStatus, logout } = useAuth();
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const cities = [
    {
      id: 'morena',
      name: 'Morena',
      description: 'Industrial hub with growing opportunities',
      icon: 'map-pin',
      color: ['#6174f9', '#6174f9'],
    },
    {
      id: 'gwalior',
      name: 'Gwalior',
      description: 'Historic city with diverse job market',
      icon: 'map-pin',
      color: ['#10B981', '#059669'],
    },
  ];

  const handleCitySelect = cityId => {
    setSelectedCity(cityId);
  };

  const handleContinue = async () => {
    if (!selectedCity) {
      Alert.alert(
        'Please select a city',
        'You need to choose your preferred city to continue.',
      );
      return;
    }

    setIsLoading(true);
    
    try {
      // Update user record with selected city
      const result = await updateUserRecord({ city: selectedCity.toLowerCase() });
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Clear onboarding cache to force fresh check
      onboardingService.clearOnboardingCache(user.id);
      
      // Force a re-check of onboarding status
      await checkAuthStatus();
      
    } catch (error) {
      // Store error for debugging in release builds
      await DebugUtils.logError('CitySelection', 'handleContinue', error, {
        selectedCity,
        userId: user?.id,
      });
      
      Alert.alert(
        'Error',
        'Failed to update your city preference. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme?.colors?.background?.primary || '#FFFFFF',
          theme?.colors?.background?.secondary || '#F8FAFC',
        ]}
        style={styles.background}
      >
        <Animated.View
          style={[styles.content, { transform: [{ scale: scaleAnim }] }]}
        >
          {/* Header with Back Button */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                Alert.alert(
                  'Cancel Setup',
                  'Are you sure you want to cancel? You can complete setup later.',
                  [
                    { text: 'Continue Setup', style: 'cancel' },
                    {
                      text: 'Cancel',
                      style: 'destructive',
                      onPress: () => {
                        // Sign out user to return to login
                        logout();
                      },
                    },
                  ],
                );
              }}
            >
              <Feather name="arrow-left" size={24} color={theme?.colors?.text?.primary || '#1E293B'} />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#6174f9', '#6174f9']}
                style={styles.iconGradient}
              >
                <Feather name="map-pin" size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Choose Your City</Text>
            <Text style={styles.subtitle}>
              Select your preferred city to find relevant job opportunities in
              your area
            </Text>
          </View>

          {/* City Options */}
          <View style={styles.citiesContainer}>
            {cities.map(city => (
              <TouchableOpacity
                key={city.id}
                style={[
                  styles.cityCard,
                  selectedCity === city.id && styles.cityCardSelected,
                ]}
                onPress={() => handleCitySelect(city.id)}
                activeOpacity={0.8}
              >
                <Card style={styles.cityCardInner}>
                  <View style={styles.cityCardContent}>
                    <LinearGradient colors={city.color} style={styles.cityIcon}>
                      <Feather name={city.icon} size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.cityInfo}>
                      <Text style={styles.cityName}>{city.name}</Text>
                      <Text style={styles.cityDescription}>
                        {city.description}
                      </Text>
                    </View>
                    {selectedCity === city.id && (
                      <View style={styles.selectedIndicator}>
                        <Feather
                          name="check-circle"
                          size={24}
                          color={city.color[0]}
                        />
                      </View>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleContinue}
              loading={isLoading}
              disabled={!selectedCity}
              style={[
                styles.continueButton,
                !selectedCity && styles.continueButtonDisabled,
              ]}
            >
              Continue
            </Button>
          </View>

          {/* Skip Option */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              Alert.alert(
                'Skip City Selection',
                'You can set your city preference later in your profile settings.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Skip',
                    onPress: async () => {
                      setIsLoading(true);
                      try {
                        await updateUserRecord({ city: 'morena' }); // Default to morena (already lowercase)
                        // Clear onboarding cache to force fresh check
                        onboardingService.clearOnboardingCache(user.id);
                        
                        // Force a re-check of onboarding status
                        await checkAuthStatus();
                      } catch (error) {
                        console.error('Skip error:', error);
                        Alert.alert(
                          'Error',
                          'Failed to skip city selection. Please try again.',
                        );
                      } finally {
                        setIsLoading(false);
                      }
                    },
                  },
                ],
              );
            }}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: Math.max(24, screenWidth * 0.06),
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      paddingBottom: 40,
    },
    headerContainer: {
      paddingTop: Platform.OS === 'ios' ? 20 : 10,
      paddingBottom: 10,
      alignItems: 'flex-start',
    },
    backButton: {
      padding: 10,
      minHeight: 44, // Better touch target
    },
    header: {
      alignItems: 'center',
      marginBottom: Math.min(32, screenHeight * 0.04),
    },
    iconContainer: {
      marginBottom: Math.min(20, screenHeight * 0.025),
    },
    iconGradient: {
      width: Math.min(70, screenWidth * 0.18),
      height: Math.min(70, screenWidth * 0.18),
      borderRadius: Math.min(35, screenWidth * 0.09),
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme?.colors?.primary?.main || '#6174f9',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    title: {
      fontSize: Math.min(24, screenWidth * 0.06),
      fontWeight: 'bold',
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: Math.min(16, screenWidth * 0.04),
      color: theme?.colors?.text?.secondary || '#64748B',
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: Math.max(20, screenWidth * 0.05),
    },
    citiesContainer: {
      flex: 1,
      gap: Math.min(12, screenHeight * 0.015),
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    cityCard: {
      borderRadius: 16,
      overflow: 'hidden',
      minHeight: 80, // Ensure consistent height
    },
    cityCardSelected: {
      transform: [{ scale: 1.02 }],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    cityCardInner: {
      padding: 0,
      margin: 0,
    },
    cityCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Math.min(20, screenWidth * 0.05),
      minHeight: 80,
    },
    cityIcon: {
      width: Math.min(56, screenWidth * 0.14),
      height: Math.min(56, screenWidth * 0.14),
      borderRadius: Math.min(28, screenWidth * 0.07),
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Math.min(16, screenWidth * 0.04),
    },
    cityInfo: {
      flex: 1,
    },
    cityName: {
      fontSize: Math.min(20, screenWidth * 0.05),
      fontWeight: '600',
      color: theme?.colors?.text?.primary || '#1E293B',
      marginBottom: 4,
    },
    cityDescription: {
      fontSize: Math.min(14, screenWidth * 0.035),
      color: theme?.colors?.text?.secondary || '#64748B',
      lineHeight: 20,
    },
    selectedIndicator: {
      marginLeft: 12,
    },
    buttonContainer: {
      marginTop: Math.min(32, screenHeight * 0.04),
      marginBottom: 16,
    },
    continueButton: {
      height: Math.min(56, screenHeight * 0.07),
      borderRadius: 16,
    },
    continueButtonDisabled: {
      opacity: 0.5,
    },
    skipButton: {
      alignItems: 'center',
      paddingVertical: 12,
      minHeight: 44, // Better touch target
    },
    skipButtonText: {
      fontSize: Math.min(16, screenWidth * 0.04),
      color: theme?.colors?.text?.tertiary || '#94A3B8',
      textDecorationLine: 'underline',
    },
  });

export default CitySelectionScreen;
