#!/bin/bash

echo "🚀 Building Dr. Senait Dental Clinic for Play Store Release"
echo "============================================================"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
flutter clean

# Get dependencies
echo "📦 Getting dependencies..."
flutter pub get

# Generate launcher icons
echo "🎨 Generating launcher icons..."
flutter pub run flutter_launcher_icons

# Build App Bundle (recommended for Play Store)
echo "📱 Building App Bundle (AAB)..."
flutter build appbundle --release

# Build APK (for testing)
echo "📦 Building APK..."
flutter build apk --release

echo ""
echo "✅ Build Complete!"
echo "============================================================"
echo "📍 App Bundle location: build/app/outputs/bundle/release/app-release.aab"
echo "📍 APK location: build/app/outputs/apk/release/app-release.apk"
echo ""
echo "⚠️  Before uploading to Play Store:"
echo "   1. Test the release APK on a real device"
echo "   2. Verify all features work correctly"
echo "   3. Check that there are no crashes"
echo "   4. Upload the AAB file (not APK) to Play Store"
echo ""
