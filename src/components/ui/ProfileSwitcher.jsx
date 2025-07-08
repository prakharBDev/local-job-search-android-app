import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from './Icon';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const getStyles = theme =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    profileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 25,
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
    },
    profileImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
    },
    profileName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme?.colors?.text?.primary || '#1E293B',
      maxWidth: 120,
    },
    chevron: {
      marginLeft: 4,
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: width * 0.9,
      maxHeight: '80%',
      backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
      borderRadius: 20,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme?.colors?.border?.primary || '#E2E8F0',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme?.colors?.text?.primary || '#1E293B',
    },
    closeButton: {
      padding: 8,
    },
    profilesList: {
      maxHeight: 300,
    },
    profileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      marginBottom: 10,
      borderRadius: 12,
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
    },
    selectedProfile: {
      borderWidth: 2,
      borderColor: theme?.colors?.primary?.cyan || '#3C4FE0',
      backgroundColor: `${theme?.colors?.primary?.cyan || '#3C4FE0'}10`,
    },
    profileItemImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 15,
    },
    profileItemContent: {
      flex: 1,
    },
    profileItemName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme?.colors?.text?.primary || '#1E293B',
      marginBottom: 2,
    },
    profileItemRole: {
      fontSize: 12,
      color: theme?.colors?.text?.secondary || '#475569',
      backgroundColor: `${theme?.colors?.primary?.cyan || '#3C4FE0'}20`,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      alignSelf: 'flex-start',
    },
    profileItemEmail: {
      fontSize: 12,
      color: theme?.colors?.text?.tertiary || '#64748B',
      marginTop: 2,
    },
    addProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      marginTop: 10,
      borderRadius: 12,
      backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme?.colors?.primary?.cyan || '#3C4FE0',
    },
    addProfileText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '500',
      color: theme?.colors?.primary?.cyan || '#3C4FE0',
    },
    formContainer: {
      marginTop: 20,
    },
    inputGroup: {
      marginBottom: 15,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme?.colors?.text?.primary || '#1E293B',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: theme?.colors?.text?.primary || '#1E293B',
      backgroundColor: theme?.colors?.background?.secondary || '#F8FAFC',
    },
    roleSelector: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    roleButton: {
      flex: 1,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
      backgroundColor: theme.colors.background.secondary,
    },
    selectedRole: {
      borderColor: theme.colors.primary.cyan,
      backgroundColor: `${theme.colors.primary.cyan}10`,
    },
    roleText: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    selectedRoleText: {
      color: theme.colors.primary.cyan,
      fontWeight: '500',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    actionButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    cancelButton: {
      backgroundColor: theme.colors.background.secondary,
    },
    saveButton: {
      backgroundColor: theme.colors.primary.cyan,
      borderColor: theme.colors.primary.cyan,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.secondary,
    },
    saveButtonText: {
      color: theme.colors.text.white,
    },
  });

const getGradientColors = (role, theme) => {
  switch (role) {
    case 'Job Seeker':
      return [theme.colors.primary.cyan, theme.colors.primary.dark];
    case 'Employer':
      return [theme.colors.accent.orange, '#F44336'];
    default:
      return [theme.colors.primary.cyan, theme.colors.primary.dark];
  }
};

const ProfileSwitcher = ({ size = 'small', style }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme || {});
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Job Seeker',
      avatar: 'https://via.placeholder.com/40',
      isActive: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'Employer',
      avatar: 'https://via.placeholder.com/40',
      isActive: false,
    },
  ]);

  const [newProfile, setNewProfile] = useState({
    name: '',
    email: '',
    role: 'Job Seeker',
  });

  const currentProfile = profiles.find(p => p.isActive) || profiles[0];

  const handleProfileSwitch = profileId => {
    setProfiles(prev =>
      prev.map(p => ({
        ...p,
        isActive: p.id === profileId,
      })),
    );
    setModalVisible(false);
  };

  const handleAddProfile = () => {
    if (!newProfile.name || !newProfile.email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newId = Math.max(...profiles.map(p => p.id)) + 1;
    const profile = {
      id: newId,
      ...newProfile,
      avatar: 'https://via.placeholder.com/40',
      isActive: false,
    };

    setProfiles(prev => [...prev, profile]);
    setNewProfile({ name: '', email: '', role: 'Job Seeker' });
    setShowAddForm(false);
  };

  const renderProfileItem = profile => (
    <TouchableOpacity
      key={profile.id}
      style={[styles.profileItem, profile.isActive && styles.selectedProfile]}
      onPress={() => handleProfileSwitch(profile.id)}
    >
      <LinearGradient
        colors={getGradientColors(profile.role, theme)}
        style={styles.profileItemImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.profileItemContent}>
        <Text style={styles.profileItemName}>{profile.name}</Text>
        <Text style={styles.profileItemRole}>{profile.role}</Text>
        <Text style={styles.profileItemEmail}>{profile.email}</Text>
      </View>
      {profile.isActive && (
        <Icon name="check-circle" size={20} color={theme.colors.primary.cyan} />
      )}
    </TouchableOpacity>
  );

  const renderAddForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={newProfile?.name}
          onChangeText={text =>
            setNewProfile(prev => ({ ...prev, name: text }))
          }
          placeholder="Enter your name"
          placeholderTextColor={theme?.colors?.text?.tertiary || '#64748B'}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={newProfile?.email}
          onChangeText={text =>
            setNewProfile(prev => ({ ...prev, email: text }))
          }
          placeholder="Enter your email"
          placeholderTextColor={theme?.colors?.text?.tertiary || '#64748B'}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Role</Text>
        <View style={styles.roleSelector}>
          {['Job Seeker', 'Employer'].map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleButton,
                newProfile.role === role && styles.selectedRole,
              ]}
              onPress={() => setNewProfile(prev => ({ ...prev, role }))}
            >
              <Text
                style={[
                  styles.roleText,
                  newProfile.role === role && styles.selectedRoleText,
                ]}
              >
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => {
            setShowAddForm(false);
            setNewProfile({ name: '', email: '', role: 'Job Seeker' });
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleAddProfile}
        >
          <LinearGradient
            colors={[theme.colors.primary.cyan, theme.colors.primary.dark]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Text style={[styles.buttonText, styles.saveButtonText]}>
            Add Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.profileButton, style]}
        onPress={() => navigation.navigate('Onboarding')}
      >
        {/* Blue dot avatar */}
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#2563EB', marginRight: 8 }} />
        <Icon
          name="chevron-down"
          size={16}
          color={theme.colors.text.secondary}
          style={styles.chevron}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Profile</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="x" size={20} color={theme.colors.primary.cyan} />
              </TouchableOpacity>
            </View>

            {!showAddForm ? (
              <>
                <ScrollView
                  style={styles.profilesList}
                  showsVerticalScrollIndicator={false}
                >
                  {profiles.map(renderProfileItem)}
                </ScrollView>

                <TouchableOpacity
                  style={styles.addProfileButton}
                  onPress={() => setShowAddForm(true)}
                >
                  <Icon
                    name="plus"
                    size={16}
                    color={theme.colors.primary.cyan}
                  />
                  <Text style={styles.addProfileText}>Add New Profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              renderAddForm()
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ProfileSwitcher;
