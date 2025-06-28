import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { theme } from '../../theme';
import { useProfile, type SavedProfile } from '../../contexts/ProfileContext';
import { useAuth } from '../../contexts/AuthContext';
import type { UserProfile } from '../../types/navigation';

const { width, height } = Dimensions.get('window');

interface ProfileSwitcherProps {
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  style?: any;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  size = 'medium',
  showName = false,
  style,
}) => {
  const {
    activeProfile,
    profiles,
    isModalVisible,
    showProfileSwitcher,
    hideProfileSwitcher,
    switchProfile,
    addProfile,
    deleteProfile,
    duplicateProfile,
    getProfileInitials,
    getProfileDisplayName,
    error,
    clearError,
  } = useProfile();

  const { login } = useAuth();

  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileNickname, setNewProfileNickname] = useState('');
  const [newProfileEmail, setNewProfileEmail] = useState('');
  const [selectedMode, setSelectedMode] = useState<'seeker' | 'poster'>('seeker');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    if (isModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isModalVisible, fadeAnim, scaleAnim]);

  useEffect(() => {
    if (error) {
      Alert.alert('Profile Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, fontSize: 12 };
      case 'large':
        return { width: 48, height: 48, fontSize: 16 };
      default:
        return { width: 40, height: 40, fontSize: 14 };
    }
  };

  const getProfileColor = (profile: SavedProfile) => {
    const colors = [
      [theme.colors.primary.emerald, theme.colors.primary.forest],
      ['#2196F3', '#1976D2'],
      [theme.colors.accent.orange, '#F44336'],
      ['#9C27B0', '#673AB7'],
      ['#4CAF50', '#388E3C'],
      ['#FF5722', '#D84315'],
    ];
    
    const index = profile.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handleSwitchProfile = async (profileId: string) => {
    try {
      // Find the profile being switched to
      const newProfile = profiles.find(p => p.id === profileId);
      if (!newProfile) {
        throw new Error('Profile not found');
      }

      // Switch the profile in ProfileContext
      await switchProfile(profileId);

      // Also update the AuthContext with the new profile data
      // This ensures DashboardScreen gets the correct user mode (seeker/poster)
      const userProfile: UserProfile = {
        id: newProfile.id,
        name: newProfile.name,
        email: newProfile.email,
        mode: newProfile.mode,
      };
      
      await login(userProfile);

      hideProfileSwitcher();
    } catch (error) {
      // Error handled by useEffect
      console.error('Profile switch failed:', error);
    }
  };

  const handleAddProfile = async () => {
    if (!newProfileNickname.trim() || !newProfileName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await addProfile({
        nickname: newProfileNickname.trim(),
        name: newProfileName.trim(),
        email: newProfileEmail.trim() || `${newProfileNickname.toLowerCase()}@example.com`,
        mode: selectedMode,
        description: `${newProfileNickname} profile`,
      });

      setIsAddingProfile(false);
      setNewProfileName('');
      setNewProfileNickname('');
      setNewProfileEmail('');
      setSelectedMode('seeker');
      
      Alert.alert('Success', 'Profile created successfully!');
    } catch (error) {
      // Error handled by useEffect
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this profile? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfile(profileId);
            } catch (error) {
              // Error handled by useEffect
            }
          },
        },
      ]
    );
  };

  const handleDuplicateProfile = (profile: SavedProfile) => {
    Alert.prompt(
      'Duplicate Profile',
      'Enter a nickname for the duplicated profile:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async (nickname) => {
            if (nickname && nickname.trim()) {
              try {
                await duplicateProfile(profile.id, nickname.trim());
                Alert.alert('Success', 'Profile duplicated successfully!');
              } catch (error) {
                // Error handled by useEffect
              }
            }
          },
        },
      ],
      'plain-text',
      `Copy of ${profile.nickname}`
    );
  };

  const renderProfileButton = () => {
    if (!activeProfile) return null;

    const sizeStyle = getSizeStyle();
    const profileColors = getProfileColor(activeProfile);

    return (
      <TouchableOpacity
        style={[styles.profileButton, style]}
        onPress={showProfileSwitcher}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={profileColors}
          style={[styles.profileAvatar, sizeStyle]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.profileInitials, { fontSize: sizeStyle.fontSize }]}>
            {getProfileInitials(activeProfile)}
          </Text>
        </LinearGradient>
        {showName && (
          <Text style={styles.profileName} numberOfLines={1}>
            {getProfileDisplayName(activeProfile)}
          </Text>
        )}
        <Feather name="chevron-down" size={12} color={theme.colors.text.secondary} />
      </TouchableOpacity>
    );
  };

  const renderProfileItem = (profile: SavedProfile) => {
    const isActive = profile.id === activeProfile?.id;
    const profileColors = getProfileColor(profile);

    return (
      <TouchableOpacity
        key={profile.id}
        style={[styles.profileItem, isActive && styles.activeProfileItem]}
        onPress={() => handleSwitchProfile(profile.id)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={profileColors}
          style={styles.profileItemAvatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.profileItemInitials}>
            {getProfileInitials(profile)}
          </Text>
        </LinearGradient>

        <View style={styles.profileItemContent}>
          <View style={styles.profileItemHeader}>
            <Text style={styles.profileItemNickname}>
              {getProfileDisplayName(profile)}
            </Text>
            {isActive && (
              <View style={styles.activeIndicator}>
                <Feather name="check" size={12} color={theme.colors.primary.emerald} />
              </View>
            )}
          </View>
          <Text style={styles.profileItemName} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={styles.profileItemMode}>
            {profile.mode === 'seeker' ? '🎯 Job Seeker' : '🏢 Job Poster'}
          </Text>
        </View>

        <View style={styles.profileItemActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDuplicateProfile(profile)}
          >
            <Feather name="copy" size={14} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          {profiles.length > 1 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteProfile(profile.id)}
            >
              <Feather name="trash-2" size={14} color={theme.colors.status.error} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderAddProfileForm = () => (
    <View style={styles.addProfileForm}>
      <Text style={styles.addProfileTitle}>Create New Profile</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Profile Nickname *</Text>
        <TextInput
          style={styles.textInput}
          value={newProfileNickname}
          onChangeText={setNewProfileNickname}
          placeholder="e.g., Work, Personal, Freelance"
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.textInput}
          value={newProfileName}
          onChangeText={setNewProfileName}
          placeholder="Your full name"
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.textInput}
          value={newProfileEmail}
          onChangeText={setNewProfileEmail}
          placeholder="Optional email address"
          placeholderTextColor={theme.colors.text.tertiary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Profile Type</Text>
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeOption,
              selectedMode === 'seeker' && styles.selectedModeOption,
            ]}
            onPress={() => setSelectedMode('seeker')}
          >
            <Text style={[
              styles.modeOptionText,
              selectedMode === 'seeker' && styles.selectedModeOptionText,
            ]}>
              🎯 Job Seeker
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeOption,
              selectedMode === 'poster' && styles.selectedModeOption,
            ]}
            onPress={() => setSelectedMode('poster')}
          >
            <Text style={[
              styles.modeOptionText,
              selectedMode === 'poster' && styles.selectedModeOptionText,
            ]}>
              🏢 Job Poster
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setIsAddingProfile(false);
            setNewProfileName('');
            setNewProfileNickname('');
            setNewProfileEmail('');
            setSelectedMode('seeker');
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleAddProfile}
        >
          <LinearGradient
            colors={[theme.colors.primary.emerald, theme.colors.primary.forest]}
            style={styles.createButtonGradient}
          >
            <Text style={styles.createButtonText}>Create Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      {renderProfileButton()}
      
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={hideProfileSwitcher}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideProfileSwitcher}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Switch Profile</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={hideProfileSwitcher}
                >
                  <Feather name="x" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              </View>

              {isAddingProfile ? (
                renderAddProfileForm()
              ) : (
                <>
                  <ScrollView style={styles.profilesList} showsVerticalScrollIndicator={false}>
                    {profiles.map(renderProfileItem)}
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.addProfileButton}
                    onPress={() => setIsAddingProfile(true)}
                  >
                    <Feather name="plus" size={16} color={theme.colors.primary.emerald} />
                    <Text style={styles.addProfileButtonText}>Add New Profile</Text>
                  </TouchableOpacity>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileAvatar: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileInitials: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    maxWidth: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: 16,
    width: Math.min(width - 40, 400),
    maxHeight: height * 0.8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  profilesList: {
    maxHeight: 300,
    padding: 20,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeProfileItem: {
    borderColor: theme.colors.primary.emerald,
    backgroundColor: theme.colors.primary.emerald + '10',
  },
  profileItemAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileItemInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  profileItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileItemNickname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  activeIndicator: {
    backgroundColor: theme.colors.primary.emerald + '20',
    borderRadius: 12,
    padding: 4,
  },
  profileItemName: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  profileItemMode: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    marginTop: 4,
  },
  profileItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.background.primary,
  },
  addProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary.emerald,
    borderStyle: 'dashed',
  },
  addProfileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary.emerald,
    marginLeft: 8,
  },
  addProfileForm: {
    padding: 20,
  },
  addProfileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  modeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  selectedModeOption: {
    borderColor: theme.colors.primary.emerald,
    backgroundColor: theme.colors.primary.emerald + '10',
  },
  modeOptionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  selectedModeOptionText: {
    color: theme.colors.primary.emerald,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  createButtonGradient: {
    padding: 14,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ProfileSwitcher; 