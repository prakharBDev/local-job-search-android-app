import { StyleSheet } from 'react-native';

export const getStyles = theme => StyleSheet.create({
  container: {
    // Container styles if needed
  },
  
  button: {
    borderRadius: theme?.borderRadius?.['2xl'] || 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Size variants
  buttonSm: {
    paddingHorizontal: theme?.spacing?.[4] || 16,
    paddingVertical: theme?.spacing?.[3] || 12,
    minHeight: 40,
  },
  
  buttonMd: {
    paddingHorizontal: theme?.spacing?.[6] || 24,
    paddingVertical: theme?.spacing?.[3] || 12,
    minHeight: 50,
  },
  
  buttonLg: {
    paddingHorizontal: theme?.spacing?.[8] || 32,
    paddingVertical: theme?.spacing?.[4] || 16,
    minHeight: 56,
  },
  
  // Variant styles
  buttonDefault: {
    backgroundColor: theme?.colors?.primary?.main || '#E3F2FD',
    ...theme?.shadows?.md || {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  
  buttonPrimary: {
    backgroundColor: theme?.colors?.jobCategories?.secondary?.background || '#75ce9b',
    ...theme?.shadows?.md || {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme?.colors?.primary?.secondary || '#3949AB',
    ...theme?.shadows?.sm || {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
  },
  
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  
  // CTA Button (Apply Now) variant
  buttonCta: {
    backgroundColor: theme?.colors?.cta?.primary || '#2ECC71',
    ...theme?.shadows?.md || {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  // Text styles
  text: {
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: theme?.typography?.fontFamily?.heading || 'Inter',
  },
  
  textSm: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  textMd: {
    fontSize: 16,
    lineHeight: 24,
  },
  
  textLg: {
    fontSize: 18,
    lineHeight: 24,
  },
  
  // Text color variants
  textDefault: {
    color: theme?.colors?.primary?.foreground || '#3949AB',
  },
  
  textPrimary: {
    color: theme?.colors?.text?.white || '#FFFFFF',
  },
  
  textOutline: {
    color: theme?.colors?.primary?.secondary || '#3949AB',
  },
  
  textGhost: {
    color: theme?.colors?.text?.secondary || '#9E9E9E',
  },
  
  // CTA text color
  textCta: {
    color: theme?.colors?.cta?.primaryText || '#FFFFFF',
  },
  
  // Utility styles
  fullWidth: {
    width: '100%',
  },
  
  disabled: {
    opacity: 0.6,
  },
  
  loading: {
    opacity: 0.8,
  },
  
  iconContainer: {
    marginRight: theme?.spacing?.[2] || 8,
  },
});

export default getStyles;