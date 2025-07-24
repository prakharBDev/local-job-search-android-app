import React, { forwardRef, useState, useMemo } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';
import getStyles from './Input.styles';

const Input = forwardRef(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      secureTextEntry,
      keyboardType = 'default',
      multiline = false,
      numberOfLines = 1,
      editable = true,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      prefix,
      variant = 'default',
      style,
      containerStyle,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const safeTheme = theme || bluewhiteTheme;
    const styles = getStyles(safeTheme);
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const inputStyle = useMemo(() => {
      const baseStyle = {
        backgroundColor:
          safeTheme.colors.surface.glass || 'rgba(255, 255, 255, 0.8)',
        borderColor: safeTheme.colors.border.primary || '#E2E8F0',
        color: safeTheme.colors.text.primary || '#1E293B',
      };

      if (variant === 'glass') {
        return {
          ...baseStyle,
          backgroundColor:
            safeTheme.colors.surface.glass || 'rgba(255, 255, 255, 0.8)',
          borderColor: safeTheme.colors.border.primary || '#E2E8F0',
          shadowColor: safeTheme.colors.shadows.soft || '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        };
      }

      if (isFocused) {
        return {
          ...baseStyle,
          borderColor: safeTheme.colors.primary.main || '#3C4FE0',
          shadowColor: safeTheme.colors.primary.main || '#3C4FE0',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        };
      }

      if (error) {
        return {
          ...baseStyle,
          borderColor: safeTheme.colors.status.error || '#EF4444',
        };
      }

      return baseStyle;
    }, [safeTheme, variant, isFocused, error]);

    const renderRightIcon = () => {
      if (secureTextEntry) {
        return (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text
              style={[
                styles.iconText,
                { color: safeTheme.colors.text.secondary || '#475569' },
              ]}
            >
              {isPasswordVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        );
      }

      if (rightIcon) {
        return (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        );
      }

      return null;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[
              styles.label,
              { color: safeTheme.colors.text.primary || '#1E293B' },
            ]}
          >
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            multiline
              ? styles.inputContainerMultiline
              : styles.inputContainerSingle,
            inputStyle,
          ]}
        >
          {leftIcon && (
            <View
              style={[
                styles.leftIconContainer,
                multiline
                  ? styles.leftIconContainerMultiline
                  : styles.leftIconContainerSingle,
              ]}
            >
              {leftIcon}
            </View>
          )}
          {prefix && (
            <Text
              style={[
                styles.prefixText,
                { color: safeTheme.colors.text.secondary || '#475569' },
              ]}
            >
              {prefix}
            </Text>
          )}
          <TextInput
            ref={ref}
            style={[styles.input, multiline && styles.inputMultiline, style]}
            placeholder={placeholder}
            placeholderTextColor={safeTheme.colors.text.tertiary || '#94A3B8'}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            editable={editable}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {renderRightIcon()}
        </View>
        {error && (
          <Text
            style={[
              styles.errorText,
              { color: safeTheme.colors.status.error || '#EF4444' },
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';

export default Input;
