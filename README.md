# Seid Dental Clinic Mobile App

A comprehensive dental care companion app for Seid Dental Clinic, built with Flutter.

## 📱 App Information

- **App Name:** Seid Dental Clinic
- **Package Name:** `com.seiddental.app`
- **Bundle ID (iOS):** `com.seiddental.app`
- **Version:** 1.0.2+5

## 🎨 Branding

The app uses a clean White Blue theme that reflects Seid Dental Clinic's professional and modern identity:

- **Primary Color:** Seid Blue (#2196F3)
- **Accent Color:** Fountain Blue (#5DADE2)
- **Background:** Light blue tint (#F8FAFE)
- **Gradient:** White to Seid Blue

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (^3.10.1)
- Dart SDK
- Android Studio / Xcode for platform-specific builds

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Set up environment variables:
   - Copy `.env` file with required API configurations

4. Run the app:
   ```bash
   flutter run
   ```

## 🏗️ Project Structure

```
lib/
├── config/          # App routing and pages configuration
├── core/            # Core utilities, theme, and API client
├── data/            # Data sources, models, and repositories
├── domain/          # Domain models, repositories, and use cases
├── presentation/    # UI views, controllers, and widgets
└── main.dart        # App entry point
```

## 📦 Key Dependencies

- `get` - State management and routing
- `get_storage` - Local storage
- `flutter_dotenv` - Environment configuration
- `cloudinary_public` - Image management
- `image_picker` - Image selection
- `cached_network_image` - Image caching

## 🔧 Build Commands

### Android
```bash
flutter build apk --release
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
```

## 📄 License

Private - Not for public distribution
