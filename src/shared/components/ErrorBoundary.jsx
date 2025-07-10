import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/elements/Button';

const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme?.spacing?.[6] || 24,
    },
    content: {
      alignItems: 'center',
      maxWidth: 300,
    },
    title: {
      fontSize: theme?.typography?.h3?.fontSize || 24,
      fontWeight: theme?.typography?.h3?.fontWeight || '600',
      color: theme?.colors?.text?.primary || '#1E293B',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[4] || 16,
    },
    message: {
      fontSize: theme?.typography?.body?.fontSize || 16,
      color: theme?.colors?.text?.secondary || '#475569',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[6] || 24,
      lineHeight: theme?.typography?.body?.lineHeight || 24,
    },
    errorDetails: {
      fontSize: theme?.typography?.caption?.fontSize || 12,
      color: theme?.colors?.status?.error || '#EF4444',
      textAlign: 'center',
      marginBottom: theme?.spacing?.[4] || 16,
      fontFamily: 'monospace',
    },
    retryButton: {
      minWidth: 120,
    },
  });

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { fallback: CustomFallback } = this.props;
    // Use a functional component to access the theme
    const ThemedContent = () => {
      const { theme } = useTheme();
      const styles = getStyles(theme || {});
      if (this.state.hasError) {
        if (CustomFallback) {
          return (
            <CustomFallback error={this.state.error} retry={this.handleRetry} />
          );
        }
        return (
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.message}>
                We encountered an unexpected error. Please try again.
              </Text>
              {__DEV__ && this.state.error && (
                <Text style={styles.errorDetails}>
                  {this.state.error.toString()}
                </Text>
              )}
              <Button onPress={this.handleRetry} style={styles.retryButton}>
                Try Again
              </Button>
            </View>
          </View>
        );
      }
      return this.props.children;
    };
    return <ThemedContent />;
  }
}

export default ErrorBoundary;
