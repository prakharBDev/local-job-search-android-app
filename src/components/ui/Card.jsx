import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const Card = ({ children, style, padding = true, ...props }) => {
  const { theme } = useTheme();

  const getCardStyle = theme => {
    const safeTheme = theme || bluewhiteTheme;

    // Get shadow style with proper fallback
    const shadowStyle = safeTheme.colors?.shadows?.sm || {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    };

    return {
      backgroundColor: safeTheme.colors?.background?.secondary || '#F8FAFC',
      borderRadius: safeTheme.borderRadius?.lg || 12,
      ...shadowStyle,
      ...(padding && {
        padding: safeTheme.spacing?.[4] || 16,
      }),
    };
  };

  const cardStyle = getCardStyle(theme);

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default Card;
