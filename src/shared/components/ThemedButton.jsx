import React, { useMemo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const ThemedButton = React.memo(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    children,
    onPress,
    icon,
    style,
    ...props
  }) => {
    const { theme } = useTheme();

    const buttonStyle = useMemo(() => {
      const baseStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme?.borderRadius?.md || 8,
      };

      const sizeStyles = {
        sm: {
          paddingHorizontal: theme?.spacing?.md || 16,
          paddingVertical: theme?.spacing?.xs || 4,
          minHeight: 36,
        },
        md: {
          paddingHorizontal: theme?.spacing?.lg || 20,
          paddingVertical: theme?.spacing?.sm || 8,
          minHeight: theme?.components?.button?.minHeight || 44,
        },
        lg: {
          paddingHorizontal: theme?.spacing?.xl || 24,
          paddingVertical: theme?.spacing?.md || 16,
          minHeight: 56,
        },
      };

      const variantStyles = {
        primary: {
          backgroundColor:
            theme?.colors?.primary?.main || bluewhiteTheme.colors.primary.main,
          shadowColor: theme?.shadows?.md?.shadowColor || '#000',
          shadowOffset: {
            width: theme?.shadows?.md?.shadowOffset?.width || 0,
            height: theme?.shadows?.md?.shadowOffset?.height || 2,
          },
          shadowOpacity: theme?.shadows?.md?.shadowOpacity || 0.25,
          shadowRadius: theme?.shadows?.md?.shadowRadius || 3.84,
          elevation: theme?.shadows?.md?.elevation || 5,
        },
        secondary: {
          backgroundColor:
            theme?.colors?.secondary?.main ||
            bluewhiteTheme.colors.secondary.main,
          shadowColor: theme?.shadows?.sm?.shadowColor || '#000',
          shadowOffset: {
            width: theme?.shadows?.sm?.shadowOffset?.width || 0,
            height: theme?.shadows?.sm?.shadowOffset?.height || 1,
          },
          shadowOpacity: theme?.shadows?.sm?.shadowOpacity || 0.22,
          shadowRadius: theme?.shadows?.sm?.shadowRadius || 2.22,
          elevation: theme?.shadows?.sm?.elevation || 3,
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme?.colors?.border?.primary || '#E2E8F0',
        },
        ghost: {
          backgroundColor: 'transparent',
        },
      };

      return {
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(fullWidth && { width: '100%' }),
        ...(disabled && { opacity: 0.6 }),
        ...style,
      };
    }, [variant, size, fullWidth, disabled, style, theme]);

    const textStyle = useMemo(() => {
      const baseTextStyle = {
        fontWeight: '600',
        textAlign: 'center',
      };

      const sizeTextStyles = {
        sm: {
          fontSize: theme?.typography?.button?.sm?.fontSize || 14,
          lineHeight: theme?.typography?.button?.sm?.lineHeight || 20,
        },
        md: {
          fontSize: theme?.typography?.button?.md?.fontSize || 16,
          lineHeight: theme?.typography?.button?.md?.lineHeight || 24,
        },
        lg: {
          fontSize: theme?.typography?.button?.lg?.fontSize || 18,
          lineHeight: theme?.typography?.button?.lg?.lineHeight || 28,
        },
      };

      const variantTextStyles = {
        primary: {
          color: theme?.colors?.primary?.contrast || '#FFFFFF',
        },
        secondary: {
          color: theme?.colors?.secondary?.contrast || '#1E293B',
        },
        outline: {
          color: theme?.colors?.text?.primary || '#1E293B',
        },
        ghost: {
          color: theme?.colors?.text?.secondary || '#475569',
        },
      };

      return {
        ...baseTextStyle,
        ...sizeTextStyles[size],
        ...variantTextStyles[variant],
      };
    }, [variant, size, theme]);

    const getLoadingColor = () => {
      switch (variant) {
        case 'primary':
          return '#FFFFFF';
        case 'secondary':
          return '#1E293B';
        case 'outline':
          return '#1E293B';
        case 'ghost':
          return '#475569';
        default:
          return '#FFFFFF';
      }
    };

    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={getLoadingColor()}
            style={{ marginRight: 8 }}
          />
        )}
        {icon && !loading && <Text style={{ marginRight: 8 }}>{icon}</Text>}
        <Text style={textStyle}>{children}</Text>
      </TouchableOpacity>
    );
  },
);

ThemedButton.displayName = 'ThemedButton';

export default ThemedButton;
