import { StyleSheet } from 'react-native';

const getStyles = theme =>
  StyleSheet.create({
    settingItem: {
      paddingVertical: theme?.spacing?.[3] || 15,
      paddingHorizontal: theme?.spacing?.[5] || 20,
      borderBottomWidth: 1,
      borderBottomColor: theme?.colors?.border?.primary || '#E0E0E0',
    },
    settingText: {
      fontSize: theme?.typography?.sizes?.base || 16,
      color: theme?.colors?.text?.primary || '#222',
    },
  });

export default getStyles;
