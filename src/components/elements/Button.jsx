import React, { memo, useMemo, useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getStyles } from './Button.styles';

const Button = memo(({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled = false,
  style,
  textStyle,
  containerStyle,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  activeOpacity = 0.8,
  ...props
}) => {
  const { theme } = useTheme();
  
  // Memoize styles for performance
  const styles = useMemo(() => getStyles(theme), [theme]);

  const buttonStyle = useMemo(() => [
    styles.button,
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`], // buttonSm, buttonMd, buttonLg
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`], // buttonDefault, buttonOutline, etc.
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    style,
  ], [styles, size, variant, fullWidth, disabled, loading, style]);

  const textStyleComputed = useMemo(() => [
    styles.text,
    styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}`], // textSm, textMd, textLg
    styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}`], // textDefault, textOutline, etc.
    textStyle,
  ], [styles, size, variant, textStyle]);

  // Memoized event handlers
  const handlePress = useCallback((event) => {
    if (onPress && !disabled && !loading) {
      onPress(event);
    }
  }, [onPress, disabled, loading]);

  const handlePressIn = useCallback((event) => {
    if (onPressIn && !disabled && !loading) {
      onPressIn(event);
    }
  }, [onPressIn, disabled, loading]);

  const handlePressOut = useCallback((event) => {
    if (onPressOut && !disabled && !loading) {
      onPressOut(event);
    }
  }, [onPressOut, disabled, loading]);

  const handleLongPress = useCallback((event) => {
    if (onLongPress && !disabled && !loading) {
      onLongPress(event);
    }
  }, [onLongPress, disabled, loading]);

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'default' || variant === 'gradient'
              ? theme?.colors?.primary?.foreground || '#3949AB'
              : theme?.colors?.primary?.secondary || '#3949AB'
          }
          style={styles.iconContainer}
        />
      )}
      {icon && !loading && (
        <View style={styles.iconContainer}>{icon}</View>
      )}
      <Text style={textStyleComputed}>{children}</Text>
    </>
  );

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={buttonStyle}
        disabled={disabled || loading}
        activeOpacity={activeOpacity}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    </View>
  );
});

export default Button;
