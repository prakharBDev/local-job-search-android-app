import React, { createContext, useContext, useState, useMemo } from 'react';
import { bluewhiteTheme } from '../theme/bluewhite-theme';

// Create context
const ThemeContext = createContext();

// Theme registry for extensibility
const themes = {
  bluewhite: bluewhiteTheme,
};

// Theme provider component
export const ThemeProvider = ({ children, initialTheme = 'bluewhite' }) => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const value = useMemo(
    () => ({
      theme: themes[currentTheme],
      currentTheme,
      availableThemes: Object.keys(themes),
      setTheme: themeName => {
        if (themes[themeName]) {
          setCurrentTheme(themeName);
        } else {
          console.warn(
            `Theme "${themeName}" not found. Available themes: ${Object.keys(
              themes,
            ).join(', ')}`,
          );
        }
      },
      isLoading: false,
    }),
    [currentTheme],
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

// HOC for theme-aware components
export const withTheme = Component => {
  return props => {
    const themeProps = useTheme();
    return <Component {...props} {...themeProps} />;
  };
};

export default ThemeContext;
