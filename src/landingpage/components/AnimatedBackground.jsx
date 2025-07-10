import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AnimatedBackground = () => {
  const { theme } = useTheme();
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatingAnim]);

  const styles = StyleSheet.create({
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
  });

  return (
    <View style={styles.backgroundContainer} pointerEvents="none">
      <Animated.View style={styles.floatingShape1} />
      <Animated.View style={styles.floatingShape2} />
      <Animated.View style={styles.floatingShape3} />
      {/* Add more animated shapes as needed */}
    </View>
  );
};

export default AnimatedBackground; 