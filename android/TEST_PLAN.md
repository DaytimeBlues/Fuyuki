# Android Test Plan

## Dependency Inventory (Android module)

### Build plugins
- `com.android.application` (Android Gradle Plugin) via `com.android.tools.build:gradle:9.0.0`
- `com.google.gms.google-services` (optional, applied only when `google-services.json` exists)
- `kotlin-android` via `org.jetbrains.kotlin:kotlin-gradle-plugin`

### Core libraries
- AndroidX AppCompat
- AndroidX CoordinatorLayout
- AndroidX Core SplashScreen
- Capacitor Android + Cordova plugins

### Test libraries
- JUnit 4
- AndroidX Test Ext JUnit
- Espresso Core

## Required Gradle Tasks

### Build & static checks
- `./gradlew clean`
- `./gradlew :app:assembleDebug`
- `./gradlew :app:testDebugUnitTest`

### Instrumentation (requires emulator/device)
- `./gradlew :app:connectedDebugAndroidTest`

## Notes
- `google-services.json` is optional in this project. If missing, the Google Services plugin is skipped and push notifications will be disabled.
- Instrumentation tests require an API 24+ emulator or device (matches `minSdkVersion`).
