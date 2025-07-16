import React, { useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled = false,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const buttonStyle = useMemo(() => {
    const baseStyle = {
      borderRadius: 18, // Increased from 16 for softer look
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };

    const sizeStyles = {
      sm: {
        paddingHorizontal: theme?.spacing?.[4] || 16,
        paddingVertical: theme?.spacing?.[2] || 8,
        minHeight: 40, // Increased from 36
        borderRadius: 16, // Slightly smaller for sm
      },
      md: {
        paddingHorizontal: theme?.spacing?.[6] || 24,
        paddingVertical: theme?.spacing?.[3] || 12,
        minHeight: 50, // Increased from 44
        borderRadius: 18,
      },
      lg: {
        paddingHorizontal: theme?.spacing?.[8] || 32,
        paddingVertical: theme?.spacing?.[4] || 16,
        minHeight: 56,
        borderRadius: 20, // Larger for lg
      },
    };

    const variantStyles = {
      default: {
        backgroundColor: theme?.colors?.primary?.main || '#3B82F6',
        shadowColor: theme?.colors?.primary?.main || '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5, // Slightly thicker
        borderColor: theme?.colors?.primary?.main || '#3B82F6',
        shadowColor: theme?.colors?.primary?.main || '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      },
      ghost: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
      },
      gradient: {
        backgroundColor: theme?.colors?.primary?.main || '#3B82F6',
        shadowColor: theme?.colors?.primary?.main || '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.6 }),
    };
  }, [theme, size, variant, fullWidth, disabled]);

  const textStyle = useMemo(() => {
    const baseTextStyle = {
      textAlign: 'center',
      fontWeight: '600',
      fontFamily: 'System', // Soft system font
      letterSpacing: -0.3, // Tighter letter spacing for softer look
    };

    const sizeTextStyles = {
      sm: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: -0.2,
      },
      md: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: -0.3,
      },
      lg: {
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.4,
      },
    };

    const variantTextStyles = {
      default: {
        color: theme?.colors?.primary?.foreground || '#FFFFFF',
      },
      outline: {
        color: theme?.colors?.primary?.main || '#3B82F6',
      },
      ghost: {
        color: theme?.colors?.text?.secondary || '#475569',
      },
      gradient: {
        color: theme?.colors?.primary?.foreground || '#FFFFFF',
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  }, [theme, size, variant]);

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'default' || variant === 'gradient'
              ? theme?.colors?.primary?.foreground || '#FFFFFF'
              : theme?.colors?.primary?.main || '#3B82F6'
          }
          style={{ marginRight: theme?.spacing?.[2] || 8 }}
        />
      )}
      {icon && !loading && (
        <View style={{ marginRight: theme?.spacing?.[2] || 8 }}>{icon}</View>
      )}
      <Text style={textStyle}>{children}</Text>
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        style={[buttonStyle, { backgroundColor: theme?.colors?.primary?.main || '#3B82F6' }, style]}
        disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
