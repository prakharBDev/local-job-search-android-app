import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const ThemedCard = React.memo(
  ({ variant = 'default', padding = 'md', style, children, ...props }) => {
    const { theme } = useTheme();

    const cardStyle = useMemo(() => {
      const baseStyle = {
        backgroundColor:
          theme?.colors?.background?.secondary ||
          bluewhiteTheme.colors.background.secondary,
        borderRadius: theme?.borderRadius?.lg || 16,
      };

      const paddingStyles = {
        none: {
          padding: 0,
        },
        sm: {
          padding: theme?.spacing?.[3] || 12,
        },
        md: {
          padding: theme?.spacing?.[4] || 16,
        },
        lg: {
          padding: theme?.spacing?.[6] || 24,
        },
      };

      const variantStyles = {
        elevated: {
          shadowColor: theme?.shadows?.lg?.shadowColor || '#000',
          shadowOffset: {
            width: theme?.shadows?.lg?.shadowOffset?.width || 0,
            height: theme?.shadows?.lg?.shadowOffset?.height || 4,
          },
          shadowOpacity: theme?.shadows?.lg?.shadowOpacity || 0.15,
          shadowRadius: theme?.shadows?.lg?.shadowRadius || 8,
          elevation: theme?.shadows?.lg?.elevation || 4,
        },
        outline: {
          borderWidth: 1,
          borderColor:
            theme?.colors?.interactive?.border?.primary ||
            bluewhiteTheme.colors.interactive.border.primary,
          shadowColor: theme?.shadows?.sm?.shadowColor || '#000',
          shadowOffset: {
            width: theme?.shadows?.sm?.shadowOffset?.width || 0,
            height: theme?.shadows?.sm?.shadowOffset?.height || 2,
          },
          shadowOpacity: theme?.shadows?.sm?.shadowOpacity || 0.1,
          shadowRadius: theme?.shadows?.sm?.shadowRadius || 4,
          elevation: theme?.shadows?.sm?.elevation || 2,
        },
        default: {
          shadowColor: theme?.shadows?.md?.shadowColor || '#000',
          shadowOffset: {
            width: theme?.shadows?.md?.shadowOffset?.width || 0,
            height: theme?.shadows?.md?.shadowOffset?.height || 2,
          },
          shadowOpacity: theme?.shadows?.md?.shadowOpacity || 0.1,
          shadowRadius: theme?.shadows?.md?.shadowRadius || 4,
          elevation: theme?.shadows?.md?.elevation || 2,
        },
      };

      return {
        ...baseStyle,
        ...paddingStyles[padding],
        ...variantStyles[variant],
      };
    }, [theme, variant, padding]);

    return (
      <View style={[cardStyle, style]} {...props}>
        {children}
      </View>
    );
  },
);

ThemedCard.displayName = 'ThemedCard';

export default ThemedCard;
