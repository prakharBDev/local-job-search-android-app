import { StyleSheet } from 'react-native';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const getStyles = theme =>
  StyleSheet.create({
    safeArea: {
      backgroundColor:
        theme?.colors?.background?.primary ||
        bluewhiteTheme.colors.background.primary,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme?.spacing?.[5] || 20,
      paddingVertical: theme?.spacing?.[4] || 16,
      backgroundColor:
        theme?.colors?.background?.primary ||
        bluewhiteTheme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor:
        theme?.colors?.interactive?.border?.primary ||
        bluewhiteTheme.colors.interactive.border.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    leftSection: {
      flex: 1,
      alignItems: 'flex-start',
    },
    centerSection: {
      flex: 2,
      alignItems: 'flex-start',
    },
    centered: {
      alignItems: 'center',
    },
    rightSection: {
      flex: 1,
      alignItems: 'flex-end',
    },
    title: {
      fontSize: theme?.typography?.sizes?.xl || 22,
      fontWeight: theme?.typography?.weights?.bold || '700',
      color: theme?.colors?.text?.primary || bluewhiteTheme.colors.text.primary,
      textAlign: 'center',
      letterSpacing: -0.3,
      fontFamily: 'System',
    },
    subtitle: {
      fontSize: theme?.typography?.sizes?.sm || 15,
      fontWeight: theme?.typography?.weights?.medium || '500',
      color:
        theme?.colors?.text?.secondary || bluewhiteTheme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme?.spacing?.[1] || 4,
      letterSpacing: -0.1,
      fontFamily: 'System',
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor:
        theme?.colors?.background?.secondary ||
        bluewhiteTheme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme?.colors?.interactive?.border?.primary || '#E2E8F0',
    },
  });

export default getStyles;
