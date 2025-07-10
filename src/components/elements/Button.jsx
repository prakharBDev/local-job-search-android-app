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
      borderRadius: theme?.borderRadius?.xl || 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...(theme?.shadows?.md || {}),
    };

    const sizeStyles = {
      sm: {
        paddingHorizontal: theme?.spacing?.[4] || 16,
        paddingVertical: theme?.spacing?.[2] || 8,
        minHeight: 36,
      },
      md: {
        paddingHorizontal: theme?.spacing?.[6] || 24,
        paddingVertical: theme?.spacing?.[3] || 12,
        minHeight: theme?.layout?.touchTarget?.minHeight || 44,
      },
      lg: {
        paddingHorizontal: theme?.spacing?.[8] || 32,
        paddingVertical: theme?.spacing?.[4] || 16,
        minHeight: 56,
      },
    };

    const variantStyles = {
      default: {
        backgroundColor: theme?.colors?.primary?.main || '#3C4FE0',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      },
      ghost: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
      },
      gradient: {
        backgroundColor: 'transparent',
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
    };

    const sizeTextStyles = {
      sm: {
        fontSize: theme?.typography?.bodySmall?.fontSize || 14,
        lineHeight: theme?.typography?.bodySmall?.lineHeight || 20,
      },
      md: {
        fontSize: theme?.typography?.body?.fontSize || 16,
        lineHeight: theme?.typography?.body?.lineHeight || 24,
      },
      lg: {
        fontSize: theme?.typography?.h6?.fontSize || 16,
        lineHeight: theme?.typography?.h6?.lineHeight || 22,
      },
    };

    const variantTextStyles = {
      default: {
        color: theme?.colors?.text?.white || '#FFFFFF',
      },
      outline: {
        color: theme?.colors?.text?.primary || '#1E293B',
      },
      ghost: {
        color: theme?.colors?.text?.secondary || '#475569',
      },
      gradient: {
        color: theme?.colors?.text?.white || '#FFFFFF',
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
              ? theme?.colors?.text?.white || '#FFFFFF'
              : theme?.colors?.primary?.main || '#3C4FE0'
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
        style={[
          buttonStyle,
          { backgroundColor: theme?.colors?.primary?.main || '#3C4FE0' },
          style,
        ]}
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
