import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Badge = React.memo(
  ({ children, variant = 'default', size = 'md', style, ...props }) => {
    const { theme } = useTheme();

    const getBadgeStyle = () => {
      const baseStyle = {
        borderRadius: theme?.borderRadius?.full || 9999,
        alignItems: 'center',
        justifyContent: 'center',
      };

      const sizeStyles = {
        sm: {
          paddingHorizontal: theme?.spacing?.[2] || 8,
          paddingVertical: theme?.spacing?.[1] || 4,
        },
        md: {
          paddingHorizontal: theme?.spacing?.[3] || 12,
          paddingVertical: theme?.spacing?.[2] || 8,
        },
      };

      const variantStyles = {
        default: {
          backgroundColor: theme?.colors?.primary?.cyan || '#6174f9',
        },
        secondary: {
          backgroundColor: theme?.colors?.text?.secondary || '#475569',
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme?.colors?.border?.primary || '#E2E8F0',
        },
        success: {
          backgroundColor: theme?.colors?.status?.success || '#10B981',
        },
        warning: {
          backgroundColor: theme?.colors?.status?.warning || '#F59E0B',
        },
        error: {
          backgroundColor: theme?.colors?.status?.error || '#EF4444',
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
        fontSize: theme?.typography?.labelSmall?.fontSize || 12,
        fontWeight: theme?.typography?.labelSmall?.fontWeight || '600',
        textAlign: 'center',
      };

      const variantTextStyles = {
        default: {
          color: theme?.colors?.text?.white || '#FFFFFF',
        },
        secondary: {
          color: theme?.colors?.text?.white || '#FFFFFF',
        },
        outline: {
          color: theme?.colors?.text?.primary || '#1E293B',
        },
        success: {
          color: theme?.colors?.text?.white || '#FFFFFF',
        },
        warning: {
          color: theme?.colors?.text?.primary || '#1E293B',
        },
        error: {
          color: theme?.colors?.text?.white || '#FFFFFF',
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
  },
);

Badge.displayName = 'Badge';

export default Badge;
