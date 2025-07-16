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
      backgroundColor: '#F8FAFC',
    },
    keyboardView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 100,
    },
    scrollViewContentKeyboard: {
      paddingBottom: 150,
    },

    // Header Styles - More rounded and softer
    headerContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
      backgroundColor: '#FFFFFF',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    headerContent: {
      flex: 1,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    headerTitleContainer: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 4,
      fontFamily: 'System', // Soft system font
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: 15,
      color: '#64748B',
      fontWeight: '400',
      fontFamily: 'System',
      letterSpacing: -0.2,
      lineHeight: 20,
    },

    // Form Styles - More rounded and elegant
    formContainer: {
      paddingHorizontal: 20,
      paddingTop: 28,
    },
    formCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      padding: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 4,
      borderWidth: 0.5,
      borderColor: '#E2E8F0',
    },

    // Field Styles - Softer and more refined
    fieldContainer: {
      marginBottom: 28,
    },
    fieldLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 10,
      fontFamily: 'System',
      letterSpacing: -0.3,
    },
    requiredStar: {
      color: '#EF4444',
      fontSize: 16,
    },
    input: {
      borderWidth: 1.5,
      borderColor: '#E2E8F0',
      borderRadius: 16,
      paddingHorizontal: 18,
      paddingVertical: 16,
      fontSize: 16,
      color: '#1F2937',
      backgroundColor: '#FFFFFF',
      minHeight: 52,
      fontFamily: 'System',
      letterSpacing: -0.2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 4,
      elevation: 1,
    },
    inputFocused: {
      borderColor: '#3B82F6',
      borderWidth: 2,
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 3,
      backgroundColor: '#FEFEFF',
    },
    inputError: {
      borderColor: '#EF4444',
      borderWidth: 2,
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    textArea: {
      minHeight: 130,
      textAlignVertical: 'top',
      paddingTop: 16,
      borderRadius: 20,
    },
    characterCount: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 8,
      textAlign: 'right',
      fontFamily: 'System',
      letterSpacing: -0.1,
    },
    errorText: {
      fontSize: 14,
      color: '#EF4444',
      marginTop: 8,
      fontWeight: '500',
      fontFamily: 'System',
      letterSpacing: -0.2,
    },

    // Picker Styles - More rounded and modern
    pickerContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    pickerOption: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E2E8F0',
      backgroundColor: '#FFFFFF',
      minWidth: 90,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
    pickerOptionSelected: {
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    pickerOptionText: {
      fontSize: 14,
      color: '#374151',
      fontWeight: '500',
      fontFamily: 'System',
      letterSpacing: -0.2,
    },
    pickerOptionTextSelected: {
      color: '#FFFFFF',
      fontWeight: '600',
    },

    // Salary Styles - Enhanced spacing and curves
    salaryContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 16,
    },
    salaryField: {
      flex: 1,
    },
    salaryLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#6B7280',
      marginBottom: 8,
      fontFamily: 'System',
      letterSpacing: -0.2,
    },
    salaryInput: {
      textAlign: 'center',
      borderRadius: 16,
    },
    salaryDividerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 10,
    },
    salaryDivider: {
      fontSize: 16,
      color: '#6B7280',
      fontWeight: '500',
      paddingHorizontal: 8,
      fontFamily: 'System',
    },

    // Array Field Styles - More polished
    arrayFieldContainer: {
      marginBottom: 28,
    },
    arrayFieldLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 14,
      fontFamily: 'System',
      letterSpacing: -0.3,
    },
    arrayFieldContent: {
      gap: 14,
    },
    arrayItem: {
      width: '100%',
    },
    arrayItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    arrayInput: {
      flex: 1,
    },
    arrayItemButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FEF2F2',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#FECACA',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    arrayItemButtonDisabled: {
      backgroundColor: '#F9FAFB',
      borderColor: '#E5E7EB',
      shadowOpacity: 0,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#3B82F6',
      backgroundColor: '#F0F7FF',
      borderStyle: 'dashed',
      gap: 10,
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    addButtonText: {
      fontSize: 14,
      color: '#3B82F6',
      fontWeight: '600',
      fontFamily: 'System',
      letterSpacing: -0.2,
    },

    // Action Styles - More elegant and prominent
    actionContainer: {
      paddingHorizontal: 20,
      paddingTop: 36,
      paddingBottom: 24,
    },
    actionContent: {
      flexDirection: 'row',
      gap: 16,
    },
    actionButton: {
      flex: 1,
      minHeight: 56,
      borderRadius: 20, // More rounded for smoother look
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
      // Enhanced button styling
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    // Additional button variants for better integration
    saveDraftButton: {
      backgroundColor: '#F8FAFC',
      borderWidth: 2,
      borderColor: '#3B82F6',
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    publishButton: {
      backgroundColor: '#3B82F6',
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 6,
      // Subtle gradient effect through layered shadows
      borderWidth: 0,
    },
    buttonText: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: -0.3,
      lineHeight: 24,
    },
    saveDraftButtonText: {
      color: '#3B82F6',
    },
    publishButtonText: {
      color: '#FFFFFF',
    },
  });
