#!/bin/bash

# AD Dental Clinic - Release Build Script
# This script builds the app for Play Store release

set -e  # Exit on error

echo "🏗️  Building AD Dental Clinic for Play Store Release..."
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean
flutter pub get

echo ""
echo "📦 Building App Bundle (AAB) for Play Store..."
flutter build appbundle --release

echo ""
echo "📱 Building APK for testing..."
flutter build apk --release

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📍 Output files:"
echo "   - App Bundle (for Play Store): build/app/outputs/bundle/release/app-release.aab"
echo "   - APK (for testing): build/app/outputs/flutter-apk/app-release.apk"
echo ""
echo "📤 Next steps:"
echo "   1. Test the APK on a real device: flutter install --release"
echo "   2. Upload the AAB file to Play Store Console"
echo "   3. Complete all Play Store requirements (see PLAY_STORE_CHECKLIST.md)"
echo ""
