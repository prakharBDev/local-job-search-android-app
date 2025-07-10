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
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useAuth } from '../../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const ProfileSwitcher = ({ size = 'small', style }) => {
  const { theme } = useTheme();
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
  const [selectedMode, setSelectedMode] = useState('seeker');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    if (isModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [isModalVisible, fadeAnim, scaleAnim]);

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) {
      Alert.alert('Error', 'Please enter a profile name');
      return;
    }

    if (!newProfileEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newProfileEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const newProfile = {
        id: Date.now().toString(),
        name: newProfileName.trim(),
        nickname: newProfileNickname.trim() || newProfileName.trim(),
        email: newProfileEmail.trim(),
        mode: selectedMode,
        isActive: false,
        createdAt: new Date().toISOString(),
      };

      await addProfile(newProfile);
      
      // Reset form
      setNewProfileName('');
      setNewProfileNickname('');
      setNewProfileEmail('');
      setSelectedMode('seeker');
      setIsAddingProfile(false);
      
      Alert.alert('Success', 'Profile added successfully');
    } catch (error) {
      console.error('Error adding profile:', error);
      Alert.alert('Error', 'Failed to add profile');
    }
  };

  const handleDeleteProfile = (profileId) => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteProfile(profileId)
        },
      ]
    );
  };

  const handleDuplicateProfile = (profile) => {
    const duplicatedProfile = {
      ...profile,
      id: Date.now().toString(),
      name: `${profile.name} Copy`,
      nickname: `${profile.nickname} Copy`,
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    
    addProfile(duplicatedProfile);
    Alert.alert('Success', 'Profile duplicated successfully');
  };

  const getGradientColors = (mode) => {
    switch (mode) {
      case 'seeker':
        return ['#3C4FE0', '#6366F1'];
      case 'employer':
        return ['#10B981', '#059669'];
      case 'recruiter':
        return ['#F59E0B', '#D97706'];
      default:
        return ['#3C4FE0', '#6366F1'];
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'seeker':
        return '#3C4FE0';
      case 'employer':
        return '#10B981';
      case 'recruiter':
        return '#F59E0B';
      default:
        return '#3C4FE0';
    }
  };

  const renderProfileButton = () => (
    <TouchableOpacity
      style={[styles.profileButton, style]}
      onPress={showProfileSwitcher}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors(activeProfile?.mode)}
        style={styles.profileImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.profileInitials}>
          {getProfileInitials(activeProfile)}
        </Text>
      </LinearGradient>
      
      {size !== 'small' && (
        <>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {getProfileDisplayName(activeProfile)}
            </Text>
            <Text style={styles.profileRole}>
              {activeProfile?.mode?.charAt(0).toUpperCase() + activeProfile?.mode?.slice(1)}
            </Text>
          </View>
          <Feather 
            name="chevron-down" 
            size={16} 
            color={theme?.colors?.text?.secondary} 
            style={styles.chevron}
          />
        </>
      )}
    </TouchableOpacity>
  );

  const renderProfileItem = (profile) => (
    <TouchableOpacity
      key={profile.id}
      style={[
        styles.profileItem,
        profile.isActive && styles.activeProfileItem
      ]}
      onPress={() => switchProfile(profile.id)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={getGradientColors(profile.mode)}
        style={styles.profileItemImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.profileItemInitials}>
          {getProfileInitials(profile)}
        </Text>
      </LinearGradient>
      
      <View style={styles.profileItemInfo}>
        <Text style={styles.profileItemName} numberOfLines={1}>
          {getProfileDisplayName(profile)}
        </Text>
        <Text style={styles.profileItemEmail} numberOfLines={1}>
          {profile.email}
        </Text>
        <View style={[styles.profileItemMode, { backgroundColor: `${getModeColor(profile.mode)}20` }]}>
          <Text style={[styles.profileItemModeText, { color: getModeColor(profile.mode) }]}>
            {profile.mode?.charAt(0).toUpperCase() + profile.mode?.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.profileItemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDuplicateProfile(profile)}
        >
          <Feather name="copy" size={16} color={theme?.colors?.text?.secondary} />
        </TouchableOpacity>
        
        {!profile.isActive && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteProfile(profile.id)}
          >
            <Feather name="trash-2" size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAddProfileForm = () => (
    <View style={styles.addProfileForm}>
      <Text style={styles.formTitle}>Add New Profile</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={newProfileName}
          onChangeText={setNewProfileName}
          placeholder="Enter full name"
          placeholderTextColor={theme?.colors?.text?.tertiary}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nickname</Text>
        <TextInput
          style={styles.input}
          value={newProfileNickname}
          onChangeText={setNewProfileNickname}
          placeholder="Enter nickname (optional)"
          placeholderTextColor={theme?.colors?.text?.tertiary}
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email *</Text>
        <TextInput
          style={styles.input}
          value={newProfileEmail}
          onChangeText={setNewProfileEmail}
          placeholder="Enter email address"
          placeholderTextColor={theme?.colors?.text?.tertiary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Profile Type</Text>
        <View style={styles.modeSelector}>
          {['seeker', 'employer', 'recruiter'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton,
                selectedMode === mode && styles.selectedModeButton,
                { borderColor: getModeColor(mode) }
              ]}
              onPress={() => setSelectedMode(mode)}
            >
              <Text style={[
                styles.modeButtonText,
                selectedMode === mode && styles.selectedModeButtonText,
                selectedMode === mode && { color: getModeColor(mode) }
              ]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setIsAddingProfile(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProfile}
        >
          <Text style={styles.addButtonText}>Add Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderProfileButton()}
      
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Profile</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={hideProfileSwitcher}
              >
                <Feather name="x" size={24} color={theme?.colors?.text?.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {!isAddingProfile ? (
                <>
                  <View style={styles.profilesList}>
                    {profiles.map(renderProfileItem)}
                  </View>
                  
                  <TouchableOpacity
                    style={styles.addProfileButton}
                    onPress={() => setIsAddingProfile(true)}
                  >
                    <Feather name="plus" size={20} color={theme?.colors?.primary?.main} />
                    <Text style={styles.addProfileButtonText}>Add New Profile</Text>
                  </TouchableOpacity>
                </>
              ) : (
                renderAddProfileForm()
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  profileInitials: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    maxWidth: 120,
  },
  profileRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  chevron: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  profilesList: {
    marginBottom: 20,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  activeProfileItem: {
    backgroundColor: '#3C4FE010',
    borderWidth: 2,
    borderColor: '#3C4FE0',
  },
  profileItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileItemInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileItemInfo: {
    flex: 1,
  },
  profileItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  profileItemEmail: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  profileItemMode: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  profileItemModeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  profileItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  addProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3C4FE0',
  },
  addProfileButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#3C4FE0',
  },
  addProfileForm: {
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#F8FAFC',
  },
  selectedModeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  selectedModeButtonText: {
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#3C4FE0',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileSwitcher;