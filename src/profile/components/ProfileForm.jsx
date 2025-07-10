import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ProfileFormField from './ProfileFormField';
import ProfileRoleSelector from './ProfileRoleSelector';

const ProfileForm = ({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  theme,
}) => {
  const handleFieldChange = (field, value) => {
    onFormDataChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.formContainer}>
      <ProfileFormField
        label="Name"
        value={formData.name}
        onChangeText={text => handleFieldChange('name', text)}
        placeholder="Enter your full name"
        theme={theme}
      />

      <ProfileFormField
        label="Email"
        value={formData.email}
        onChangeText={text => handleFieldChange('email', text)}
        placeholder="Enter your email"
        keyboardType="email-address"
        theme={theme}
      />

      <ProfileRoleSelector
        selectedRole={formData.role}
        onRoleChange={role => handleFieldChange('role', role)}
        theme={theme}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            {
              backgroundColor:
                theme?.colors?.background?.secondary || '#F8FAFC',
              borderColor: theme?.colors?.border?.primary || '#E2E8F0',
            },
          ]}
          onPress={onCancel}
        >
          <Text
            style={[
              styles.cancelButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary.cyan },
          ]}
          onPress={onSubmit}
        >
          <Text style={styles.submitButtonText}>Add Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileForm;
