import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { theme } from '../../theme';

const Icon = ({
  name,
  type = 'feather',
  size = 24,
  color = theme.colors.text.primary,
  style,
  ...props
}) => {
  const IconComponent = {
    feather: Feather,
    fontawesome: FontAwesome,
  }[type];

  if (!IconComponent) {
    console.warn(
      `Icon type "${type}" not supported. Use 'feather' or 'fontawesome'.`,
    );
    return null;
  }

  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={style}
      {...props}
    />
  );
};

export default Icon;
