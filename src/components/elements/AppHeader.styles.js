import { StyleSheet } from 'react-native';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const getStyles = theme => StyleSheet.create({
  safeArea: {
    backgroundColor: theme?.colors?.background?.primary || bluewhiteTheme.colors.background.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme?.spacing?.[4] || 16,
    paddingVertical: theme?.spacing?.[3] || 12,
    backgroundColor: theme?.colors?.background?.primary || bluewhiteTheme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme?.colors?.background?.tertiary || bluewhiteTheme.colors.background.tertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    fontSize: theme?.typography?.sizes?.xl || 20,
    fontWeight: theme?.typography?.weights?.bold || 'bold',
    color: theme?.colors?.text?.primary || bluewhiteTheme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme?.typography?.sizes?.sm || 14,
    fontWeight: theme?.typography?.weights?.normal || 'normal',
    color: theme?.colors?.text?.secondary || bluewhiteTheme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme?.spacing?.[1] || 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme?.colors?.background?.secondary || bluewhiteTheme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default getStyles; 