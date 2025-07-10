import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.h4.fontSize,
    fontWeight: theme.typography.h4.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  headerSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
  },
  formContainer: {
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  formCard: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing[6],
  },
  fieldContainer: {
    marginBottom: theme.spacing[6],
  },
  fieldLabel: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing[3],
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.bodySmall.fontSize,
    marginTop: theme.spacing[1],
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  pickerOption: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
  },
  pickerOptionSelected: {
    backgroundColor: theme.colors.primary.cyan,
    borderColor: theme.colors.primary.cyan,
  },
  pickerOptionText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  pickerOptionTextSelected: {
    color: theme.colors.text.white,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  salaryField: {
    flex: 1,
  },
  salaryLabel: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },
  salaryInput: {
    textAlign: 'center',
  },
  salaryDivider: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    paddingTop: 20,
  },
  arrayFieldContainer: {
    gap: theme.spacing[2],
  },
  arrayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  arrayInput: {
    flex: 1,
  },
  arrayItemButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.primary.cyan,
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
    gap: theme.spacing[1],
  },
  addButtonText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primary.cyan,
    fontWeight: '500',
  },
  actionContainer: {
    paddingHorizontal: theme.spacing[4],
  },
  actionContent: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  actionButton: {
    flex: 1,
  },
}); 