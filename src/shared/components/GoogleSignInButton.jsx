import React, { useEffect } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { View, StyleSheet, Text } from 'react-native';
import { supabase } from '../../utils/supabase';

export default function GoogleSignInButton({ onSuccess, disabled = false }) {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
        process.env.GOOGLE_WEB_CLIENT_ID, // Loaded from .env
    });
  }, []);

  const handleGoogleSignIn = async () => {
          if (disabled) {
        return;
      }

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.idToken,
        });
        if (onSuccess) {
          onSuccess({ data, error, userInfo });
        }
      } else {
        throw new Error('No ID token present!');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        if (onSuccess) {
          onSuccess({
            data: null,
            error:
              'Google Play Services not available. Please update your Google Play Services.',
            userInfo: null,
          });
        }
      } else {
        // some other error happened
        console.error('Google Sign-In error:', error);
        if (onSuccess) {
          onSuccess({
            data: null,
            error: error.message || 'Google Sign-in failed',
            userInfo: null,
          });
        }
      }
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
        disabled={disabled}
      />
      {disabled && (
        <Text style={styles.disabledText}>
          Please enter a valid phone number first
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    opacity: 1,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
