import React from 'react';
import { View } from 'react-native';
import { theme } from '../../theme';

const Card = ({ children, style, padding = true, ...props }) => {
  const cardStyle = {
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
