import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme';

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
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.md,
    };

    const sizeStyles = {
      sm: {
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[2],
        minHeight: 36,
      },
      md: {
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[3],
        minHeight: theme.layout.touchTarget.minHeight,
      },
      lg: {
        paddingHorizontal: theme.spacing[8],
        paddingVertical: theme.spacing[4],
        minHeight: 56,
      },
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.primary.emerald,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
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
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      textAlign: 'center',
      fontWeight: theme.typography.button.fontWeight,
    };

    const sizeTextStyles = {
      sm: {
        fontSize: theme.typography.buttonSmall.fontSize,
        lineHeight: theme.typography.buttonSmall.lineHeight,
      },
      md: {
        fontSize: theme.typography.button.fontSize,
        lineHeight: theme.typography.button.lineHeight,
      },
      lg: {
        fontSize: theme.typography.buttonLarge.fontSize,
        lineHeight: theme.typography.buttonLarge.lineHeight,
      },
    };

    const variantTextStyles = {
      default: {
        color: theme.colors.text.white,
      },
      outline: {
        color: theme.colors.text.primary,
      },
      ghost: {
        color: theme.colors.text.secondary,
      },
      gradient: {
        color: theme.colors.text.white,
      },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'default' || variant === 'gradient'
              ? theme.colors.text.white
              : theme.colors.primary.emerald
          }
          style={{ marginRight: theme.spacing[2] }}
        />
      )}
      {icon && !loading && (
        <View style={{ marginRight: theme.spacing[2] }}>{icon}</View>
      )}
      <Text style={getTextStyle()}>{children}</Text>
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        style={[
          getButtonStyle(),
          { backgroundColor: theme.colors.primary.emerald },
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
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
