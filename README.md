# BasicApp - React Native Job Portal

> **A comprehensive React Native application with automated code quality, cross-platform support, and modern architecture.**

[![React Native](https://img.shields.io/badge/React%20Native-0.74.7-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue.svg)](https://www.typescriptlang.org/)
[![Code Quality](https://img.shields.io/badge/Code%20Quality-Automated-green.svg)](#-automated-code-quality)
[![Cross Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey.svg)](#-cross-platform-support)

## 🎯 Overview

BasicApp is a professional React Native job portal application featuring:

- **🚀 Modern Architecture**: Clean, maintainable code with TypeScript
- **🔍 Automated Code Quality**: Husky hooks, ESLint, Prettier, and quality gates
- **🌐 Cross-Platform**: Seamless iOS and Android development
- **🎨 Design System**: Consistent UI components and theming
- **🧭 Navigation**: React Navigation with authentication flows
- **📊 Quality Monitoring**: Real-time quality metrics and reporting

## 📚 Documentation Index

### 🚀 Getting Started

- [**Quick Start Guide**](#-quick-start) - Get up and running in 5 minutes
- [**Prerequisites**](#-prerequisites) - Required software and tools
- [**Installation**](#-installation) - Step-by-step setup

### 🏗️ Development

- [**Development Guide**](docs/DEVELOPMENT.md) - Comprehensive development documentation
- [**Project Structure**](#-project-structure) - Architecture overview
- [**Cross-Platform Development**](docs/CROSS_PLATFORM.md) - Windows & Mac development
- [**Code Quality Guidelines**](docs/CODE_QUALITY.md) - Standards and best practices

### 🎨 Architecture & Design

- [**Architecture Analysis**](docs/ARCHITECTURE.md) - Technical architecture overview
- [**Design System**](docs/DESIGN_SYSTEM.md) - UI components and theming
- [**Navigation Flow**](docs/NAVIGATION.md) - Screen organization and routing

### 🔧 Advanced Topics

- [**Automated Code Review**](docs/AUTOMATED_REVIEW.md) - Quality automation setup
- [**Platform-Specific Setup**](docs/PLATFORM_SETUP.md) - Android & iOS configurations
- [**Deployment Guide**](docs/DEPLOYMENT.md) - Production deployment

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **React Native CLI**: `npm install -g @react-native-community/cli`
- **Android Studio** ([Download](https://developer.android.com/studio))
- **Xcode** (macOS only - App Store)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd BasicApp

# 2. Install dependencies
npm install

# 3. iOS setup (macOS only)
cd ios && pod install && cd ..

# 4. Start Metro bundler
npm start

# 5. Run the app
npm run android  # For Android
npm run ios      # For iOS
```

### Quick Development Commands

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run start:reset   # Start with cache reset

# Code Quality
npm run cleanup       # Format, lint, and type-check
npm run quality:full  # Generate quality report
npm run test:coverage # Run tests with coverage

# Build
npm run build        # Build for production
```

## 🏗️ Project Structure

```
BasicApp/
├── 📁 src/
│   ├── 🧩 components/          # Reusable UI components
│   │   ├── ui/                 # Core UI library (Button, Card, Input)
│   │   └── shared/             # Shared business components
│   ├── 🖼️ screens/             # Screen components
│   ├── 🧭 navigation/          # Navigation configuration
│   ├── 🎨 theme/               # Design system (colors, typography)
│   ├── 🔧 contexts/            # React contexts (Auth, User)
│   ├── 🔗 hooks/               # Custom React hooks
│   ├── 🛠️ utils/               # Utility functions
│   ├── 📡 services/            # API and external services
│   └── 📝 types/               # TypeScript definitions
├── 📁 docs/                    # Comprehensive documentation
├── 📁 scripts/                 # Quality automation scripts
├── 📁 reports/                 # Development reports
├── 📁 android/                 # Android-specific code
├── 📁 ios/                     # iOS-specific code
└── 📁 .github/                 # GitHub Actions workflows
```

## ✨ Key Features

### 🎨 Modern UI Components

- **Design System**: Consistent typography, colors, and spacing
- **Reusable Components**: Button, Card, Input, Badge with variants
- **Theme Support**: Light/dark mode with Forest Fresh green theme
- **Animations**: Smooth transitions and micro-interactions

### 🔍 Automated Code Quality

- **Pre-commit Hooks**: Automated linting, formatting, and type checking
- **Quality Gates**: Fail builds on quality issues
- **Real-time Monitoring**: File size, duplication, and complexity tracking
- **CI/CD Integration**: GitHub Actions with quality reporting

### 🧭 Professional Navigation

- **React Navigation 7**: Modern navigation patterns
- **Authentication Flow**: Login, signup, and protected routes
- **Deep Linking**: URL-based navigation support
- **Type Safety**: Fully typed navigation stack

### 🌐 Cross-Platform Support

- **iOS & Android**: Single codebase for both platforms
- **Windows Development**: Compatible with Windows development environment
- **Platform-Specific Code**: Proper platform handling where needed

## 🔧 Development Scripts

### Core Development

```bash
npm start              # Start Metro bundler
npm run android        # Run on Android device/emulator
npm run ios           # Run on iOS device/simulator
npm run start:reset   # Start with cache reset
```

### Code Quality

```bash
npm run lint          # ESLint checking
npm run lint:fix       # Auto-fix linting issues
npm run format        # Prettier formatting
npm run type-check    # TypeScript compilation check
npm run cleanup       # Run all quality checks
```

### Quality Monitoring

```bash
npm run quality:check    # Quick quality validation
npm run quality:report   # Generate comprehensive quality report
npm run quality:gate     # Run quality gate validation
npm run quality:full     # Complete quality pipeline
```

### Testing

```bash
npm test               # Run Jest tests
npm run test:coverage  # Run tests with coverage report
npm run test:watch     # Run tests in watch mode
```

### Build & Deployment

```bash
npm run build         # Build for production
npm run security:audit # Security vulnerability scan
```

## 🎯 Quality Standards

### File Organization

- **Components**: Max 200 lines
- **Screens**: Max 300 lines
- **Utilities**: Max 150 lines
- **No Duplicate Code**: <3% duplication threshold

### Code Quality Metrics

- **Overall Score**: 70+ required for merge
- **Test Coverage**: 60+ required
- **TypeScript Usage**: 50+ required
- **Performance Score**: 60+ required

### Automated Checks

- **Pre-commit**: File size, duplicates, linting, formatting
- **CI/CD**: Full quality pipeline with security scanning
- **Quality Gates**: Automatic merge blocking on quality issues

## 🚀 Available Scripts Reference

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm start`             | Start Metro bundler          |
| `npm run android`       | Run on Android               |
| `npm run ios`           | Run on iOS                   |
| `npm run cleanup`       | Format, lint, and type-check |
| `npm run quality:full`  | Complete quality pipeline    |
| `npm run test:coverage` | Run tests with coverage      |
| `npm run build`         | Build for production         |

## 📱 Platform-Specific Setup

### Android Requirements

- **Android Studio**: Latest version
- **SDK Tools**: Build-tools 35.0.0, Platform-tools, NDK 29.0.13599879
- **API Level**: 35 (Android 15)
- **Min SDK**: 24 (Android 7.0)

### iOS Requirements (macOS only)

- **Xcode**: Latest version from App Store
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Deployment Target**: 12.0+

## 🧪 Testing

### Test Structure

```
__tests__/
├── App.test.tsx              # App component tests
├── components/               # Component unit tests
├── screens/                  # Screen integration tests
├── hooks/                    # Custom hooks tests
└── utils/                    # Utility function tests
```

### Coverage Requirements

- **Unit Tests**: 80% minimum coverage
- **Integration Tests**: All critical user flows
- **Component Tests**: All UI components
- **End-to-End**: Key user journeys

## 🔄 Git Workflow

### Automated Quality Checks

- **Pre-commit**: Runs on every commit
- **Pre-push**: Type checking and tests
- **CI/CD**: Full quality pipeline on PR

### Commit Message Format

```bash
feat: add user authentication system
fix: resolve navigation memory leak
docs: update development guide
test: add unit tests for user service
```

## 🐛 Troubleshooting

### Common Issues

```bash
# Metro bundler issues
npm run start:reset

# Clear all caches
npx react-native clean-project-auto

# iOS build issues
cd ios && rm -rf build && cd ..

# Android build issues
cd android && ./gradlew clean && cd ..
```

### Quality Issues

```bash
# Check file sizes
npm run quality:check

# Generate quality report
npm run quality:report

# Fix common issues
npm run cleanup
```

## 📞 Support & Contributing

### Documentation

- **Development Guide**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **Code Quality**: [docs/CODE_QUALITY.md](docs/CODE_QUALITY.md)
- **Architecture**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

### Contributing

1. Fork the repository
2. Create a feature branch
3. Run `npm run quality:full` before committing
4. Submit a pull request with quality report

### Getting Help

- **Quality Issues**: Check quality reports in `reports/` directory
- **Build Issues**: See platform-specific setup guides
- **Code Review**: Automated reports in CI/CD

## 📊 Project Status

### ✅ Completed

- Modern React Native setup with TypeScript
- Automated code quality system
- Cross-platform development support
- Navigation and authentication flows
- UI component library
- Quality monitoring and reporting

### 🔄 In Progress

- Comprehensive test suite
- Performance optimization
- Production deployment setup

### 📋 Planned

- Advanced search and filtering
- Push notifications
- Analytics integration
- Real-time updates

---

## 🎉 Quick Links

- [**🚀 Development Guide**](docs/DEVELOPMENT.md) - Start developing
- [**🔍 Code Quality**](docs/CODE_QUALITY.md) - Quality standards
- [**🏗️ Architecture**](docs/ARCHITECTURE.md) - Technical overview
- [**📱 Platform Setup**](docs/PLATFORM_SETUP.md) - iOS/Android setup
- [**🤖 Automated Review**](docs/AUTOMATED_REVIEW.md) - Quality automation

Built with ❤️ using React Native, TypeScript, and automated quality assurance.

🤖 Generated with [Claude Code](https://claude.ai/code)
