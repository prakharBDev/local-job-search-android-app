import { StyleSheet } from 'react-native';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const getStyles = theme =>
  StyleSheet.create({
    inputGroup: {
      marginBottom: theme?.spacing?.[4] || 16,
    },
    label: {
      fontSize: theme?.typography?.sizes?.sm || 14,
      fontWeight: theme?.typography?.weights?.medium || '500',
      marginBottom: theme?.spacing?.[1] || 6,
    },
    roleContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme?.spacing?.[2] || 8,
    },
    roleButton: {
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[2] || 8,
      borderRadius: theme?.borderRadius?.full || 20,
      borderWidth: 1,
    },
    roleText: {
      fontSize: theme?.typography?.sizes?.sm || 14,
      fontWeight: theme?.typography?.weights?.medium || '500',
    },
  });

export default getStyles;
