# React Native Job Portal - Stable V1

## 🎯 Overview

This is the **stable v1** branch that consolidates features from three development branches:

- `feature/landingPage&dashboard`: Enhanced UI with animations and dashboard
- `another-branch`: Windows compatibility and linting improvements
- `feature/job-portal-navigation-taskmaster`: Navigation system and job portal functionality

## ✨ Features

### 🚀 Cross-Platform Support

- **Mac Development Environment**: React Native 0.80.0, React 19.1.0
- **Windows Compatibility**: Paths, line endings, and SDK configurations
- **Unified Linting**: ESLint + Prettier with cross-platform rules

### 🧭 Navigation & Authentication

- **React Navigation**: Bottom tabs with seeker/poster mode switching
- **Authentication Context**: Login/logout state management
- **User Context**: Profile and mode (seeker/poster) management
- **TypeScript Navigation**: Fully typed navigation stack

### 🎨 Enhanced UI Components

- **Landing Page**: Animated IndexScreen with floating elements and rocket imagery
- **Dashboard**: Interactive dashboard with stats, quick actions, and recent activity
- **Job Portal**: Applied jobs screen, job listings, and application tracking
- **Theme System**: Forest Fresh green theme with glassmorphism effects

### 🔧 Development Tools

- **Taskmaster MCP**: Integration with task-master-ai for enhanced development
- **Cross-Platform Config**: .gitattributes, .eslintrc.js, .prettierrc.js
- **TypeScript**: Strict typing with vector icons support
- **Development Guidelines**: CLAUDE.md with cross-platform commands

## 🏗️ Architecture

### Project Structure

```
src/
├── components/ui/        # Reusable UI components (Button, Card, Input, Badge)
├── contexts/            # React contexts (Auth, User)
├── navigation/          # Navigation components (MainNavigator)
├── screens/            # Screen components (Dashboard, IndexScreen, etc.)
├── theme/              # Theme system (colors, typography, spacing)
└── types/              # TypeScript type definitions
```

### Key Components

- **App.tsx**: NavigationContainer with AuthProvider/UserProvider
- **MainNavigator.tsx**: Tab navigation with mode switching
- **AuthContext.tsx**: Authentication state management
- **UserContext.tsx**: User profile and mode management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- React Native development environment
- Xcode (Mac) or Android Studio

### Installation

```bash
# Install dependencies
npm install

# iOS specific (Mac only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Development Commands

```bash
npm run lint          # ESLint check
npm run lint:fix       # Auto-fix linting issues
npm run format         # Prettier formatting
npm run type-check     # TypeScript compilation check
npm start:reset        # Start with cache reset
```

## 🔧 Configuration

### MCP/Taskmaster Setup

- Copy `.env.example` to `.env` and add your API keys
- Taskmaster configuration is in `.cursor/mcp.json`
- Supports multiple AI providers (Anthropic, OpenAI, Perplexity, etc.)

### Cross-Platform Development

- **Line Endings**: Handled by `.gitattributes`
- **Paths**: Use forward slashes for cross-platform compatibility
- **Environment Variables**: Use `$VAR` (Unix) or `%VAR%` (Windows)

## 📱 Screens & Navigation

### Seeker Mode (Job Seekers)

- **Dashboard**: Job search progress and stats
- **Applied Jobs**: Track job applications
- **Profile**: User profile management

### Poster Mode (Employers)

- **Dashboard**: Job posting analytics
- **My Jobs**: Manage posted jobs
- **Profile**: Company profile management

### Shared Screens

- **Landing Page**: Animated welcome screen with features showcase
- **Job Details**: View/edit job postings
- **Job Applications**: Manage applications for posted jobs

## 🎨 Theme System

### Colors

- **Primary**: Forest Fresh green (#66BB6A, #388E3C)
- **Secondary**: Light nature tones (#9CCC65, #81C784)
- **Accent**: Warm orange for CTAs (#FF7043)
- **Background**: Soft gradients with glassmorphism

### Components

- Consistent design system across all UI components
- Responsive spacing and typography
- Vector icons with Feather icon set

## 🐛 Known Issues & Fixes

### TypeScript

- ✅ Vector icons types installed
- ✅ Navigation types fully configured
- ⚠️ Minor parse function syntax (non-breaking)

### Cross-Platform

- ✅ Windows SDK paths configured for Mac
- ✅ Line ending consistency enforced
- ✅ Linting rules unified

## 🔄 Migration Notes

### From Windows Branch

- Rocket asset migrated to `src/assests/rocket_1323780.png`
- Enhanced dashboard with Feather icons
- Improved TypeScript compliance

### From Taskmaster Branch

- Complete navigation system integrated
- Authentication and user contexts added
- Job portal functionality preserved

## 🧪 Testing

### Manual Testing

1. **Landing Page**: Check animations and floating elements
2. **Navigation**: Test tab switching between seeker/poster modes
3. **Dashboard**: Verify stats display and interactions
4. **Theme**: Confirm consistent styling across screens

### Build Testing

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Lint check
npm run lint

# Format check
npm run format:check
```

## 🚀 Next Steps

### Production Readiness

1. Fix remaining TypeScript syntax issues in navigation types
2. Add comprehensive test suite
3. Implement proper error boundaries
4. Add crash reporting and analytics

### Feature Enhancements

1. Real API integration for job data
2. Push notifications for job updates
3. Advanced filtering and search
4. Resume upload and parsing

## 📞 Support

- **Development Guidelines**: See `CLAUDE.md`
- **Cross-Platform Issues**: Check `.gitattributes` and config files
- **MCP/Taskmaster**: Reference `.cursor/mcp.json` configuration

---

**Built with ❤️ using React Native, TypeScript, and Claude Code**

🤖 Generated with [Claude Code](https://claude.ai/code)
