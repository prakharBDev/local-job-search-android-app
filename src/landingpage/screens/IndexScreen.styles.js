import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    keyboardAvoid: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    scrollContentKeyboard: {
      paddingBottom: 16,
    },

    // Animated Background Styles
    animatedBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      overflow: 'hidden',
    },
    floatingElement: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#3B82F6',
      opacity: 0.08,
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    floatingElementSmall: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#10B981',
      opacity: 0.12,
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    floatingElementTiny: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#F59E0B',
      opacity: 0.15,
      shadowColor: '#F59E0B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    floatingElementSquare: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: '#EC4899',
      opacity: 0.1,
      shadowColor: '#EC4899',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
      transform: [{ rotate: '45deg' }],
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(59, 130, 246, 0.01)',
    },
    gradientOverlayTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    gradientOverlayBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 150,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },

    // Header styles - Softer fonts and blue color
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
    },
    brandContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    brandIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    brandText: {
      justifyContent: 'center',
    },
    brandName: {
      fontSize: 18,
      fontWeight: '600', // Reduced from 700
      color: '#1E293B',
      lineHeight: 22,
      fontFamily: 'System',
      letterSpacing: -0.3,
    },
    brandTagline: {
      fontSize: 13,
      color: '#64748B',
      lineHeight: 16,
      fontFamily: 'System',
      fontWeight: '500',
    },
    headerButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#E2E8F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    headerButtonText: {
      fontSize: 14,
      fontWeight: '500', // Reduced from 600
      color: '#475569',
      fontFamily: 'System',
    },

    // Hero section - Softer fonts
    heroSection: {
      paddingHorizontal: 20,
      paddingVertical: 40,
      alignItems: 'center',
    },
    heroContent: {
      alignItems: 'center',
      maxWidth: 400,
    },
    heroTitle: {
      fontSize: 36,
      fontWeight: '600', // Reduced from 800
      color: '#1E293B',
      textAlign: 'center',
      lineHeight: 44,
      marginBottom: 16,
      fontFamily: 'System',
      letterSpacing: -0.5,
    },
    heroSubtitle: {
      fontSize: 18,
      color: '#64748B',
      textAlign: 'center',
      lineHeight: 26,
      marginBottom: 32,
      maxWidth: 320,
      fontFamily: 'System',
      fontWeight: '500',
    },
    heroStats: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8FAFC',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 2,
    },
    statItem: {
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    statNumber: {
      fontSize: 20,
      fontWeight: '600', // Reduced from 700
      color: '#3B82F6', // Changed to blue-500
      lineHeight: 24,
      fontFamily: 'System',
      letterSpacing: -0.3,
    },
    statLabel: {
      fontSize: 12,
      color: '#64748B',
      marginTop: 2,
      fontFamily: 'System',
      fontWeight: '500',
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: '#E2E8F0',
    },

    // Auth section - Softer fonts
    authContainer: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    authCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 12,
      borderWidth: 1,
      borderColor: '#F1F5F9',
    },
    authHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    authTitle: {
      fontSize: 24,
      fontWeight: '600', // Reduced from 700
      color: '#1E293B',
      marginBottom: 8,
      textAlign: 'center',
      fontFamily: 'System',
      letterSpacing: -0.4,
    },
    authSubtitle: {
      fontSize: 16,
      color: '#64748B',
      textAlign: 'center',
      lineHeight: 22,
      fontFamily: 'System',
      fontWeight: '500',
    },
    authForm: {
      gap: 20,
    },

    // Role selection - Softer fonts and blue color
    roleSelection: {
      marginBottom: 8,
    },
    roleLabel: {
      fontSize: 16,
      fontWeight: '500', // Reduced from 600
      color: '#1E293B',
      marginBottom: 12,
      fontFamily: 'System',
      letterSpacing: -0.2,
    },
    roleOptions: {
      flexDirection: 'row',
      gap: 12,
    },
    roleOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#E2E8F0',
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    roleOptionActive: {
      borderColor: '#3B82F6', // Changed to blue-500
      backgroundColor: '#EFF6FF',
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    roleIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: '#F8FAFC',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    roleIconActive: {
      backgroundColor: '#3B82F6', // Changed to blue-500
    },
    roleText: {
      fontSize: 14,
      fontWeight: '500', // Reduced from 600
      color: '#64748B',
      flex: 1,
      fontFamily: 'System',
    },
    roleTextActive: {
      color: '#3B82F6', // Changed to blue-500
    },

    // Form fields - Softer fonts
    formFields: {
      gap: 20,
    },
    inputContainer: {
      marginBottom: 4,
    },
    errorText: {
      fontSize: 12,
      color: '#EF4444',
      marginTop: 4,
      marginLeft: 4,
      fontWeight: '500',
      fontFamily: 'System',
    },

    // Buttons - Softer fonts and blue color
    primaryButton: {
      backgroundColor: '#3B82F6', // Changed to blue-500
      borderRadius: 12,
      height: 52,
      marginTop: 8,
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    primaryButtonDisabled: {
      backgroundColor: '#94A3B8',
      shadowColor: '#94A3B8',
      shadowOpacity: 0.1,
      elevation: 2,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '500', // Reduced from 600
      color: '#FFFFFF',
      fontFamily: 'System',
      letterSpacing: -0.2,
    },

    // Divider - Softer fonts
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#E2E8F0',
    },
    dividerText: {
      fontSize: 12,
      color: '#94A3B8',
      marginHorizontal: 16,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontFamily: 'System',
    },

    // Social buttons - Softer fonts
    socialButtons: {
      flexDirection: 'col',
      gap: 12,
    },
    socialButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      backgroundColor: '#FFFFFF',
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    socialButtonText: {
      fontSize: 14,
      fontWeight: '500', // Reduced from 600
      color: '#475569',
      fontFamily: 'System',
    },

    // Terms - Softer fonts
    termsText: {
      fontSize: 12,
      color: '#94A3B8',
      textAlign: 'center',
      lineHeight: 16,
      marginTop: 8,
      fontFamily: 'System',
    },
    termsLink: {
      color: '#3B82F6', // Changed to blue-500
      fontWeight: '500', // Reduced from 600
      textDecorationLine: 'underline',
    },

    // Features section - Softer fonts
    featuresSection: {
      paddingHorizontal: 20,
      paddingVertical: 40,
    },
    featuresTitle: {
      fontSize: 24,
      fontWeight: '600', // Reduced from 700
      color: '#1E293B',
      textAlign: 'center',
      marginBottom: 32,
      fontFamily: 'System',
      letterSpacing: -0.4,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'space-between',
    },
    featureCard: {
      width: (screenWidth - 56) / 2,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#F1F5F9',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    featureIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '500', // Reduced from 600
      color: '#1E293B',
      marginBottom: 8,
      textAlign: 'center',
      fontFamily: 'System',
      letterSpacing: -0.2,
    },
    featureDescription: {
      fontSize: 13,
      color: '#64748B',
      textAlign: 'center',
      lineHeight: 18,
      fontFamily: 'System',
      fontWeight: '500',
    },

    // Footer CTA - Softer fonts and blue color
    footerCta: {
      paddingHorizontal: 20,
      paddingVertical: 32,
      alignItems: 'center',
    },
    footerCtaText: {
      fontSize: 18,
      fontWeight: '500', // Reduced from 600
      color: '#1E293B',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 26,
      fontFamily: 'System',
      letterSpacing: -0.3,
    },
    footerButton: {
      borderColor: '#3B82F6', // Changed to blue-500
      borderWidth: 2,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 16,
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    footerButtonText: {
      fontSize: 16,
      fontWeight: '500', // Reduced from 600
      color: '#3B82F6', // Changed to blue-500
      fontFamily: 'System',
      letterSpacing: -0.2,
    },
  });
