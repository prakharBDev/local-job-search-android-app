import React from 'react';
import { View, ViewProps } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  padding?: keyof typeof theme.spacing;
  style?: any;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 4,
  style,
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius['2xl'],
      padding: theme.spacing[padding],
      ...theme.shadows.lg,
    };

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      },
      glass: {
        backgroundColor: theme.colors.glass.white80,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        // Note: Blur effect would require react-native-blur
      },
      gradient: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  if (variant === 'gradient') {
    return (
      <View 
        style={[getCardStyle(), { backgroundColor: theme.colors.background.secondary }, style]} 
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

export default Card;