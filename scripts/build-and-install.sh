#!/bin/bash

# Android Release Build and Install Script
# This script builds a release APK and installs it on the connected device

set -e  # Exit on any error

echo "🚀 Starting Android Release Build and Install..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if device is connected
print_status "Checking for connected Android devices..."
DEVICES=$(adb devices | grep -v "List of devices attached" | grep -v "^$" | wc -l)

if [ "$DEVICES" -eq 0 ]; then
    print_error "No Android devices found. Please connect your device and enable USB debugging."
    exit 1
fi

print_success "Found $(adb devices | grep -v "List of devices attached" | grep -v "^$" | wc -l) device(s)"

# Clean previous builds
print_status "Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Create assets directory if it doesn't exist
print_status "Creating assets directory..."
mkdir -p android/app/src/main/assets

# Bundle JavaScript code
print_status "Bundling JavaScript code..."
npx react-native bundle \
    --platform android \
    --dev false \
    --entry-file index.js \
    --bundle-output android/app/src/main/assets/index.android.bundle \
    --assets-dest android/app/src/main/res/

# Build release APK
print_status "Building release APK..."
cd android
./gradlew assembleRelease
cd ..

# Find the APK file
APK_PATH=$(find android/app/build -name "app-release.apk" -type f | head -n 1)

if [ -z "$APK_PATH" ]; then
    print_error "APK file not found!"
    exit 1
fi

# Get APK size
APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
print_success "APK built successfully! Size: $APK_SIZE"

# Install on device
print_status "Installing APK on device..."
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    print_success "APK installed successfully on device!"
    print_status "You can now find the app on your device as 'BasicApp'"
else
    print_error "Failed to install APK on device"
    exit 1
fi

# Optional: Open the app
read -p "Do you want to launch the app now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Launching app..."
    adb shell am start -n com.basicapp/.MainActivity
    print_success "App launched!"
fi

print_success "Build and install process completed!"
print_status "APK location: $APK_PATH"
print_status "APK size: $APK_SIZE" 