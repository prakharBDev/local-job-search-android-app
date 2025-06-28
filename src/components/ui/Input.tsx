import React, { useState } from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../../theme';

interface InputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'glass';
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  [key: string]: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  style,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing[4],
      minHeight: theme.layout.touchTarget.minHeight,
    };

    const variantStyles = {
      default: {
        backgroundColor: '#F5F5F5',
        borderColor: isFocused
          ? theme.colors.border.focus
          : theme.colors.border.primary,
      },
      glass: {
        backgroundColor: theme.colors.glass.white90,
        borderColor: isFocused
          ? theme.colors.border.focus
          : theme.colors.border.primary,
        ...theme.shadows.lg,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(error && { borderColor: theme.colors.status.error }),
    };
  };

  const getInputStyle = () => ({
    flex: 1,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing[3],
    ...(leftIcon && { marginLeft: theme.spacing[2] }),
    ...(rightIcon && { marginRight: theme.spacing[2] }),
  });

  const getLabelStyle = () => ({
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  });

  const getErrorStyle = () => ({
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.status.error,
    marginTop: theme.spacing[1],
  });

  return (
    <View style={containerStyle}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={{ marginRight: theme.spacing[2] }}>{leftIcon}</View>
        )}
        <TextInput
          style={[getInputStyle(), style]}
          placeholderTextColor={theme.colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: theme.spacing[2] }}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
};

export default Input;
