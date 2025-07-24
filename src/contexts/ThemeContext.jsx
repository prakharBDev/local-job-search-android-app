import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { bluewhiteTheme } from '../theme/bluewhite-theme';

// Create context
const ThemeContext = createContext();

// Theme registry for extensibility
const themes = {
  bluewhite: bluewhiteTheme,
};

// Theme provider component - Optimized for performance
export const ThemeProvider = ({ children, initialTheme = 'bluewhite' }) => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  // Memoize the setTheme function for performance
  const setTheme = useCallback(themeName => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    } else {
      console.warn(
        `Theme "${themeName}" not found. Available themes: ${Object.keys(
          themes,
        ).join(', ')}`,
      );
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      theme: themes[currentTheme],
      currentTheme,
      availableThemes: Object.keys(themes),
      setTheme,
      isLoading: false,
    }),
    [currentTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Granular hook for colors only
 * Optimized for components that only need color information
 */
export const useColors = () => {
  const { theme } = useTheme();
  return theme?.colors || {};
};

/**
 * Granular hook for spacing only
 * Optimized for components that only need spacing information
 */
export const useSpacing = () => {
  const { theme } = useTheme();
  return theme?.spacing || {};
};

/**
 * Granular hook for typography only
 * Optimized for components that only need typography information
 */
export const useTypography = () => {
  const { theme } = useTheme();
  return theme?.typography || {};
};

/**
 * Granular hook for shadows only
 * Optimized for components that only need shadow information
 */
export const useShadows = () => {
  const { theme } = useTheme();
  return theme?.shadows || {};
};

/**
 * Granular hook for border radius only
 * Optimized for components that only need border radius information
 */
export const useBorderRadius = () => {
  const { theme } = useTheme();
  return theme?.borderRadius || {};
};

/**
 * Granular hook for theme mode only
 * Optimized for components that only need theme switching information
 */
export const useThemeMode = () => {
  const { theme, currentTheme, setTheme } = useTheme();
  return { theme, currentTheme, setTheme };
};

// HOC for theme-aware components
export const withTheme = Component => {
  return props => {
    const themeProps = useTheme();
    return <Component {...props} {...themeProps} />;
  };
};

export default ThemeContext;
