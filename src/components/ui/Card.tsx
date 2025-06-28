import React from 'react';
import { View, ViewStyle } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = true,
  ...props
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
    ...(padding && {
      padding: theme.spacing[4],
    }),
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default Card;
