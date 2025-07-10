import { StyleSheet } from 'react-native';
import { centeredContainer, primaryButton, cardShadow } from '../../theme/commonStyles';

export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    ...centeredContainer,
  },
  card: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: 12,
    padding: theme.spacing[4],
    ...cardShadow(theme),
  },
  button: {
    ...primaryButton(theme),
    padding: theme.spacing[3],
    marginTop: theme.spacing[4],
  },
  buttonText: {
    color: theme.colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 