# React Native Styling Architecture Guide

## Overview

This guide establishes a consistent, maintainable, and theme-driven styling architecture for all React Native components in the JobApp project.

## Core Principles

1. **Zero Hardcoded Values**: All styling values must come from the theme system
2. **Separate Style Files**: Each component should have its own `.styles.js` file
3. **getStyles Pattern**: Use the `getStyles(theme)` function pattern consistently
4. **Performance Optimization**: Memoize styles with `useMemo` and use `React.memo` for pure components
5. **Theme Consistency**: Always provide fallback values for theme properties

## File Structure

```
ComponentName/
├── ComponentName.jsx          # Main component file
├── ComponentName.styles.js    # Styles file
└── index.js                  # Barrel export (optional)
```

## Styling Pattern

### 1. Component Structure

```javascript
// ComponentName.jsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getStyles } from './ComponentName.styles';

const ComponentName = React.memo(({ prop1, prop2 }) => {
  const { theme } = useTheme();

  // Memoize styles for performance
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{prop1}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{prop2}</Text>
      </TouchableOpacity>
    </View>
  );
});

export default ComponentName;
```

### 2. Styles File Structure

```javascript
// ComponentName.styles.js
import { StyleSheet } from 'react-native';

export const getStyles = theme =>
  StyleSheet.create({
    // Container styles
    container: {
      backgroundColor: theme.colors.background?.primary || '#FFFFFF',
      padding: theme.spacing[4] || 16,
      borderRadius: theme.borderRadius?.lg || 16,
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.primary || '#E2E8F0',
      ...theme.shadows?.md,
    },

    // Text styles
    title: {
      fontSize: theme.typography?.h3?.fontSize || 24,
      fontWeight: '600',
      color: theme.colors.text?.primary || '#1E293B',
      marginBottom: theme.spacing[3] || 12,
    },

    // Interactive elements
    button: {
      backgroundColor: theme.colors.primary?.main || '#3B82F6',
      paddingHorizontal: theme.spacing[4] || 16,
      paddingVertical: theme.spacing[3] || 12,
      borderRadius: theme.borderRadius?.md || 12,
      ...theme.shadows?.sm,
    },

    buttonText: {
      fontSize: theme.typography?.body?.fontSize || 16,
      fontWeight: '600',
      color: theme.colors.primary?.foreground || '#FFFFFF',
      textAlign: 'center',
    },
  });

// Additional theme-based utilities (if needed)
export const getVariantStyles = (theme, variant) => {
  const variants = {
    primary: theme.colors.primary?.main || '#3B82F6',
    secondary: theme.colors.secondary?.main || '#E2E8F0',
    success: theme.colors.status?.success || '#10B981',
    error: theme.colors.status?.error || '#EF4444',
  };
  return variants[variant] || variants.primary;
};
```

## Theme Usage Guidelines

### Colors

Always use theme colors with fallbacks:

```javascript
// ✅ Correct
backgroundColor: theme.colors.background?.primary || '#FFFFFF',
color: theme.colors.text?.primary || '#1E293B',

// ❌ Incorrect
backgroundColor: '#FFFFFF',
color: '#212121',
```

### Spacing

Use theme spacing values:

```javascript
// ✅ Correct
padding: theme.spacing[4] || 16,
marginBottom: theme.spacing[3] || 12,
gap: theme.spacing[2] || 8,

// ❌ Incorrect
padding: 16,
marginBottom: 12,
gap: 8,
```

### Typography

Use theme typography:

```javascript
// ✅ Correct
fontSize: theme.typography?.h3?.fontSize || 24,
lineHeight: theme.typography?.h3?.lineHeight || 32,

// ❌ Incorrect
fontSize: 24,
lineHeight: 32,
```

### Shadows and Borders

Use theme shadow objects:

```javascript
// ✅ Correct
...theme.shadows?.md,
borderRadius: theme.borderRadius?.lg || 16,

// ❌ Incorrect
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 2,
```

## Component Examples

### Example 1: Simple Card Component

```javascript
// Card.jsx
import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getStyles } from './Card.styles';

const Card = React.memo(({ title, content, variant = 'default' }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme, variant), [theme, variant]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
});

export default Card;
```

```javascript
// Card.styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme, variant = 'default') => {
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.status?.success || '#10B981';
      case 'error':
        return theme.colors.status?.error || '#EF4444';
      case 'warning':
        return theme.colors.status?.warning || '#F59E0B';
      default:
        return theme.colors.background?.secondary || '#F8FAFC';
    }
  };

  return StyleSheet.create({
    container: {
      backgroundColor: getVariantColor(),
      padding: theme.spacing[4] || 16,
      borderRadius: theme.borderRadius?.lg || 16,
      borderWidth: 1,
      borderColor: theme.colors.interactive?.border?.primary || '#E2E8F0',
      ...theme.shadows?.sm,
    },

    title: {
      fontSize: theme.typography?.h5?.fontSize || 18,
      fontWeight: '600',
      color: theme.colors.text?.primary || '#1E293B',
      marginBottom: theme.spacing[2] || 8,
    },

    content: {
      fontSize: theme.typography?.body?.fontSize || 16,
      color: theme.colors.text?.secondary || '#475569',
      lineHeight: theme.typography?.body?.lineHeight || 24,
    },
  });
};
```

## Migration Strategy

### Phase 1: High-Priority Components

1. Job-related components (PopularJobCard, RecentJobCard) ✅ **COMPLETED**
2. Navigation components (AppHeader, TabBar)
3. Form components (Input, Button, Select)

### Phase 2: Screen Components

1. Dashboard screens
2. Profile screens
3. Job screens
4. Onboarding screens

### Phase 3: Utility Components

1. Modal components
2. Loading components
3. Error components

## Performance Considerations

1. **Memoization**: Always memoize styles with `useMemo`
2. **React.memo**: Use for pure components to prevent unnecessary re-renders
3. **Theme Stability**: The theme object should be stable to prevent excessive recalculations

```javascript
// ✅ Correct - Memoized styles
const styles = useMemo(() => getStyles(theme), [theme]);

// ❌ Incorrect - Recalculated on every render
const styles = getStyles(theme);
```

## Testing Styles

1. **Theme Switching**: Test components with different themes
2. **Responsive Design**: Test on different screen sizes
3. **Accessibility**: Ensure proper contrast ratios and touch targets

## Common Patterns

### Dynamic Colors Based on Props

```javascript
export const getStyles = (theme, isActive, variant) =>
  StyleSheet.create({
    button: {
      backgroundColor: isActive
        ? theme.colors.primary?.main || '#3B82F6'
        : theme.colors.background?.secondary || '#F8FAFC',
      borderColor: isActive
        ? theme.colors.primary?.main || '#3B82F6'
        : theme.colors.interactive?.border?.primary || '#E2E8F0',
    },
  });
```

### Alpha/Opacity Values

```javascript
// Use template literals for alpha values
backgroundColor: theme.colors.primary?.main + '20' || '#3B82F620',
```

### Complex Component Variants

```javascript
export const getVariantStyles = theme => ({
  primary: {
    backgroundColor: theme.colors.primary?.main || '#3B82F6',
    color: theme.colors.primary?.foreground || '#FFFFFF',
  },
  secondary: {
    backgroundColor: theme.colors.secondary?.main || '#E2E8F0',
    color: theme.colors.secondary?.foreground || '#1E293B',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary?.main || '#3B82F6',
    color: theme.colors.primary?.main || '#3B82F6',
  },
});
```

## Troubleshooting

### Common Issues

1. **Theme undefined**: Always provide fallback values
2. **Performance issues**: Ensure proper memoization
3. **Inconsistent spacing**: Use theme spacing values consistently
4. **Color inconsistencies**: Always use theme colors

### Debugging

```javascript
// Add debug logging for theme issues
console.log('Theme colors available:', Object.keys(theme.colors || {}));
console.log('Theme spacing available:', Object.keys(theme.spacing || {}));
```

## Best Practices

1. **Naming Conventions**: Use descriptive style names (container, title, button, etc.)
2. **Organization**: Group related styles together (containers, text, interactions)
3. **Comments**: Add comments for complex calculations or layout decisions
4. **Consistency**: Follow the same pattern across all components
5. **Documentation**: Document any custom utilities or complex style logic

This guide ensures maintainable, consistent, and performant styling across the entire application.
