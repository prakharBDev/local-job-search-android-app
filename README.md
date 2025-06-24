# BasicApp - React Native Project

A React Native application with proper Android configuration and navigation setup.

## Prerequisites

Before running this project, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** or **Yarn**
   - npm comes with Node.js
   - For Yarn: `npm install -g yarn`

3. **React Native CLI**
   ```bash
   npm install -g @react-native-community/cli
   ```

4. **Watchman** (for macOS users)
   ```bash
   brew install watchman
   ```

### Android Development Setup

#### Android Studio Requirements
1. **Android Studio** (latest version)
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install with default settings

2. **Android SDK Components** (install via Android Studio SDK Manager):
   - **Android SDK Platform-Tools** (latest)
   - **Android SDK Build-Tools** version 35.0.0
   - **Android API Level 35** (Android 15)
   - **Android NDK** version 29.0.13599879 (specific version required)

#### SDK Manager Installation Steps:
1. Open Android Studio
2. Go to `Tools` → `SDK Manager`
3. In **SDK Platforms** tab:
   - Check `Android 15.0 (API 35)`
4. In **SDK Tools** tab:
   - Check `Android SDK Build-Tools 35.0.0`
   - Check `Android SDK Platform-Tools`
   - Check `NDK (Side by side)` version `29.0.13599879`
5. Click `Apply` and `OK`

#### Environment Variables
Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
```

### iOS Development Setup (macOS only)

1. **Xcode** (latest version from App Store)
2. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```
3. **Ruby** (for dependency management)
   ```bash
   bundle install
   ```

## Project Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BasicApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   bundle exec pod install
   cd ..
   ```

4. **Android Local Configuration**
   The project includes a `local.properties` file with the correct Android SDK paths. If you have a different SDK location, update the file:
   ```
   sdk.dir=/path/to/your/Android/sdk
   ndk.dir=/path/to/your/Android/sdk/ndk/29.0.13599879
   ```

## Running the App

### Start Metro (JavaScript bundler)
```bash
npm start
# or
yarn start
```

### Run on Android
```bash
# Make sure you have an Android emulator running or device connected
npm run android
# or
yarn android
```

### Run on iOS (macOS only)
```bash
npm run ios
# or
yarn ios
```

## Project Structure

```
BasicApp/
├── App.tsx              # Main app component
├── src/
│   └── screens/
│       ├── HomeScreen.tsx
│       ├── AboutScreen.tsx
│       └── SettingsScreen.tsx
├── android/             # Android-specific code
├── ios/                 # iOS-specific code
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Key Configurations

### Android Build Configuration
- **NDK Version**: 29.0.13599879 (required for proper native compilation)
- **Build Tools**: 35.0.0
- **Compile SDK**: 35
- **Target SDK**: 35
- **Min SDK**: 24

### Dependencies
- React Native (latest)
- React Navigation (for navigation)
- TypeScript support
- ESLint and Prettier for code formatting

## Troubleshooting

### Common Android Issues

1. **NDK Error**: Ensure you have NDK version 29.0.13599879 installed
2. **Build Tools Error**: Install Build Tools version 35.0.0 via SDK Manager
3. **Metro Cache**: Clear cache with `npm start -- --reset-cache`

### Common iOS Issues

1. **Pod Install Error**: Run `cd ios && bundle exec pod install`
2. **Xcode Version**: Ensure you have the latest Xcode version

### Clean Build
```bash
# Clean Metro cache
npm start -- --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Clean iOS build (macOS only)
cd ios && xcodebuild clean && cd ..
```

## Development

### Available Scripts
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Hot Reload
The app supports Fast Refresh. Save any file to see changes immediately.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

This project is licensed under the MIT License.