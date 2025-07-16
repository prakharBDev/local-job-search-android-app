import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const Input = ({
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
  variant = 'default',
  style,
  containerStyle,
  ...props
}) => {
  const { theme } = useTheme();
  const safeTheme = theme || bluewhiteTheme;
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
          inputStyle,
          multiline
            ? styles.inputContainerMultiline
            : styles.inputContainerSingle,
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
        <TextInput
          style={[
            styles.input,
            {
              color: safeTheme.colors.text.primary || '#1E293B',
              flex: 1,
              textAlignVertical: multiline ? 'top' : 'center',
              paddingLeft: leftIcon ? 8 : 0,
            },
            style,
          ]}
          placeholder={placeholder}
          placeholderTextColor={safeTheme.colors.text.secondary || '#475569'}
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
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  inputContainerSingle: {
    alignItems: 'center',
  },
  inputContainerMultiline: {
    alignItems: 'flex-start',
  },
  input: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  leftIconContainer: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIconContainerSingle: {
    // Icon will be centered by parent alignItems: 'center'
  },
  leftIconContainerMultiline: {
    alignSelf: 'flex-start',
    marginTop: 9,
    paddingTop: 2,
  },
  iconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
