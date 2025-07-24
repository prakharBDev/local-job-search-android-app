import { StyleSheet } from 'react-native';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const getStyles = theme =>
  StyleSheet.create({
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme?.borderRadius?.xl || 24,
      paddingVertical: theme?.spacing?.[5] || 20,
      paddingHorizontal: theme?.spacing?.[5] || 20,
      marginBottom: theme?.spacing?.[4] || 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      backgroundColor: theme?.colors?.background?.primary || '#fff',
      gap: theme?.spacing?.[4] || 16,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme?.spacing?.[3] || 12,
    },
    actionTitle: {
      fontSize: theme?.typography?.sizes?.lg || 18,
      fontWeight: theme?.typography?.weights?.bold || 'bold',
      color: theme?.colors?.text?.primary || '#22223b',
    },
    actionSubtitle: {
      fontSize: theme?.typography?.sizes?.sm || 13,
      color: theme?.colors?.text?.secondary || '#7b8794',
      marginTop: theme?.spacing?.[1] || 2,
    },
  });

export default getStyles;
