import React from 'react';
import { Text, View } from 'react-native';
import { theme } from '../../theme';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  ...props
}) => {
  const getBadgeStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const sizeStyles = {
      sm: {
        paddingHorizontal: theme.spacing[2],
        paddingVertical: theme.spacing[1],
      },
      md: {
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[2],
      },
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.primary.emerald,
      },
      secondary: {
        backgroundColor: theme.colors.text.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      },
      success: {
        backgroundColor: theme.colors.status.success,
      },
      warning: {
        backgroundColor: theme.colors.status.warning,
      },
      error: {
        backgroundColor: theme.colors.status.error,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: theme.typography.labelSmall.fontSize,
      fontWeight: theme.typography.labelSmall.fontWeight,
      textAlign: 'center',
    };

    const variantTextStyles = {
      default: {
        color: theme.colors.text.white,
      },
      secondary: {
        color: theme.colors.text.white,
      },
      outline: {
        color: theme.colors.text.primary,
      },
      success: {
        color: theme.colors.text.white,
      },
      warning: {
        color: theme.colors.text.primary,
      },
      error: {
        color: theme.colors.text.white,
      },
    };

    return {
      ...baseTextStyle,
      ...variantTextStyles[variant],
    };
  };

  return (
    <View style={[getBadgeStyle(), style]} {...props}>
      <Text style={getTextStyle()}>{children}</Text>
    </View>
  );
};

export default Badge;
