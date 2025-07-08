import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Top Half: Illustration */}
        <View style={styles.topHalf}>
          <Image
            source={require('../assets/onboarding_screen.png')}
            style={styles.illustration}
            accessibilityLabel="Onboarding illustration"
          />
        </View>
        {/* Bottom Half: Content */}
        <View style={styles.bottomHalf}>
          {/* Greeting */}
          <View style={{ width: '100%', marginBottom: 4 }}>
            <Text style={styles.greeting}>HEY RAKIB</Text>
          </View>
          {/* Main Question */}
          <View style={{ width: '100%', marginBottom: 24 }}>
            <Text style={styles.question}>What do you want?</Text>
          </View>
          {/* Action Cards */}
          <View style={{ width: '100%', gap: 16 }}>
            <TouchableOpacity
              style={[styles.actionCard, styles.findJobCard]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Jobs')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#6c7cfb' }]}> 
                <Feather name="search" size={28} color="#fff" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Find a job</Text>
                <Text style={styles.actionSubtitle}>Find your dream job here</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionCard, styles.postJobCard]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CreateJob')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#22c993' }]}> 
                <Feather name="file-text" size={28} color="#fff" />
              </View>
              <View>
                <Text style={styles.actionTitle}>Post a job</Text>
                <Text style={styles.actionSubtitle}>Post your job here</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHalf: {
    flex: 1.2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
  },
  illustration: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginBottom: 0,
  },
  bottomHalf: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  greeting: {
    color: '#7b8794',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  question: {
    color: '#22223b',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: '#fff', // will be overridden below
    gap: 16,
  },
  findJobCard: {
    backgroundColor: '#eef0fd',
  },
  postJobCard: {
    backgroundColor: '#eaf7f0',
    marginBottom: 0,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22223b',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#7b8794',
    marginTop: 2,
  },
});

export default OnboardingScreen;
