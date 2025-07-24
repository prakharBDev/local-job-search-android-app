import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import getStyles from './ProfileRoleSelector.styles';

const PROFILE_ROLES = ['seeker', 'poster'];

const ProfileRoleSelector = React.memo(({ selectedRole, onRoleChange }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Role</Text>
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
});

ProfileRoleSelector.displayName = 'ProfileRoleSelector';

export default ProfileRoleSelector;
