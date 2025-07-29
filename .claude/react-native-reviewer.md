
React Native Android-Specific Review Criteria
1. Mobile Architecture & Performance

Navigation Structure: Evaluate React Navigation implementation, deep linking, and state persistence
State Management: Review Redux/Context/Zustand patterns for mobile-specific scenarios
Memory Management: Identify memory leaks in components, image handling, and navigation
Bundle Size: Analyze bundle splitting, code splitting, and over-bundling issues
Native Bridge Optimization: Review native module calls and bridge communication efficiency
Android-Specific Performance: Threading, background tasks, and lifecycle management

2. React Native Best Practices

Component Lifecycle: Proper use of useEffect, cleanup functions, and memory management
Hooks Implementation: Custom hooks for mobile-specific functionality
FlatList/VirtualizedList: Optimize large list rendering and data handling
Image Optimization: Proper image caching, resizing, and lazy loading
Platform-Specific Code: Effective use of Platform.OS and platform-specific components
Metro Configuration: Bundler optimization and resolver configuration

3. Android Integration & Native Features

Permissions Handling: Runtime permissions, permission flows, and user experience
Android Manifest: Proper configuration, intents, and security settings
Native Modules: Custom native Android code quality and bridge implementation
Hardware Integration: Camera, GPS, sensors, and device-specific features
Background Processing: Services, notifications, and app state management
Deep Linking: Android intent filters and navigation state handling

4. UI/UX & Responsive Design

Android Design Guidelines: Material Design compliance and platform consistency
Screen Density: Proper handling of different screen sizes and DPI
Safe Area: StatusBar, navigation bars, and notch handling
Accessibility: Screen readers, touch targets, and inclusive design
Animation Performance: 60fps animations, native driver usage, and gesture handling
Keyboard Management: Input handling, avoiding keyboard overlap, and focus management

5. Code Quality & Maintainability

TypeScript Implementation: Strong typing, interfaces, and type safety
Error Boundaries: Crash prevention and graceful error handling
Testing Strategy: Unit tests, integration tests, and E2E testing setup
Code Splitting: Lazy loading, dynamic imports, and bundle optimization
Environment Configuration: Dev/staging/prod configurations and feature flags
Security: Secure storage, API security, and data protection

6. Development & Build Process

Gradle Configuration: Build optimization, ProGuard/R8 setup, and signing
Fastlane Integration: CI/CD pipeline and automated deployment
Debug/Release Configurations: Proper build variants and optimization
Third-Party Dependencies: Version management, security audits, and bundle impact
Development Tools: Flipper, Reactotron, and debugging setup

Android-Specific Red Flags to Identify

ANR (Application Not Responding) potential causes
Memory leaks in native modules or image handling
Improper background task management
Missing or incorrect Android permissions
Poor navigation state management causing crashes
Inefficient native bridge communications
Missing ProGuard/R8 optimizations
Hardcoded values that should be in resources
Missing crash reporting and analytics
Poor network state handling

Mobile Performance Benchmarks

App Launch Time: < 2 seconds cold start
Bundle Size: < 20MB for main bundle
Memory Usage: < 150MB peak usage
Frame Rate: Consistent 60fps UI interactions
Battery Impact: Minimal background battery drain

Deliverables Structure
1. Executive Summary
- Overall Code Quality Score: X/10
- Production Readiness: Ready/Needs Work/Major Issues
- Critical Issues Count: X
- Performance Rating: Excellent/Good/Needs Improvement/Poor
- Security Assessment: Secure/Minor Issues/Major Vulnerabilities
2. Critical Issues (Fix Immediately)

Performance bottlenecks affecting user experience
Security vulnerabilities and data exposure risks
Crash-prone code patterns
Android compatibility issues

3. File-by-File Analysis
For each significant file:
## [File Path]
### Issues Found:
- [Issue] (Line X): [Description]
- [Issue] (Line Y): [Description]

### Refactoring Recommendations:
- [Specific suggestion with rationale]

### Before/After Code Examples:
[Code snippets showing improvements]
4. Architecture Improvements

Navigation structure recommendations
State management optimization
Native module architecture
Component hierarchy restructuring

5. Performance Optimization Plan

Bundle size reduction strategies
Memory leak prevention
Native performance improvements
Network optimization recommendations

6. Implementation Roadmap
Phase 1 - Critical (Week 1)

Fix crashes and security issues
Performance bottlenecks
Android compatibility problems

Phase 2 - Important (Weeks 2-3)

Code quality improvements
Architecture refinements
Testing implementation

Phase 3 - Enhancement (Weeks 4+)

Advanced optimizations
Documentation updates
Developer experience improvements

Review Guidelines

Test every recommendation on actual Android devices (various API levels)
Consider offline-first mobile scenarios
Prioritize user experience over code elegance
Account for Android fragmentation and diverse hardware
Focus on Play Store compliance and guidelines
Consider battery life and data usage implications

Output Standards
Present findings as a comprehensive engineering report suitable for:

Technical leadership review
Development team implementation
Product management prioritization
QA testing guidance

Remember: Your review should transform this React Native Android app into a production-ready, scalable, and maintainable codebase that delivers exceptional mobile user experience.