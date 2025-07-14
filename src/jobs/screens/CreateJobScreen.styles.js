import { StyleSheet } from 'react-native';
import {
  centeredContainer,
  primaryButton,
  cardShadow,
} from '../../theme/commonStyles';

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      ...centeredContainer,
    },
    gradient: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: theme.spacing[8],
    },
    headerContainer: {
      paddingHorizontal: theme.spacing[4],
      paddingVertical: theme.spacing[6],
    },
    headerContent: {
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      padding: theme.spacing[2],
      marginRight: theme.spacing[3],
      borderRadius: 8,
      backgroundColor: theme.colors.surface.card,
      ...cardShadow(theme),
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[2],
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: 8,
      padding: theme.spacing[3],
      fontSize: 16,
      marginBottom: theme.spacing[3],
      backgroundColor: theme.colors.surface.input,
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
    card: {
      backgroundColor: theme.colors.surface.card,
      borderRadius: 12,
      padding: theme.spacing[4],
      ...cardShadow(theme),
    },
    errorCard: {
      backgroundColor: theme.colors.surface.card,
      borderRadius: 12,
      padding: theme.spacing[4],
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.status.error,
      ...cardShadow(theme),
    },
    errorText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.status.error,
      marginBottom: theme.spacing[1],
    },
    errorSubText: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
  });
