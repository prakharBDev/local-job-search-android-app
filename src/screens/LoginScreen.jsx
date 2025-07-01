import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { theme } from '../theme';

const LoginScreen = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../assests/rocket_1323780.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome to JobPortal</Text>
          <Text style={styles.subtitle}>
            Connect with opportunities and talent
          </Text>
        </View>

        <Card style={styles.loginCard}>
          <Text style={styles.loginTitle}>Get Started</Text>
          <Text style={styles.loginSubtitle}>
            Sign in to access both job searching and posting features
          </Text>

          <Button
            variant="outline"
            fullWidth
            onPress={handleGoogleLogin}
            icon={null}
            disabled={false}
            style={styles.googleButton}
          >
            <View style={styles.buttonContent}>
              <FontAwesome
                name="google"
                size={20}
                color={theme.colors.text.primary}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </View>
          </Button>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <FontAwesome
                name="search"
                size={16}
                color={theme.colors.primary.emerald}
              />
              <Text style={styles.featureText}>Find your dream job</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome
                name="briefcase"
                size={16}
                color={theme.colors.primary.emerald}
              />
              <Text style={styles.featureText}>Post job opportunities</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome
                name="users"
                size={16}
                color={theme.colors.primary.emerald}
              />
              <Text style={styles.featureText}>Connect with professionals</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{' '}
          <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[8],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  loginCard: {
    padding: theme.spacing[6],
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  loginSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    lineHeight: 20,
  },
  googleButton: {
    marginBottom: theme.spacing[6],
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.secondary,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: theme.spacing[3],
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  features: {
    gap: theme.spacing[3],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
  footerLink: {
    color: theme.colors.primary.emerald,
    fontWeight: '500',
  },
});

export default LoginScreen;
