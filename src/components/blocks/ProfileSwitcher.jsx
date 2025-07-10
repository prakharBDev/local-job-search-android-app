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
import { getStyles } from './ProfileSwitcher.styles.js';

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

  const handleDeleteProfile = profileId => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProfile(profileId),
        },
      ],
    );
  };

  const handleDuplicateProfile = profile => {
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

  const getGradientColors = mode => {
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

  const getModeColor = mode => {
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
      style={[getStyles(theme).profileButton, style]}
      onPress={showProfileSwitcher}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors(activeProfile?.mode)}
        style={getStyles(theme).profileImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={getStyles(theme).profileInitials}>
          {getProfileInitials(activeProfile)}
        </Text>
      </LinearGradient>

      {size !== 'small' && (
        <>
          <View style={getStyles(theme).profileInfo}>
            <Text style={getStyles(theme).profileName} numberOfLines={1}>
              {getProfileDisplayName(activeProfile)}
            </Text>
            <Text style={getStyles(theme).profileRole}>
              {activeProfile?.mode?.charAt(0).toUpperCase() +
                activeProfile?.mode?.slice(1)}
            </Text>
          </View>
          <Feather
            name="chevron-down"
            size={16}
            color={theme?.colors?.text?.secondary}
            style={getStyles(theme).chevron}
          />
        </>
      )}
    </TouchableOpacity>
  );

  const renderProfileItem = profile => (
    <TouchableOpacity
      key={profile.id}
      style={[getStyles(theme).profileItem, profile.isActive && getStyles(theme).activeProfileItem]}
      onPress={() => switchProfile(profile.id)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={getGradientColors(profile.mode)}
        style={getStyles(theme).profileItemImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={getStyles(theme).profileItemInitials}>
          {getProfileInitials(profile)}
        </Text>
      </LinearGradient>

      <View style={getStyles(theme).profileItemInfo}>
        <Text style={getStyles(theme).profileItemName} numberOfLines={1}>
          {getProfileDisplayName(profile)}
        </Text>
        <Text style={getStyles(theme).profileItemEmail} numberOfLines={1}>
          {profile.email}
        </Text>
        <View
          style={[
            getStyles(theme).profileItemMode,
            { backgroundColor: `${getModeColor(profile.mode)}20` },
          ]}
        >
          <Text
            style={[
              getStyles(theme).profileItemModeText,
              { color: getModeColor(profile.mode) },
            ]}
          >
            {profile.mode?.charAt(0).toUpperCase() + profile.mode?.slice(1)}
          </Text>
        </View>
      </View>

      <View style={getStyles(theme).profileItemActions}>
        <TouchableOpacity
          style={getStyles(theme).actionButton}
          onPress={() => handleDuplicateProfile(profile)}
        >
          <Feather
            name="copy"
            size={16}
            color={theme?.colors?.text?.secondary}
          />
        </TouchableOpacity>

        {!profile.isActive && (
          <TouchableOpacity
            style={getStyles(theme).actionButton}
            onPress={() => handleDeleteProfile(profile.id)}
          >
            <Feather name="trash-2" size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAddProfileForm = () => (
    <View style={getStyles(theme).addProfileForm}>
      <Text style={getStyles(theme).formTitle}>Add New Profile</Text>

      <View style={getStyles(theme).inputGroup}>
        <Text style={getStyles(theme).inputLabel}>Full Name *</Text>
        <TextInput
          style={getStyles(theme).input}
          value={newProfileName}
          onChangeText={setNewProfileName}
          placeholder="Enter full name"
          placeholderTextColor={theme?.colors?.text?.tertiary}
        />
      </View>

      <View style={getStyles(theme).inputGroup}>
        <Text style={getStyles(theme).inputLabel}>Nickname</Text>
        <TextInput
          style={getStyles(theme).input}
          value={newProfileNickname}
          onChangeText={setNewProfileNickname}
          placeholder="Enter nickname (optional)"
          placeholderTextColor={theme?.colors?.text?.tertiary}
        />
      </View>

      <View style={getStyles(theme).inputGroup}>
        <Text style={getStyles(theme).inputLabel}>Email *</Text>
        <TextInput
          style={getStyles(theme).input}
          value={newProfileEmail}
          onChangeText={setNewProfileEmail}
          placeholder="Enter email address"
          placeholderTextColor={theme?.colors?.text?.tertiary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={getStyles(theme).inputGroup}>
        <Text style={getStyles(theme).inputLabel}>Profile Type</Text>
        <View style={getStyles(theme).modeSelector}>
          {['seeker', 'employer', 'recruiter'].map(mode => (
            <TouchableOpacity
              key={mode}
              style={[
                getStyles(theme).modeButton,
                selectedMode === mode && getStyles(theme).selectedModeButton,
                { borderColor: getModeColor(mode) },
              ]}
              onPress={() => setSelectedMode(mode)}
            >
              <Text
                style={[
                  getStyles(theme).modeButtonText,
                  selectedMode === mode && getStyles(theme).selectedModeButtonText,
                  selectedMode === mode && { color: getModeColor(mode) },
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={getStyles(theme).formActions}>
        <TouchableOpacity
          style={getStyles(theme).cancelButton}
          onPress={() => setIsAddingProfile(false)}
        >
          <Text style={getStyles(theme).cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={getStyles(theme).addButton} onPress={handleAddProfile}>
          <Text style={getStyles(theme).addButtonText}>Add Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={getStyles(theme).container}>
      {renderProfileButton()}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
      >
        <View style={getStyles(theme).modalOverlay}>
          <Animated.View
            style={[
              getStyles(theme).modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={getStyles(theme).modalHeader}>
              <Text style={getStyles(theme).modalTitle}>Switch Profile</Text>
              <TouchableOpacity
                style={getStyles(theme).closeButton}
                onPress={hideProfileSwitcher}
              >
                <Feather
                  name="x"
                  size={24}
                  color={theme?.colors?.text?.primary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={getStyles(theme).modalContent}
              showsVerticalScrollIndicator={false}
            >
              {!isAddingProfile ? (
                <>
                  <View style={getStyles(theme).profilesList}>
                    {profiles.map(renderProfileItem)}
                  </View>
                  <TouchableOpacity
                    style={getStyles(theme).addProfileButton}
                    onPress={() => setIsAddingProfile(true)}
                  >
                    <Feather
                      name="plus"
                      size={20}
                      color={theme?.colors?.primary?.main}
                    />
                    <Text style={getStyles(theme).addProfileButtonText}>
                      Add New Profile
                    </Text>
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

export default ProfileSwitcher;
