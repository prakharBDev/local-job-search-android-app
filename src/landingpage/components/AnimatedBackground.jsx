import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const AnimatedBackground = () => {
  // Animation values for 10 elements
  const backgroundAnimations = useRef(
    Array.from({ length: 10 }, () => new Animated.Value(0))
  ).current;
  const backgroundRotations = useRef(
    Array.from({ length: 10 }, () => new Animated.Value(0))
  ).current;
  const backgroundScales = useRef(
    Array.from({ length: 10 }, () => new Animated.Value(1))
  ).current;

  // Element definitions
  const elements = [
    { type: 'circle', color: '#3B82F6', size: 80, style: 'floatingElement' },
    { type: 'small', color: '#10B981', size: 40, style: 'floatingElementSmall' },
    { type: 'tiny', color: '#F59E0B', size: 20, style: 'floatingElementTiny' },
    { type: 'square', color: '#EC4899', size: 60, style: 'floatingElementSquare' },
    { type: 'circle', color: '#3B82F6', size: 80, style: 'floatingElement' },
    { type: 'small', color: '#10B981', size: 40, style: 'floatingElementSmall' },
    { type: 'tiny', color: '#F59E0B', size: 20, style: 'floatingElementTiny' },
    { type: 'square', color: '#EC4899', size: 60, style: 'floatingElementSquare' },
    { type: 'circle', color: '#3B82F6', size: 80, style: 'floatingElement' },
    { type: 'small', color: '#10B981', size: 40, style: 'floatingElementSmall' },
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

  useEffect(() => {
    // Floating animation
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
        ])
      ).start();
    });
    // Rotation animation
    backgroundRotations.forEach((rotation, index) => {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 10000 + index * 1500,
          useNativeDriver: true,
        })
      ).start();
    });
    // Scale animation
    backgroundScales.forEach((scale, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 2000 + index * 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 2000 + index * 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [backgroundAnimations, backgroundRotations, backgroundScales]);

  // Styles for each element type
  const styles = StyleSheet.create({
    animatedBackground: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
    floatingElement: {
      position: 'absolute',
      borderRadius: 40,
      backgroundColor: '#3B82F6',
      width: 80,
      height: 80,
    },
    floatingElementSmall: {
      position: 'absolute',
      borderRadius: 20,
      backgroundColor: '#10B981',
      width: 40,
      height: 40,
    },
    floatingElementTiny: {
      position: 'absolute',
      borderRadius: 10,
      backgroundColor: '#F59E0B',
      width: 20,
      height: 20,
    },
    floatingElementSquare: {
      position: 'absolute',
      borderRadius: 12,
      backgroundColor: '#EC4899',
      width: 60,
      height: 60,
    },
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
    },
    gradientOverlayTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
    },
    gradientOverlayBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      backgroundColor: 'rgba(236, 72, 153, 0.08)',
    },
  });

  return (
    <View style={styles.animatedBackground} pointerEvents="none">
      {/* Floating elements */}
      {backgroundAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles[elements[index].style],
            {
              backgroundColor: elements[index].color,
              width: elements[index].size,
              height: elements[index].size,
              left: positions[index].left,
              top: positions[index].top,
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
                    inputRange: [0, 1.2],
                    outputRange: [1, 1.2],
                  }),
                },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 0.8, 0.3],
              }),
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

export default AnimatedBackground;
