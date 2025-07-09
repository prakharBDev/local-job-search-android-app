# Development Guide

> **Comprehensive development documentation for BasicApp React Native project**

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18 ([Download](https://nodejs.org/))
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Android Studio** ([Download](https://developer.android.com/studio))
- **Xcode** (macOS only - App Store)
- **Watchman** (macOS only): `brew install watchman`

### Environment Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd BasicApp

# 2. Install dependencies
npm install

# 3. iOS setup (macOS only)
cd ios && pod install && cd ..

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Android Development Setup

#### Required Android SDK Components

1. **Android Studio** (latest version)
2. **SDK Components** (install via SDK Manager):
   - Android SDK Build-Tools 35.0.0
   - Android SDK Platform-Tools (latest)
   - Android API Level 35 (Android 15)
   - Android NDK version 29.0.13599879

#### Environment Variables

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
```

## 🛠 Development Commands

### Core Development

```bash
# Start development
npm start                    # Start Metro bundler
npm run android             # Run on Android device/emulator
npm run ios                 # Run on iOS device/simulator (macOS only)
npm run start:reset         # Start with cache reset

# Development utilities
npm run cleanup             # Format, lint, and type-check
npm run test                # Run Jest tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
```

### Code Quality

```bash
# Linting and formatting
npm run lint                # ESLint checking
npm run lint:fix            # Auto-fix linting issues
npm run lint:check          # Lint with zero warnings tolerance
npm run format              # Prettier formatting
npm run format:check        # Check if code is properly formatted
npm run type-check          # TypeScript compilation check
```

### Quality Monitoring

```bash
# Quality pipeline
npm run quality:check       # Quick quality validation
npm run quality:report      # Generate comprehensive quality report
npm run quality:gate        # Run quality gate validation
npm run quality:full        # Complete quality pipeline
```

### Build and Deployment

```bash
# Build commands
npm run build               # Build for production
npm run security:audit      # Security vulnerability scan
```

## 📁 Project Structure

```
BasicApp/
├── 📁 src/
│   ├── 🧩 components/          # Reusable UI components
│   │   ├── ui/                 # Core UI library
│   │   │   ├── Button.jsx      # Button component
│   │   │   ├── Card.jsx        # Card component
│   │   │   ├── Input.jsx       # Input component
│   │   │   ├── Badge.jsx       # Badge component
│   │   │   └── index.js        # UI exports
│   │   ├── ThemedButton.tsx    # Styled-components button
│   │   ├── ThemedCard.tsx      # Styled-components card
│   │   ├── ThemedInput.tsx     # Styled-components input
│   │   └── themed/             # Themed components
│   ├── 🖼️ screens/             # Screen components
│   │   ├── IndexScreen.jsx     # Landing page (1008 lines - needs refactor)
│   │   ├── DashboardScreen.jsx # Dashboard
│   │   ├── AppliedJobsScreen.jsx # Applied jobs
│   │   ├── MyJobsScreen.jsx    # My jobs
│   │   ├── ProfileScreen.jsx   # Profile management
│   │   └── ...                 # Other screens
│   ├── 🧭 navigation/          # Navigation configuration
│   │   └── MainNavigator.jsx   # Main navigation setup
│   ├── 🎨 theme/               # Design system
│   │   ├── colors.js           # Color palette
│   │   ├── typography.js       # Typography system
│   │   ├── spacing.js          # Spacing constants
│   │   ├── bluewhite.ts        # Main theme (TypeScript)
│   │   └── index.js            # Theme exports
│   ├── 🔧 contexts/            # React contexts
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── UserContext.jsx     # User state
│   │   ├── ProfileContext.jsx  # Profile state
│   │   └── ThemeContext.jsx    # Theme state
│   ├── 🛠️ utils/               # Utility functions
│   │   └── supabase.js         # Supabase client
│   └── 📝 types/               # TypeScript definitions
│       └── styled.d.ts         # Styled-components types
├── 📁 docs/                    # Documentation
├── 📁 scripts/                 # Quality automation scripts
├── 📁 reports/                 # Development reports
├── 📁 android/                 # Android-specific code
├── 📁 ios/                     # iOS-specific code
├── 📁 .github/                 # GitHub Actions workflows
└── 📁 .husky/                  # Git hooks
```

## 🎨 Theme System

### Theme Structure

The app uses a centralized theme system with:

- **Primary Theme**: `src/theme/bluewhite.ts` (TypeScript)
- **Colors**: Comprehensive color palette with variants
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Components**: Component-specific theme values

### Theme Usage

```typescript
// Using theme in components
import { useTheme } from '../contexts/ThemeContext';

const Component = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background.primary,
        padding: theme.spacing.md,
      }}
    >
      <Text
        style={{
          color: theme.colors.text.primary,
          fontSize: theme.typography.h2.fontSize,
        }}
      >
        Themed Text
      </Text>
    </View>
  );
};
```

## 🧭 Navigation

### Navigation Structure

- **React Navigation 7**: Modern navigation library
- **Stack Navigation**: Main navigation pattern
- **Tab Navigation**: Bottom tabs for primary screens
- **Authentication Flow**: Login/logout navigation
- **Deep Linking**: URL-based navigation support

### Navigation Implementation

```typescript
// App.tsx - Main navigation setup
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 🔐 Authentication

### Authentication Flow

1. **Splash Screen**: Initial loading screen
2. **Login Screen**: Authentication interface
3. **Protected Routes**: Authenticated navigation
4. **Logout**: Clear authentication state

### Authentication Context

```typescript
// Using authentication context
import { useAuth } from '../contexts/AuthContext';

const Component = () => {
  const { isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return <DashboardScreen onLogout={logout} />;
};
```

## 🎯 Code Quality Standards

### File Organization

- **Components**: Max 200 lines
- **Screens**: Max 300 lines
- **Utilities**: Max 150 lines
- **Consistent Structure**: Follow established patterns

### TypeScript Usage

```typescript
// Component props interface
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

// Component implementation
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  children,
}) => {
  // Implementation
};
```

### Code Quality Metrics

- **Overall Score**: 70+ required for merge
- **File Size**: Enforced by pre-commit hooks
- **Code Duplication**: <3% threshold
- **Test Coverage**: 60+ required
- **TypeScript Usage**: 50+ required

## 🧪 Testing

### Test Structure

```
__tests__/
├── App.test.tsx              # App component tests
├── components/               # Component unit tests
│   ├── Button.test.tsx       # Button component tests
│   ├── Card.test.tsx         # Card component tests
│   └── ...                   # Other component tests
├── screens/                  # Screen integration tests
├── hooks/                    # Custom hooks tests
└── utils/                    # Utility function tests
```

### Test Examples

```typescript
// Component test example
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../src/components/ui/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Button onPress={jest.fn()}>Test Button</Button>,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button onPress={mockOnPress}>Test Button</Button>,
    );

    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

## 📱 Platform Specific Development

### Android Development

#### Build Configuration

- **Compile SDK**: 35
- **Target SDK**: 35
- **Min SDK**: 24
- **Build Tools**: 35.0.0
- **NDK**: 29.0.13599879

#### Development Commands

```bash
# Android specific commands
npm run android                     # Run on Android
cd android && ./gradlew clean      # Clean Android build
cd android && ./gradlew assembleRelease # Build APK
```

### iOS Development (macOS only)

#### Requirements

- **Xcode**: Latest version
- **iOS Deployment Target**: 12.0+
- **CocoaPods**: For dependency management

#### Development Commands

```bash
# iOS specific commands
npm run ios                        # Run on iOS
cd ios && pod install             # Install iOS dependencies
cd ios && rm -rf build            # Clean iOS build
```

## 🔄 Git Workflow

### Pre-commit Hooks

Automated checks run on every commit:

1. **File Size Check**: Prevent oversized files
2. **Code Duplication**: Detect duplicate code
3. **Linting**: ESLint validation
4. **Formatting**: Prettier formatting
5. **Type Checking**: TypeScript compilation

### Commit Message Format

```bash
# Conventional commit format
feat: add user authentication system
fix: resolve navigation memory leak
docs: update development guide
test: add unit tests for user service
style: fix component spacing
refactor: optimize button performance
```

### Quality Gates

- **Pre-commit**: Basic quality checks
- **Pre-push**: Type checking and tests
- **CI/CD**: Full quality pipeline
- **Merge**: Quality gate validation

## 🐛 Debugging & Troubleshooting

### Common Issues

#### Metro Bundler Issues

```bash
# Reset Metro cache
npm run start:reset

# Clear all caches
npx react-native clean-project-auto

# Reset node_modules
rm -rf node_modules && npm install
```

#### Build Issues

```bash
# Android build issues
cd android && ./gradlew clean && cd ..

# iOS build issues (macOS only)
cd ios && rm -rf build && cd ..
cd ios && pod install && cd ..

# TypeScript issues
npm run type-check
```

#### Quality Issues

```bash
# Check current quality status
npm run quality:check

# Generate detailed quality report
npm run quality:report

# Fix common issues
npm run cleanup
```

### Development Tools

- **React Native Debugger**: Enhanced debugging
- **Flipper**: Native debugging and performance
- **Chrome DevTools**: JavaScript debugging
- **React DevTools**: Component inspection

## 🚀 Performance Optimization

### Optimization Strategies

1. **Component Optimization**

   - Use `React.memo` for functional components
   - Implement `useMemo` and `useCallback`
   - Optimize re-renders with proper dependencies

2. **Navigation Optimization**

   - Lazy load screens
   - Implement proper screen transitions
   - Use navigation optimizations

3. **Bundle Optimization**
   - Code splitting where appropriate
   - Remove unused dependencies
   - Optimize image assets

### Performance Monitoring

```typescript
// Performance monitoring example
import { performance } from 'perf_hooks';

const Component = () => {
  const start = performance.now();

  // Component logic

  const end = performance.now();
  console.log(`Component render time: ${end - start}ms`);
};
```

## 📦 Dependencies Management

### Core Dependencies

- **React Native**: 0.74.7
- **React**: 18.2.0
- **React Navigation**: 7.x
- **TypeScript**: 5.0.4
- **Styled Components**: 6.1.19

### Development Dependencies

- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Jest**: Testing framework
- **TypeScript**: Type checking

### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Check for unused dependencies
npm run quality:check
```

## 🔧 Environment Configuration

### Environment Variables

Create `.env` file:

```bash
# Development Environment
NODE_ENV=development

# API Configuration
API_BASE_URL=https://your-api-endpoint.com/api
API_TIMEOUT=30000

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id

# Development Tools
FLIPPER_ENABLED=true
DEBUG=false
```

### Configuration Files

- **`.eslintrc.js`**: ESLint configuration
- **`prettier.config.js`**: Prettier configuration
- **`tsconfig.json`**: TypeScript configuration
- **`jest.config.js`**: Jest configuration
- **`metro.config.js`**: Metro bundler configuration

## 📚 Additional Resources

### Documentation

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)

### Development Tools

- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Reactotron](https://infinite.red/reactotron)

---

**Happy coding! 🚀**

For more information, see:

- [Code Quality Guidelines](CODE_QUALITY.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Automated Review Setup](AUTOMATED_REVIEW.md)
