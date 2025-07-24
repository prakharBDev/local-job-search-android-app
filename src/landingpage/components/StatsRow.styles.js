import { StyleSheet } from 'react-native';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const getStyles = theme =>
  StyleSheet.create({
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme?.spacing?.[4] || 16,
      paddingVertical: theme?.spacing?.[4] || 16,
      gap: theme?.spacing?.[2] || 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme?.colors?.surface?.card || '#FFFFFF',
      borderRadius: theme?.borderRadius?.lg || 16,
      padding: theme?.spacing?.[3] || 12,
      alignItems: 'center',
      marginHorizontal: theme?.spacing?.[1] || 4,
      ...(theme?.shadows?.sm || {}),
      borderWidth: 1,
      borderColor: theme?.colors?.border?.primary || '#E2E8F0',
    },
    statNumber: {
      fontSize: theme?.typography?.sizes?.lg || 18,
      fontWeight: theme?.typography?.weights?.bold || '700',
      color: theme?.colors?.text?.primary || '#1E293B',
      marginTop: theme?.spacing?.[1] || 4,
      marginBottom: theme?.spacing?.[1] || 4,
    },
    statLabel: {
      fontSize: theme?.typography?.sizes?.xs || 12,
      color: theme?.colors?.text?.secondary || '#64748B',
      textAlign: 'center',
    },
  });

export default getStyles;
