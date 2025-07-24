import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../contexts/ThemeContext';

const Icon = ({
  name,
  type = 'feather',
  size = 24,
  color,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const iconColor = color || theme?.colors?.text?.primary || '#0F172A';

  const IconComponent = type === 'fontawesome' ? FontAwesome : Feather;

  return (
    <IconComponent
      name={name}
      size={size}
      color={iconColor}
      style={style}
      {...props}
    />
  );
};

export default Icon;
