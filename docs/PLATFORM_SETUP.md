# Platform-Specific Setup Guide

> **Comprehensive setup instructions for Android and iOS development**

## 🎯 Overview

This guide provides detailed setup instructions for developing BasicApp on both Android and iOS platforms, including cross-platform development considerations.

## 📱 Android Development Setup

### Prerequisites

1. **Java Development Kit (JDK)**

   - **Required**: JDK 11 or higher
   - **Recommended**: JDK 17 (LTS)
   - **Download**: [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.java.net/)

2. **Android Studio**
   - **Required**: Android Studio latest stable version
   - **Download**: [Android Studio](https://developer.android.com/studio)
   - **Installation**: Follow default installation with all components

### Android SDK Configuration

#### Required SDK Components

Install via **Android Studio → Tools → SDK Manager**:

##### SDK Platforms Tab

- ✅ **Android 15.0 (API 35)** - Target platform
- ✅ **Android 14.0 (API 34)** - Fallback compatibility
- ✅ **Android 7.0 (API 24)** - Minimum supported version

##### SDK Tools Tab

- ✅ **Android SDK Build-Tools 35.0.0** - Build system
- ✅ **Android SDK Platform-Tools** - Latest version
- ✅ **Android SDK Tools** - Latest version
- ✅ **NDK (Side by side) 29.0.13599879** - Specific version required
- ✅ **Android Emulator** - For testing
- ✅ **Intel x86 Emulator Accelerator (HAXM)** - Performance boost

### Environment Variables

#### macOS/Linux Setup

Add to `~/.bashrc`, `~/.zshrc`, or `~/.profile`:

```bash
# Android SDK paths
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Java (if not system default)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home

# Reload shell configuration
source ~/.zshrc  # or ~/.bashrc
```

#### Windows Setup

1. **System Environment Variables**:

   - `ANDROID_HOME` = `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - `ANDROID_SDK_ROOT` = `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   - `JAVA_HOME` = `C:\Program Files\Java\jdk-17`

2. **PATH additions**:
   ```
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   %ANDROID_HOME%\platform-tools
   ```

### Project Configuration

#### Android Build Settings

File: `android/app/build.gradle`

```gradle
android {
    compileSdkVersion 35
    buildToolsVersion "35.0.0"

    defaultConfig {
        applicationId "com.basicapp"
        minSdkVersion 24
        targetSdkVersion 35
        versionCode 1
        versionName "1.0"
        multiDexEnabled true
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}
```

#### Local Properties

File: `android/local.properties`

```properties
# Android SDK location
sdk.dir=/Users/YourUsername/Library/Android/sdk

# NDK location (specific version required)
ndk.dir=/Users/YourUsername/Library/Android/sdk/ndk/29.0.13599879

# Build tools version
buildToolsVersion=35.0.0
```

### Android Emulator Setup

#### Creating an AVD (Android Virtual Device)

1. **Open Android Studio**
2. **Tools → AVD Manager**
3. **Create Virtual Device**
4. **Choose Device**: Pixel 6 Pro (recommended)
5. **System Image**: Android 15.0 (API 35) with Google APIs
6. **Configuration**:
   - **Name**: BasicApp_Test
   - **RAM**: 4GB (minimum)
   - **Storage**: 8GB (minimum)
   - **Graphics**: Hardware - GLES 2.0

#### Emulator Performance Tips

```bash
# Start emulator from command line
emulator -avd BasicApp_Test -gpu host

# Enable hardware acceleration
emulator -avd BasicApp_Test -gpu host -wipe-data -no-snapshot-load
```

### Android Development Commands

```bash
# Start development
npm run android

# Build APK for testing
cd android && ./gradlew assembleRelease

# Build bundle for Play Store
cd android && ./gradlew bundleRelease

# Clean Android build
cd android && ./gradlew clean

# Check Android setup
npx react-native doctor
```

## 🍎 iOS Development Setup (macOS Only)

### Prerequisites

1. **Xcode**

   - **Required**: Xcode 15+ (latest stable)
   - **Download**: Mac App Store
   - **Installation**: Full installation with all components

2. **Xcode Command Line Tools**

   ```bash
   xcode-select --install
   ```

3. **CocoaPods**

   ```bash
   # Install CocoaPods
   sudo gem install cocoapods

   # Update CocoaPods
   pod repo update
   ```

4. **iOS Simulator**
   - **Included**: With Xcode installation
   - **Additional Simulators**: Download via Xcode → Preferences → Components

### iOS Project Configuration

#### iOS Build Settings

File: `ios/BasicApp/Info.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>com.basicapp</string>
    <key>CFBundleName</key>
    <string>BasicApp</string>
    <key>CFBundleDisplayName</key>
    <string>BasicApp</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>MinimumOSVersion</key>
    <string>12.0</string>
</dict>
</plist>
```

#### Podfile Configuration

File: `ios/Podfile`

```ruby
# iOS deployment target
platform :ios, '12.0'

# Enable use_frameworks if needed
use_frameworks!

target 'BasicApp' do
  config = use_native_modules!

  # React Native configuration
  use_react_native!(
    :path => config[:reactNativePath],
    :production => false,
    :hermes_enabled => true
  )

  # Additional pods
  pod 'React-RCTLinkingIOS', :path => '../node_modules/react-native/Libraries/LinkingIOS'

  # Post install script
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
      end
    end
  end
end
```

### iOS Simulator Setup

#### Available Simulators

```bash
# List available simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 15 Pro"

# Open Simulator app
open -a Simulator
```

#### Recommended Simulators

- **iPhone 15 Pro** (Primary testing)
- **iPhone SE (3rd generation)** (Small screen testing)
- **iPad Pro 12.9-inch** (Tablet testing)

### iOS Development Commands

```bash
# Install iOS dependencies
cd ios && pod install && cd ..

# Start development
npm run ios

# Specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"

# Clean iOS build
cd ios && rm -rf build && cd ..

# Reset pods
cd ios && rm -rf Pods && pod install && cd ..
```

## 🔧 Cross-Platform Development

### Development Environment

#### VS Code Configuration

File: `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "files.associations": {
    "*.js": "javascriptreact",
    "*.jsx": "javascriptreact"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  }
}
```

#### VS Code Extensions

File: `.vscode/extensions.json`

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "orta.vscode-jest",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Platform-Specific Code Handling

#### Platform Detection

```typescript
import { Platform } from 'react-native';

const MyComponent = () => {
  const platformStyles = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  });

  return (
    <View style={[styles.container, platformStyles]}>
      {/* Component content */}
    </View>
  );
};
```

#### Platform-Specific Files

```
src/
├── components/
│   ├── Button.tsx           # Shared implementation
│   ├── Button.ios.tsx       # iOS-specific override
│   └── Button.android.tsx   # Android-specific override
```

#### Platform-Specific Imports

```typescript
// Automatically imports correct platform file
import Button from './components/Button'; // → Button.ios.tsx or Button.android.tsx
```

## 🧪 Testing Setup

### Device Testing

#### Android Device Testing

```bash
# List connected devices
adb devices

# Install on specific device
npx react-native run-android --device="Device_Name"

# Debug on device
adb logcat | grep ReactNativeJS
```

#### iOS Device Testing

```bash
# List connected devices
xcrun devicectl list devices

# Install on device (requires Apple Developer account)
npx react-native run-ios --device="Your iPhone"
```

### Build Testing

#### Android Build Testing

```bash
# Debug build
cd android && ./gradlew assembleDebug

# Release build
cd android && ./gradlew assembleRelease

# Test on device
adb install android/app/build/outputs/apk/release/app-release.apk
```

#### iOS Build Testing

```bash
# Debug build
npx react-native run-ios --configuration Debug

# Release build
npx react-native run-ios --configuration Release

# Archive build (requires Xcode)
# Open ios/BasicApp.xcworkspace in Xcode
# Product → Archive
```

## 🔧 Troubleshooting

### Common Android Issues

#### Build Errors

```bash
# Clean and rebuild
cd android && ./gradlew clean && cd ..
rm -rf node_modules && npm install
cd android && ./gradlew assembleDebug

# NDK issues
# Ensure NDK version 29.0.13599879 is installed
# Check android/local.properties for correct path
```

#### Emulator Issues

```bash
# Restart emulator
adb kill-server
adb start-server

# Wipe emulator data
emulator -avd BasicApp_Test -wipe-data
```

#### Metro Bundler Issues

```bash
# Reset Metro cache
npx react-native start --reset-cache

# Kill Metro process
kill $(lsof -t -i:8081)
```

### Common iOS Issues

#### Pod Installation Issues

```bash
# Update CocoaPods
gem install cocoapods
pod repo update

# Clean and reinstall
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
```

#### Simulator Issues

```bash
# Reset simulator
xcrun simctl erase all

# Boot simulator
xcrun simctl boot "iPhone 15 Pro"
```

#### Build Issues

```bash
# Clean Xcode build
cd ios && rm -rf build && cd ..

# Derived data cleanup
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

### Universal Troubleshooting

```bash
# Complete project reset
rm -rf node_modules
npm install
cd ios && pod install && cd ..
cd android && ./gradlew clean && cd ..
npx react-native start --reset-cache
```

## 📱 Production Setup

### Android Production

#### Signing Configuration

File: `android/app/build.gradle`

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Build Commands

```bash
# Generate signed APK
cd android && ./gradlew assembleRelease

# Generate signed bundle
cd android && ./gradlew bundleRelease
```

### iOS Production

#### Code Signing

1. **Apple Developer Account** required
2. **Provisioning Profiles** setup
3. **Certificates** installation
4. **Automatic signing** recommended for development

#### Build Commands

```bash
# Release build
npx react-native run-ios --configuration Release

# Archive (use Xcode)
# Product → Archive → Distribute App
```

## 📊 Performance Optimization

### Android Optimization

```bash
# Enable Hermes engine
# Already enabled in android/app/build.gradle

# Optimize bundle size
cd android && ./gradlew bundleRelease

# Analyze APK
./gradlew :app:analyzeReleaseBundle
```

### iOS Optimization

```bash
# Enable Hermes engine
# Already enabled in ios/Podfile

# Optimize bundle size
npx react-native bundle --platform ios --dev false --bundle-output ios/main.jsbundle

# Analyze bundle
npx react-native-bundle-visualizer
```

## 📚 Additional Resources

### Documentation

- [React Native Documentation](https://reactnative.dev/)
- [Android Developer Documentation](https://developer.android.com/)
- [iOS Developer Documentation](https://developer.apple.com/documentation/)

### Tools

- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)
- [React Native CLI](https://github.com/react-native-community/cli)

### Community

- [React Native Community](https://github.com/react-native-community)
- [React Native Discord](https://discord.gg/react-native)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

---

**Platform-specific setup can be complex, but following these guidelines ensures a smooth development experience across both iOS and Android platforms.**

For more information, see:

- [Development Guide](DEVELOPMENT.md)
- [Code Quality Guidelines](CODE_QUALITY.md)
- [Architecture Overview](ARCHITECTURE.md)
