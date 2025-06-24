// Forest Fresh Theme Colors - Exact HSL to RGB conversion from web app

export const colors = {
  // Primary colors - Forest Fresh green gradient
  primary: {
    emerald: '#66BB6A',        // hsl(130, 41%, 57%) - Primary emerald
    forest: '#388E3C',         // hsl(130, 56%, 45%) - Deep forest green
    light: '#81C784',          // hsl(130, 44%, 65%) - Lighter emerald
  },

  // Secondary colors - Light nature tones
  secondary: {
    lime: '#9CCC65',           // hsl(88, 50%, 60%) - Bright lime
    mint: '#81C784',           // hsl(130, 44%, 65%) - Soft mint
    light: '#F1F8E9',          // hsl(75, 100%, 97%) - Light green background
  },

  // Accent colors - Warm orange for CTAs
  accent: {
    orange: '#FF7043',         // hsl(14, 100%, 63%) - Warm Orange
    light: '#FFE0B2',          // Light orange
  },

  // Background colors
  background: {
    primary: '#F1F8E9',        // hsl(75, 100%, 97%) - Soft white with green tint
    secondary: '#FFFFFF',      // Pure white for cards
    gradient: {
      purple: ['#E1BEE7', '#CE93D8'],    // Purple gradient stops
      cyan: ['#B2EBF2', '#4DD0E1'],      // Cyan gradient stops
      emerald: ['#C8E6C9', '#81C784'],   // Emerald gradient stops
    }
  },

  // Text colors
  text: {
    primary: '#2C2C2C',        // hsl(210, 15%, 20%) - Dark charcoal
    secondary: '#666666',      // Medium gray
    tertiary: '#999999',       // Light gray
    white: '#FFFFFF',
  },

  // Status colors
  status: {
    success: '#66BB6A',        // Same as primary emerald
    warning: '#FFB74D',        // hsl(38, 92%, 50%)
    error: '#F44336',          // hsl(0, 72%, 51%)
    info: '#42A5F5',
  },

  // UI element colors
  border: {
    primary: '#E0E0E0',        // hsl(75, 15%, 85%) - Light green-tinted borders
    secondary: '#F5F5F5',
    focus: '#66BB6A',          // Emerald focus ring
  },

  // Shadow colors with opacity
  shadow: {
    primary: 'rgba(102, 187, 106, 0.25)', // Emerald shadow
    secondary: 'rgba(0, 0, 0, 0.1)',
    card: 'rgba(0, 0, 0, 0.08)',
  },

  // Glassmorphism colors
  glass: {
    white80: 'rgba(255, 255, 255, 0.8)',
    white90: 'rgba(255, 255, 255, 0.9)',
    white60: 'rgba(255, 255, 255, 0.6)',
    backdrop: 'rgba(255, 255, 255, 0.3)',
  },

  // Brand gradients (for LinearGradient)
  gradients: {
    primary: ['#66BB6A', '#388E3C'],       // Emerald to forest
    secondary: ['#9CCC65', '#81C784'],     // Lime to mint
    warm: ['#81C784', '#FF7043'],          // Mint to orange
    background: ['#E3F2FD', '#F3E5F5', '#FCE4EC'], // Blue to purple to pink
    card: ['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)'],
  },
};

// Dark mode colors (for future implementation)
export const darkColors = {
  ...colors,
  background: {
    primary: '#1A1A1A',        // hsl(210, 15%, 8%) - Dark background
    secondary: '#2A2A2A',      // Dark cards
    gradient: {
      purple: ['#4A148C', '#7B1FA2'],
      cyan: ['#006064', '#00838F'],
      emerald: ['#1B5E20', '#2E7D32'],
    }
  },
  text: {
    primary: '#F1F8E9',        // hsl(75, 20%, 95%) - Light green-tinted text
    secondary: '#CCCCCC',
    tertiary: '#999999',
    white: '#FFFFFF',
  },
};

export default colors;