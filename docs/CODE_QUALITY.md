# Code Quality Guidelines

> **Comprehensive code quality standards and automated quality assurance for BasicApp**

## 🎯 Overview

This document outlines the code quality standards, automated processes, and best practices for maintaining high-quality, maintainable code in the BasicApp React Native project.

## 📊 Quality Metrics & Standards

### Overall Quality Score

Our quality system uses a weighted scoring system (0-100):

- **File Size (20%)**: Penalty for files exceeding size limits
- **Code Duplication (25%)**: Penalty for duplicate code patterns
- **Test Coverage (30%)**: Percentage of code covered by tests
- **TypeScript Usage (15%)**: Percentage of .ts/.tsx files vs .js/.jsx
- **Performance (10%)**: Performance optimization opportunities

### Quality Gate Thresholds

| Metric               | Threshold | Description                      |
| -------------------- | --------- | -------------------------------- |
| **Overall Score**    | ≥70       | Minimum score for merge approval |
| **File Size**        | ≥60       | File size score threshold        |
| **Code Duplication** | ≥70       | Duplication score threshold      |
| **Test Coverage**    | ≥60%      | Minimum test coverage            |
| **TypeScript Usage** | ≥50%      | TypeScript adoption threshold    |
| **Performance**      | ≥60       | Performance score threshold      |

## 📏 File Size Standards

### Size Limits by File Type

| File Type      | Max Lines | Rationale                       |
| -------------- | --------- | ------------------------------- |
| **Components** | 200       | Maintainability and reusability |
| **Screens**    | 300       | Complex UI logic acceptable     |
| **Contexts**   | 200       | Clear state management          |
| **Utils**      | 150       | Focused utility functions       |
| **Services**   | 200       | API and external service logic  |

### Large File Remediation

```typescript
// ❌ Bad: Large component (500+ lines)
const LargeScreen = () => {
  // 500+ lines of mixed logic
  return (
    <ScrollView>{/* Complex UI with multiple responsibilities */}</ScrollView>
  );
};

// ✅ Good: Split into focused components
const UserProfile = () => {
  /* 50 lines */
};
const UserSettings = () => {
  /* 80 lines */
};
const UserActivity = () => {
  /* 70 lines */
};

const ProfileScreen = () => (
  <ScrollView>
    <UserProfile />
    <UserSettings />
    <UserActivity />
  </ScrollView>
);
```

## 🔍 Code Duplication Prevention

### Duplication Detection

Our system automatically detects:

- **Similar function structures**
- **Duplicate styling patterns**
- **Repeated import statements**
- **Identical utility functions**
- **Similar component patterns**

### Duplication Remediation

```typescript
// ❌ Bad: Duplicate styling
const styles1 = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#3C4FE0',
  },
});

const styles2 = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#3C4FE0',
  },
});

// ✅ Good: Shared theme system
import { theme } from '../theme';

const styles = StyleSheet.create({
  button: {
    ...theme.components.button,
    backgroundColor: theme.colors.primary.main,
  },
});
```

## 📝 TypeScript Standards

### Type Safety Requirements

- **No `any` types**: Use specific types or `unknown`
- **Strict null checks**: Handle null and undefined explicitly
- **Interface definitions**: All component props must be typed
- **Return types**: Functions must have explicit return types

### TypeScript Examples

```typescript
// ✅ Good: Proper interface definition
interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onEdit: () => void;
  onDelete: (userId: string) => Promise<void>;
}

// ✅ Good: Proper component typing
const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  const handleDelete = async (): Promise<void> => {
    await onDelete(user.id);
  };

  return (
    <Card>
      <Text>{user.name}</Text>
      <Button onPress={onEdit}>Edit</Button>
      <Button onPress={handleDelete}>Delete</Button>
    </Card>
  );
};
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## 🧪 Testing Standards

### Test Coverage Requirements

- **Unit Tests**: 80% minimum coverage
- **Integration Tests**: All critical user flows
- **Component Tests**: All UI components
- **Hook Tests**: All custom hooks
- **End-to-End Tests**: Key user journeys

### Test Structure

```typescript
// ✅ Good: Comprehensive test structure
describe('UserProfile Component', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(
      <UserProfile user={mockUser} onEdit={jest.fn()} onDelete={jest.fn()} />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is pressed', () => {
    const mockOnEdit = jest.fn();
    render(
      <UserProfile user={mockUser} onEdit={mockOnEdit} onDelete={jest.fn()} />,
    );

    fireEvent.press(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with correct userId', async () => {
    const mockOnDelete = jest.fn().mockResolvedValue(undefined);
    render(
      <UserProfile
        user={mockUser}
        onEdit={jest.fn()}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.press(screen.getByText('Delete'));
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });
});
```

## ⚡ Performance Standards

### Performance Optimization Requirements

- **React.memo**: Use for functional components
- **useMemo/useCallback**: For expensive calculations
- **StyleSheet.create**: For component styles
- **FlatList optimization**: For large lists
- **Image optimization**: Proper loading and caching

### Performance Examples

```typescript
// ✅ Good: Optimized component
import React, { memo, useMemo, useCallback } from 'react';

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = memo(({ users, onUserSelect }) => {
  const sortedUsers = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users],
  );

  const handleUserSelect = useCallback(
    (user: User) => {
      onUserSelect(user);
    },
    [onUserSelect],
  );

  const renderUser = useCallback(
    ({ item }: { item: User }) => (
      <UserItem user={item} onSelect={handleUserSelect} />
    ),
    [handleUserSelect],
  );

  return (
    <FlatList
      data={sortedUsers}
      renderItem={renderUser}
      keyExtractor={item => item.id}
      getItemLayout={(data, index) => ({
        length: 60,
        offset: 60 * index,
        index,
      })}
    />
  );
});
```

## 🎨 Code Style Standards

### Naming Conventions

```typescript
// Components: PascalCase
const UserProfile = () => {
  /* ... */
};

// Variables: camelCase
const userName = 'john';
const isAuthenticated = true;

// Constants: UPPER_SNAKE_CASE
const API_ENDPOINT = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

// Files: Match component names
UserProfile.tsx;
userHelpers.ts;
AuthContext.tsx;
```

### Code Organization

```typescript
// ✅ Good: Organized imports
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// External libraries
import AsyncStorage from '@react-native-async-storage/async-storage';

// Internal components
import { Button, Card } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

// Types
import type { User } from '../types/user';

// Component implementation
const UserProfile: React.FC<Props> = ({ user }) => {
  // State
  const [loading, setLoading] = useState(false);

  // Hooks
  const navigation = useNavigation();
  const { logout } = useAuth();

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Callbacks
  const handleLogout = useCallback(async () => {
    setLoading(true);
    await logout();
    navigation.navigate('Login');
    setLoading(false);
  }, [logout, navigation]);

  // Render
  return <View style={styles.container}>{/* JSX */}</View>;
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

## 🔧 Automated Quality Checks

### Pre-commit Hooks

Every commit triggers:

1. **File Size Validation**: Check for oversized files
2. **Code Duplication Detection**: Scan for duplicate patterns
3. **ESLint Validation**: Code quality and standards
4. **Prettier Formatting**: Code formatting
5. **TypeScript Compilation**: Type checking
6. **Test Execution**: Run related tests

### Quality Scripts

```bash
# Quick quality check
npm run quality:check

# Generate comprehensive report
npm run quality:report

# Run quality gates
npm run quality:gate

# Full quality pipeline
npm run quality:full
```

### Quality Reports

The system generates:

- **JSON Report**: `quality-report.json`
- **Markdown Report**: `quality-report.md`
- **Console Summary**: Real-time feedback
- **PR Comments**: Automated quality feedback

## 📋 ESLint Configuration

### Core Rules

```javascript
// .eslintrc.js
module.exports = {
  extends: ['@react-native'],
  rules: {
    // File size enforcement
    'max-lines': ['error', { max: 300, skipComments: true }],
    'max-lines-per-function': ['error', { max: 50, skipComments: true }],
    complexity: ['error', { max: 10 }],

    // React Native specific
    'react-native/no-unused-styles': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',

    // Performance
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',

    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
```

## 🔄 Continuous Integration

### GitHub Actions Pipeline

```yaml
# .github/workflows/code-quality.yml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - run: npm run type-check
      - run: npm run test:coverage
      - run: npm run quality:full
```

### Quality Gate Integration

- **Merge Blocking**: PRs blocked if quality gates fail
- **Status Checks**: Required status checks for merging
- **Automated Comments**: Quality reports in PR comments
- **Trend Monitoring**: Track quality metrics over time

## 📊 Quality Monitoring

### Quality Dashboard

Track key metrics:

- **Overall Quality Score**: Trending over time
- **File Size Distribution**: Monitor large files
- **Code Duplication**: Track duplication percentage
- **Test Coverage**: Coverage trends
- **TypeScript Adoption**: Migration progress

### Quality Alerts

Automated alerts for:

- **Quality Score Drop**: Below threshold
- **Large Files**: New oversized files
- **High Duplication**: Duplication increase
- **Low Coverage**: Coverage decrease
- **Performance Issues**: Performance regression

## 🛠️ Development Workflow

### Daily Development Process

1. **Start Development**

   ```bash
   npm run start:reset
   ```

2. **Before Each Commit**

   ```bash
   npm run cleanup
   npm run quality:check
   ```

3. **Before Creating PR**

   ```bash
   npm run quality:full
   npm run test:coverage
   ```

4. **Monitor Quality**
   ```bash
   npm run quality:report
   ```

### Fixing Quality Issues

#### Large Files

```bash
# Find large files
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -nr | head -10

# Refactor large files into smaller components
```

#### Code Duplication

```bash
# Check for duplicates
npm run quality:check

# Manual refactoring required
# Extract common patterns into utilities
```

#### Low Test Coverage

```bash
# Run tests with coverage
npm run test:coverage

# Add tests for uncovered code
```

## 🎯 Best Practices Summary

### Component Development

1. **Keep components small** (< 200 lines)
2. **Use proper TypeScript types**
3. **Implement proper testing**
4. **Optimize for performance**
5. **Follow naming conventions**

### Code Organization

1. **Organize imports properly**
2. **Use consistent file structure**
3. **Extract reusable logic**
4. **Maintain clear separation of concerns**
5. **Document complex logic**

### Quality Maintenance

1. **Run quality checks regularly**
2. **Address issues promptly**
3. **Monitor quality trends**
4. **Participate in code reviews**
5. **Continuously improve standards**

## 🚀 Quick Reference

### Quality Commands

```bash
# Quick checks
npm run quality:check      # File size & duplication
npm run lint              # ESLint validation
npm run type-check        # TypeScript check

# Comprehensive analysis
npm run quality:report     # Full quality report
npm run quality:gate       # Quality gate validation
npm run quality:full       # Complete pipeline

# Fix issues
npm run cleanup           # Auto-fix formatting & linting
npm run lint:fix          # Auto-fix linting issues
npm run format            # Format code
```

### Quality Thresholds

- **Overall Score**: ≥70
- **File Size**: ≥60
- **Code Duplication**: ≥70
- **Test Coverage**: ≥60%
- **TypeScript**: ≥50%
- **Performance**: ≥60

---

**Remember**: Quality is everyone's responsibility. These guidelines ensure we maintain a codebase that's maintainable, performant, and enjoyable to work with.

For more information, see:

- [Development Guide](DEVELOPMENT.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Automated Review Setup](AUTOMATED_REVIEW.md)
