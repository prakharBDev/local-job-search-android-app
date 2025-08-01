import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/elements/Button';
import Card from '../../components/blocks/Card';

const CitySelectionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { updateUserRecord } = useAuth();
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0.95));

  React.useEffect(() => {
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
      color: ['#3B82F6', '#2563EB'],
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
      await updateUserRecord({ city: selectedCity.toLowerCase() });
      // Navigation will be handled automatically by the auth state change
    } catch (error) {
      console.error('City update error:', error);
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
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
                      } catch (error) {
                        console.error('Skip error:', error);
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
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    iconContainer: {
      marginBottom: 24,
    },
    iconGradient: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      color: theme?.colors?.text?.secondary || '#64748B',
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 20,
    },
    citiesContainer: {
      flex: 1,
      gap: 16,
    },
    cityCard: {
      borderRadius: 16,
      overflow: 'hidden',
    },
    cityCardSelected: {
      transform: [{ scale: 1.02 }],
    },
    cityCardInner: {
      padding: 0,
      margin: 0,
    },
    cityCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    },
    cityIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    cityInfo: {
      flex: 1,
    },
    cityName: {
      fontSize: 20,
      fontWeight: '600',
      color: theme?.colors?.text?.primary || '#1E293B',
      marginBottom: 4,
    },
    cityDescription: {
      fontSize: 14,
      color: theme?.colors?.text?.secondary || '#64748B',
      lineHeight: 20,
    },
    selectedIndicator: {
      marginLeft: 12,
    },
    buttonContainer: {
      marginTop: 32,
      marginBottom: 16,
    },
    continueButton: {
      height: 56,
      borderRadius: 16,
    },
    continueButtonDisabled: {
      opacity: 0.5,
    },
    skipButton: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    skipButtonText: {
      fontSize: 16,
      color: theme?.colors?.text?.tertiary || '#94A3B8',
      textDecorationLine: 'underline',
    },
  });

export default CitySelectionScreen;
