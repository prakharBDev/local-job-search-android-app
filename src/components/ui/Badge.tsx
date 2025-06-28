import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '../../theme';

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'error';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  ...props
}) => {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const sizeStyles: Record<BadgeSize, ViewStyle> = {
      sm: {
        paddingHorizontal: theme.spacing[2],
        paddingVertical: theme.spacing[1],
      },
      md: {
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[2],
      },
    };

    const variantStyles: Record<BadgeVariant, ViewStyle> = {
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

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontSize: theme.typography.labelSmall.fontSize,
      fontWeight: theme.typography.labelSmall.fontWeight as any,
      textAlign: 'center',
    };

    const variantTextStyles: Record<BadgeVariant, TextStyle> = {
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
