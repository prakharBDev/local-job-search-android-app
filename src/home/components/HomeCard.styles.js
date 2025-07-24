import { StyleSheet } from 'react-native';
import { bluewhiteTheme } from '../../theme/bluewhite-theme';

const getStyles = theme => StyleSheet.create({
  card: {
    marginBottom: theme?.spacing?.lg || 24,
    width: '100%',
    maxWidth: 400,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme?.spacing?.sm || 8,
    marginTop: theme?.spacing?.md || 16,
  },
});

export default getStyles; 