import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from '../../components/elements/Icon';
import ProfileItem from './ProfileItem';
import ProfileForm from './ProfileForm';

const { width } = Dimensions.get('window');

const ProfileModal = ({
  isVisible,
  onClose,
  profiles,
  onProfileSwitch,
  showAddForm,
  setShowAddForm,
  formData,
  setFormData,
  onAddProfile,
  theme,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
            },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor: theme?.colors?.border?.primary || '#E2E8F0',
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: theme?.colors?.text?.primary || '#1E293B' },
              ]}
            >
              Switch Profile
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon
                name="x"
                size={20}
                color={theme?.colors?.text?.secondary || '#64748B'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.profilesList}>
            {profiles.map(profile => (
              <ProfileItem
                key={profile.id}
                profile={profile}
                isSelected={profile.isActive}
                onPress={onProfileSwitch}
                theme={theme}
              />
            ))}

            <TouchableOpacity
              style={[
                styles.addProfileButton,
                {
                  backgroundColor:
                    theme?.colors?.background?.primary || '#FFFFFF',
                  borderColor: theme?.colors?.primary?.cyan || '#3C4FE0',
                },
              ]}
              onPress={() => setShowAddForm(true)}
            >
              <Icon
                name="plus"
                size={20}
                color={theme?.colors?.primary?.cyan || '#3C4FE0'}
              />
              <Text
                style={[
                  styles.addProfileText,
                  { color: theme?.colors?.primary?.cyan || '#3C4FE0' },
                ]}
              >
                Add New Profile
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {showAddForm && (
            <ProfileForm
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={onAddProfile}
              onCancel={() => setShowAddForm(false)}
              theme={theme}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  profilesList: {
    maxHeight: 300,
  },
  addProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addProfileText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileModal;
