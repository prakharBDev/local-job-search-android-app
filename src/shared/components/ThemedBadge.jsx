import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const ThemedBadge = React.memo(
  ({ variant = 'primary', size = 'md', children, style, ...props }) => {
    const { theme } = useTheme();

    const badgeStyle = useMemo(() => {
      const baseStyle = {
        borderRadius: 999, // Full border radius for badge
        alignSelf: 'flex-start',
      };

      const sizeStyles = {
        sm: {
          paddingHorizontal: theme?.spacing?.[2] || 8,
          paddingVertical: 2,
          minHeight: 20,
        },
        md: {
          paddingHorizontal: theme?.spacing?.[3] || 12,
          paddingVertical: theme?.spacing?.[1] || 4,
          minHeight: 24,
        },
        lg: {
          paddingHorizontal: theme?.spacing?.[4] || 16,
          paddingVertical: theme?.spacing?.[2] || 8,
          minHeight: 32,
        },
      };

      const variantStyles = {
        primary: {
          backgroundColor:
            theme?.colors?.primary?.main || bluewhiteTheme.colors.primary.main,
        },
        green: {
          backgroundColor:
            theme?.colors?.accent?.green || bluewhiteTheme.colors.accent.green,
        },
        purple: {
          backgroundColor:
            theme?.colors?.accent?.purple ||
            bluewhiteTheme.colors.accent.purple,
        },
        orange: {
          backgroundColor:
            theme?.colors?.accent?.orange ||
            bluewhiteTheme.colors.accent.orange,
        },
        red: {
          backgroundColor:
            theme?.colors?.accent?.red || bluewhiteTheme.colors.accent.red,
        },
        secondary: {
          backgroundColor:
            theme?.colors?.secondary?.main ||
            bluewhiteTheme.colors.secondary.main,
        },
      };

      return {
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
      };
    }, [theme, size, variant]);

    const textStyle = useMemo(() => {
      const baseTextStyle = {
        fontWeight: '600',
        textAlign: 'center',
      };

      const sizeStyles = {
        sm: {
          fontSize: theme?.typography?.caption?.fontSize || 12,
          lineHeight: theme?.typography?.caption?.lineHeight || 16,
        },
        md: {
          fontSize: theme?.typography?.bodySmall?.fontSize || 14,
          lineHeight: theme?.typography?.bodySmall?.lineHeight || 20,
        },
        lg: {
          fontSize: theme?.typography?.body?.fontSize || 16,
          lineHeight: theme?.typography?.body?.lineHeight || 24,
        },
      };

      const variantStyles = {
        secondary: {
          color:
            theme?.colors?.text?.primary || bluewhiteTheme.colors.text.primary,
        },
        default: {
          color:
            theme?.colors?.text?.inverse || bluewhiteTheme.colors.text.inverse,
        },
      };

      return {
        ...baseTextStyle,
        ...sizeStyles[size],
        ...variantStyles[variant === 'secondary' ? 'secondary' : 'default'],
      };
    }, [theme, size, variant]);

    return (
      <View style={[badgeStyle, style]} {...props}>
        <Text style={textStyle}>{children}</Text>
      </View>
    );
  },
);

ThemedBadge.displayName = 'ThemedBadge';

export default ThemedBadge;
