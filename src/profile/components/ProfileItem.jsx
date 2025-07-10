import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../../components/elements/Icon';

const getGradientColors = (role, theme) => {
  const roleColors = {
    'Job Seeker': [
      theme?.colors?.primary?.cyan || '#3C4FE0',
      theme?.colors?.primary?.purple || '#8B5CF6',
    ],
    Employer: [
      theme?.colors?.primary?.orange || '#F59E0B',
      theme?.colors?.primary?.red || '#EF4444',
    ],
    Recruiter: [
      theme?.colors?.primary?.green || '#10B981',
      theme?.colors?.primary?.blue || '#3B82F6',
    ],
  };
  return roleColors[role] || roleColors['Job Seeker'];
};

const ProfileItem = ({ profile, isSelected, onPress, theme }) => {
  const gradientColors = getGradientColors(profile.role, theme);

  return (
    <TouchableOpacity
      style={[
        styles.profileItem,
        isSelected && styles.selectedProfile,
        { backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC' },
      ]}
      onPress={() => onPress(profile.id)}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.profileItemImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileImageContent}>
          <Text style={styles.profileInitials}>
            {profile.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.profileItemContent}>
        <Text
          style={[
            styles.profileItemName,
            { color: theme?.colors?.text?.primary || '#1E293B' },
          ]}
        >
          {profile.name}
        </Text>
        <Text
          style={[
            styles.profileItemRole,
            {
              color: theme?.colors?.text?.secondary || '#475569',
              backgroundColor: `${theme?.colors?.primary?.cyan || '#3C4FE0'}20`,
            },
          ]}
        >
          {profile.role}
        </Text>
        <Text
          style={[
            styles.profileItemEmail,
            { color: theme?.colors?.text?.tertiary || '#64748B' },
          ]}
        >
          {profile.email}
        </Text>
      </View>

      {isSelected && (
        <Icon
          name="check"
          size={20}
          color={theme?.colors?.primary?.cyan || '#3C4FE0'}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
  },
  selectedProfile: {
    borderWidth: 2,
    borderColor: '#3C4FE0',
    backgroundColor: '#3C4FE010',
  },
  profileItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileItemRole: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  profileItemEmail: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default ProfileItem; 