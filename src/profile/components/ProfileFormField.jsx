import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const ProfileFormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  theme,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text
        style={[
          styles.label,
          { color: theme?.colors?.text?.primary || '#1E293B' },
        ]}
      >
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme?.colors?.border?.primary || '#E2E8F0',
            color: theme?.colors?.text?.primary || '#1E293B',
            backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme?.colors?.text?.secondary || '#64748B'}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default ProfileFormField;
