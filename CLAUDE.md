# Claude Code Configuration

## Cross-Platform React Native Development

### Project Overview
- **Platform**: React Native 0.80.0 (Mac) / 0.74.7 (Windows)
- **Language**: TypeScript (preferred) with JSX components
- **Development**: Cross-platform Windows/Mac compatibility

### Common Commands

#### Development
```bash
npm start              # Start Metro bundler
npm run android        # Run on Android (requires Android SDK)
npm run ios           # Run on iOS (Mac only)
npm test              # Run Jest tests
npm run lint          # Run ESLint
```

#### Cross-Platform Considerations
- Use forward slashes `/` in paths for cross-platform compatibility
- Environment variables: Use `$VAR` (Unix) or `%VAR%` (Windows) as needed
- Line endings: Auto-handled by .gitattributes

### Linting & Code Quality
- **ESLint**: `npm run lint`
- **Prettier**: Integrated with ESLint
- **TypeScript**: Use .tsx for React components, .ts for utilities

### Platform-Specific Notes

#### Windows Development
- Android SDK paths configured in `android/local.properties`
- Use Git Bash or PowerShell for commands
- WSL compatibility for Unix-style paths

#### Mac Development  
- Native iOS development support
- Xcode required for iOS builds
- CocoaPods for iOS dependencies

### Branch Management
- **main/master**: Stable production code
- **feature/landingPage&dashboard**: Mac development (RN 0.80.0)
- **another-branch**: Windows development (RN 0.74.7)

### Migration Guidelines
1. Maintain TypeScript types when migrating from .jsx to .tsx
2. Test on both platforms before merging
3. Use relative imports for cross-platform compatibility
4. Keep Android/iOS configs platform-neutral where possible

### Troubleshooting
- Clear Metro cache: `npx react-native start --reset-cache`
- Clean build: `cd android && ./gradlew clean`
- Reset Node modules: `rm -rf node_modules && npm install`