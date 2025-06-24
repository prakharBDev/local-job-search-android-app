import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { theme } from '../../theme';

export interface BadgeProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  style?: any;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  ...props
}) => {
  const getBadgeStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      alignSelf: 'flex-start' as const,
    };

    const sizeStyles = {
      sm: {
        paddingHorizontal: theme.spacing[2],
        paddingVertical: theme.spacing[1],
      },
      md: {
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[1],
      },
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.primary.emerald,
      },
      secondary: {
        backgroundColor: '#F5F5F5', // bg-gray-100 from web
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      },
      success: {
        backgroundColor: '#E8F5E8', // Light green background
      },
      warning: {
        backgroundColor: '#FFF3E0', // Light orange background
      },
      error: {
        backgroundColor: '#FFEBEE', // Light red background
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
      fontSize: size === 'sm' ? theme.typography.labelSmall.fontSize : theme.typography.caption.fontSize,
      fontWeight: theme.typography.label.fontWeight,
      textAlign: 'center' as const,
    };

    const variantTextStyles = {
      default: {
        color: theme.colors.text.white,
      },
      secondary: {
        color: theme.colors.text.secondary,
      },
      outline: {
        color: theme.colors.text.primary,
      },
      success: {
        color: theme.colors.primary.forest,
      },
      warning: {
        color: '#E65100', // Dark orange
      },
      error: {
        color: theme.colors.status.error,
      },
    };

    return {
      ...baseTextStyle,
      ...variantTextStyles[variant],
    };
  };

  return (
    <View style={[getBadgeStyle(), style]} {...props}>
      <Text style={getTextStyle()}>
        {children}
      </Text>
    </View>
  );
};

export default Badge;