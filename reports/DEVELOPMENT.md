# React Native Job Portal - Development Guide

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Setup

```bash
# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🛠 Development Scripts

### Core Commands

```bash
npm run lint              # Check for linting issues
npm run lint:fix          # Auto-fix linting issues
npm run lint:check        # Lint with zero warnings tolerance
npm run format            # Format code with Prettier
npm run format:check      # Check if code is properly formatted
npm run type-check        # TypeScript type checking
npm run cleanup           # Run format + lint:fix + type-check
npm run start:reset       # Start with cache reset
npm run test              # Run tests
npm run test:watch        # Run tests in watch mode
```

### Quality Assurance

```bash
# Full quality check before committing
npm run cleanup
npm run test
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   └── ui/              # Core UI components (Button, Input, etc.)
├── contexts/            # React Context providers
├── navigation/          # Navigation configuration
├── screens/             # Screen components
├── theme/               # Theme and styling
└── types/               # TypeScript type definitions
```

## 🎨 Theming

The app uses a centralized theme system located in `src/theme/`:

- `colors.ts` - Color palette
- `spacing.ts` - Spacing constants
- `typography.ts` - Font styles
- `index.ts` - Main theme export

## 🧭 Navigation

The app uses React Navigation v7 with:

- Stack Navigator for main navigation
- Bottom Tab Navigator for primary screens
- Deep linking support
- Authentication flow

## 🔐 Authentication

Mock authentication system with:

- Splash screen
- Login screen (Google Auth placeholder)
- Auth context for state management
- Route protection

## 🎯 Code Quality

### ESLint Rules

- React Native specific rules
- React Hooks validation
- TypeScript strict mode
- Custom warning/error levels

### Prettier Configuration

- 2-space indentation
- Single quotes
- Trailing commas
- Automatic formatting on save

### TypeScript Configuration

- Strict type checking
- Null checks enabled
- Exact optional properties
- No unchecked indexed access

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Development Environment
NODE_ENV=development

# API Configuration
API_BASE_URL=https://your-api-endpoint.com/api
API_TIMEOUT=30000

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id

# Push Notifications
FCM_SERVER_KEY=your-fcm-server-key

# Analytics (Optional)
ANALYTICS_API_KEY=your-analytics-key

# Development Tools
FLIPPER_ENABLED=true
REACTOTRON_ENABLED=true

# Debugging
DEBUG=false
LOG_LEVEL=info
```

## 🧪 Testing

### Test Structure

```bash
__tests__/
├── App.test.tsx         # App component tests
└── components/          # Component tests
```

### Running Tests

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

## 📱 Platform Specific

### Android

- Target SDK: Latest stable
- Min SDK: 21 (Android 5.0)
- Build tools: Latest stable

### iOS

- Deployment target: iOS 12.0+
- Latest Xcode version recommended

## 🔄 Git Workflow

### Husky Git Hooks

- Pre-commit: Runs lint-staged
- Pre-push: Runs type checking

### Lint-staged Configuration

- Auto-fixes ESLint issues
- Formats code with Prettier
- Only processes staged files

### Commit Convention

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation issue"
git commit -m "docs: update development guide"
```

## 🚀 Deployment

### Android

```bash
# Generate signed APK
cd android && ./gradlew assembleRelease

# Generate bundle for Play Store
cd android && ./gradlew bundleRelease
```

### iOS

```bash
# Build for release
npx react-native run-ios --configuration Release
```

## 🐛 Debugging

### Development Tools

- **React Native Debugger**: Enhanced debugging experience
- **Flipper**: Native debugging and performance monitoring
- **Reactotron**: React Native debugging tool

### Common Issues

1. **Metro bundler issues**: Try `npm run start:reset`
2. **Cache issues**: Clear npm cache and reinstall
3. **iOS build issues**: Clean Xcode build folder
4. **Android build issues**: Clean and rebuild project

## 📦 Dependencies

### Core Dependencies

- React Native 0.74.7
- React 18.2.0
- React Navigation v7
- AsyncStorage for persistence

### Development Dependencies

- TypeScript 5.0.4
- ESLint + Prettier
- Husky + lint-staged
- Jest for testing

## 🎯 Performance

### Optimization Tips

- Use FlatList for large lists
- Implement lazy loading for images
- Optimize bundle size with ProGuard (Android)
- Use Hermes JavaScript engine

### Monitoring

- Track app performance with built-in tools
- Monitor bundle size
- Use performance profiling tools

## 🔧 Troubleshooting

### Common Commands

```bash
# Reset everything
npx react-native clean-project-auto

# Reset Metro cache
npx react-native start --reset-cache

# Reset iOS
cd ios && rm -rf build && cd ..

# Reset Android
cd android && ./gradlew clean && cd ..
```

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

---

Happy coding! 🎉
