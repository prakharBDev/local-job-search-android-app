import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PROFILE_ROLES } from '../../shared/utils/constants';

const ProfileRoleSelector = ({ selectedRole, onRoleChange, theme }) => {
  return (
    <View style={styles.inputGroup}>
      <Text
        style={[
          styles.label,
          { color: theme?.colors?.text?.primary || '#1E293B' },
        ]}
      >
        Role
      </Text>
      <View style={styles.roleContainer}>
        {PROFILE_ROLES.map(role => (
          <TouchableOpacity
            key={role}
            style={[
              styles.roleButton,
              {
                backgroundColor:
                  selectedRole === role
                    ? `${theme.colors.primary.cyan}10`
                    : theme?.colors?.background?.secondary || '#F8FAFC',
                borderColor:
                  selectedRole === role
                    ? theme.colors.primary.cyan
                    : theme?.colors?.border?.primary || '#E2E8F0',
              },
            ]}
            onPress={() => onRoleChange(role)}
          >
            <Text
              style={[
                styles.roleText,
                {
                  color:
                    selectedRole === role
                      ? theme.colors.primary.cyan
                      : theme?.colors?.text?.primary || '#1E293B',
                },
              ]}
            >
              {role}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileRoleSelector; 