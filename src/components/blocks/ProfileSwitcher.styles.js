import { StyleSheet, Dimensions } from 'react-native';
import { centeredContainer, primaryButton } from '../../theme/commonStyles';

const { width, height } = Dimensions.get('window');

export const getStyles = (theme = {}) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      ...centeredContainer,
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
      ...primaryButton(theme),
    },
    profileImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
      color: theme?.colors?.text?.primary,
    },
    chevron: {
      marginLeft: 8,
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.2)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      minHeight: height * 0.5,
      maxHeight: height * 0.8,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: theme?.colors?.text?.primary,
    },
    closeButton: {
      padding: 8,
      borderRadius: 16,
      backgroundColor: '#F3F4F6',
    },
    addButton: {
      marginTop: 16,
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme?.colors?.primary?.cyan || '#3C4FE0',
      alignItems: 'center',
      ...primaryButton(theme),
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    profileList: {
      marginTop: 8,
    },
    profileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
    },
    profileItemImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
    },
    profileItemName: {
      fontSize: 16,
      color: theme?.colors?.text?.primary,
    },
    profileItemRole: {
      fontSize: 14,
      color: theme?.colors?.text?.secondary,
      marginLeft: 8,
    },
    addProfileForm: {
      marginTop: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
      fontSize: 16,
      color: theme?.colors?.text?.primary,
    },
    saveButton: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme?.colors?.primary?.cyan || '#3C4FE0',
      alignItems: 'center',
      ...primaryButton(theme),
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
